// Tiny structural parser for the constrained markdown the daily-summary
// generator emits: paragraphs, "- " bullet lists, and inline **bold**.
// Bluesky-style outlet handles (e.g. `lemonde.fr`) become linkified
// `handle` segments — but only when the candidate appears in the curated
// allowlist (KNOWN_BLUESKY_HANDLES) so no link can ever point at a profile
// Mistral hallucinated.
//
// Heading blocks (#, ##, ###, …) are intentionally dropped: the system
// prompt forbids them, the page provides its own H1 ("Synthèse du …"),
// and Mistral's thematic labels (« Économie », « Culture », …) tend to
// mis-categorise (a canicule paper isn't economy news).
//
// Output is a typed block list so the renderer in the design-system can
// loop block-by-block without doing any string parsing of its own
// (Mitosis JSX struggles with that).

import {
  dropParentheticalHandleCitations,
  normalizeBrandNamesToHandles,
  resolveBlueskyHandle,
} from './bluesky-handles';

export type SummaryInlineSegment =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; value: string }
  /** Bluesky-style outlet handle, e.g. `lemonde.fr`. Rendered as a link to
   *  https://bsky.app/profile/{value}. The asterisks Mistral sometimes wraps
   *  around handles (`*lemonde.fr*`, used as French-press citation style)
   *  are stripped — the link itself signals the citation visually. */
  | { kind: 'handle'; value: string };

export type SummaryBlock =
  | { kind: 'paragraph'; segments: SummaryInlineSegment[] }
  | { kind: 'bullets'; items: SummaryInlineSegment[][] };

export function parseSummaryMarkdown(markdown: string): SummaryBlock[] {
  if (!markdown.trim()) return [];

  // Pre-normalize brand-name variations (e.g. "Le Monde", "L'AFP",
  // "Mediapart.fr") into their canonical handles before any parsing —
  // covers Mistral's tendency to expand acronyms or capitalise handles.
  // Then drop any redundant "(handle)" parentheticals (Mistral often
  // cites the same outlet twice: once inline, once in parens).
  const normalized = dropParentheticalHandleCitations(
    normalizeBrandNamesToHandles(markdown),
  );

  const blocks: SummaryBlock[] = [];
  // Split into "block-level" chunks on blank lines, but treat consecutive
  // bullet lines as one block.
  const lines = normalized.replace(/\r\n/g, '\n').split('\n');
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

    // Headings are dropped — the system prompt forbids them and the page
    // provides its own H1 above the summary content. See file-level note.
    if (/^#+\s/.test(line)) {
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
      if (/^#+\s/.test(nextLine) || nextLine.startsWith('- ')) break;
      para.push(nextLine);
      i++;
    }
    blocks.push({ kind: 'paragraph', segments: parseInline(para.join(' ')) });
  }

  return blocks;
}

function parseInline(text: string): SummaryInlineSegment[] {
  // Inline grammar (matched in this priority order):
  //   1. `**bold**`
  //   2. `*handle.tld*` — italicised Bluesky handles (citation-style); the
  //      asterisks are stripped, the handle becomes a link.
  //   3. `handle.tld` — bare Bluesky-style dotted handles.
  // Everything else stays plain text.
  //
  // The handle regex is intentionally strict (lowercase, at least one dot,
  // tail >= 2 chars) to avoid linkifying random words like "p.ex" or
  // sentence-ending abbreviations.
  const out: SummaryInlineSegment[] = [];
  const HANDLE = '[a-z][a-z0-9-]*(?:\\.[a-z0-9-]+)+';
  const re = new RegExp(
    `\\*\\*([^*]+)\\*\\*|\\*(${HANDLE})\\*|(${HANDLE})`,
    'gi',
  );
  let last = 0;
  let m: RegExpExecArray | null = re.exec(text);
  while (m !== null) {
    if (m.index > last) {
      out.push({ kind: 'text', value: text.slice(last, m.index) });
    }
    if (m[1] !== undefined) {
      out.push({ kind: 'bold', value: m[1] });
    } else if (m[2] !== undefined || m[3] !== undefined) {
      const raw = (m[2] ?? m[3])!;
      // Resolve runs both the allowlist and the alias map — picks up
      // canonical handles directly and rewrites aliased capitalisations
      // (e.g. "AFP.fr" the dotted-form route would otherwise miss).
      const resolved = resolveBlueskyHandle(raw);
      if (resolved !== null) {
        out.push({ kind: 'handle', value: resolved });
      } else {
        // Looks like a handle (dotted lowercase) but neither the allowlist
        // nor the alias map recognise it — keep as plain text so no broken
        // link is rendered. Include the wrapping asterisks for italic-
        // style hits so the original prose stays visually intact.
        out.push({ kind: 'text', value: m[0]! });
      }
    }
    last = m.index + m[0]!.length;
    m = re.exec(text);
  }
  if (last < text.length) {
    out.push({ kind: 'text', value: text.slice(last) });
  }

  return out;
}
