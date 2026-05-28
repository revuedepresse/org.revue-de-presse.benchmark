// Tiny structural parser for the constrained markdown the daily-summary
// generator emits: # / ## / ### headings, paragraphs, "- " bullet lists,
// and inline **bold**. No tables, no code, no links — the system prompt
// forbids them and they'd need a real lib (marked/markdown-it) to handle.
//
// Output is a typed block list so the renderer in the design-system can
// loop block-by-block without doing any string parsing of its own
// (Mitosis JSX struggles with that).

export type SummaryInlineSegment =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; value: string };

export type SummaryBlock =
  | { kind: 'heading'; level: 1 | 2 | 3; segments: SummaryInlineSegment[] }
  | { kind: 'paragraph'; segments: SummaryInlineSegment[] }
  | { kind: 'bullets'; items: SummaryInlineSegment[][] };

export function parseSummaryMarkdown(markdown: string): SummaryBlock[] {
  if (!markdown.trim()) return [];

  const blocks: SummaryBlock[] = [];
  // Split into "block-level" chunks on blank lines, but treat consecutive
  // bullet lines as one block.
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    if (raw === undefined) {
      i++;
      continue;
    }
    const line = raw.trim();
    if (line === '') {
      i++;
      continue;
    }

    // Headings — # / ## / ### (we cap at 3, deeper levels render as paragraph).
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1]!.length as 1 | 2 | 3;
      blocks.push({ kind: 'heading', level, segments: parseInline(headingMatch[2]!) });
      i++;
      continue;
    }

    // Bullet list — collect consecutive "- " lines.
    if (line.startsWith('- ')) {
      const items: SummaryInlineSegment[][] = [];
      while (i < lines.length) {
        const nextRaw = lines[i];
        const nextLine = nextRaw === undefined ? '' : nextRaw.trim();
        if (!nextLine.startsWith('- ')) break;
        items.push(parseInline(nextLine.slice(2)));
        i++;
      }
      blocks.push({ kind: 'bullets', items });
      continue;
    }

    // Paragraph — consume until blank or block-starting line.
    const para: string[] = [line];
    i++;
    while (i < lines.length) {
      const nextRaw = lines[i];
      if (nextRaw === undefined) break;
      const nextLine = nextRaw.trim();
      if (nextLine === '') break;
      if (/^#{1,3}\s/.test(nextLine) || nextLine.startsWith('- ')) break;
      para.push(nextLine);
      i++;
    }
    blocks.push({ kind: 'paragraph', segments: parseInline(para.join(' ')) });
  }

  return blocks;
}

function parseInline(text: string): SummaryInlineSegment[] {
  // Inline grammar: **bold** spans, anything else is plain text.
  const out: SummaryInlineSegment[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null = re.exec(text);
  while (m !== null) {
    if (m.index > last) {
      out.push({ kind: 'text', value: text.slice(last, m.index) });
    }
    out.push({ kind: 'bold', value: m[1]! });
    last = m.index + m[0]!.length;
    m = re.exec(text);
  }
  if (last < text.length) {
    out.push({ kind: 'text', value: text.slice(last) });
  }

  return out;
}
