import type { Highlight, ThreadDraft, Reply } from './types.ts';
import { cleanText } from './cleanText.ts';

export type RenderThreadOpts = {
  footerUrl?: string;
  hashtag?: string;
};

const MAX_GRAPHEMES = 300;

const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });

export function graphemeLength(s: string): number {
  let n = 0;
  for (const _ of segmenter.segment(s)) n += 1;
  return n;
}

function truncateGraphemes(s: string, max: number): string {
  if (graphemeLength(s) <= max) return s;
  const out: string[] = [];
  let count = 0;
  for (const seg of segmenter.segment(s)) {
    if (count + 1 > max - 1) break;
    out.push(seg.segment);
    count += 1;
  }
  let joined = out.join('');
  const lastSpace = joined.lastIndexOf(' ');
  if (lastSpace > 0 && joined.length - lastSpace < 30) joined = joined.slice(0, lastSpace);
  return joined.replace(/[\s,;:.!?-]+$/u, '') + '…';
}

const formatDateFr = (isoDate: string): string => {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(dt);
};

function buildLead(date: string, opts: RenderThreadOpts): string {
  const header = `Top 3 des publications de presse les plus relayées sur Bluesky le ${date} :`;
  const footer = opts.footerUrl ? `Retrouvez la revue de presse complète : ${opts.footerUrl}` : '';
  const tag = opts.hashtag ?? '';

  const candidates = [
    [header, footer, tag],
    [header, footer],
    [header, tag],
    [header],
  ];
  for (const parts of candidates) {
    const text = parts.filter(Boolean).join('\n\n');
    if (graphemeLength(text) <= MAX_GRAPHEMES) return text;
  }
  return truncateGraphemes(header, MAX_GRAPHEMES);
}

function buildReply(rank: number, h: Highlight): Reply {
  const handle = h.screenName;
  const prefix = `${rank}. `;
  const mention = `@${handle}`;
  const cleanSnippet = cleanText(h.text).replace(/\s+/g, ' ').trim();

  const byteStart = Buffer.byteLength(prefix, 'utf8');
  const byteEnd = byteStart + Buffer.byteLength(mention, 'utf8');

  if (cleanSnippet.length === 0) {
    const text = `${prefix}${mention}`;
    return { text, handle, embedUri: h.url, mentionRange: { byteStart, byteEnd } };
  }

  const head = `${prefix}${mention} — `;
  const headLen = graphemeLength(head);
  const snippetBudget = MAX_GRAPHEMES - headLen;
  const snippet = truncateGraphemes(cleanSnippet, snippetBudget);
  const text = `${head}${snippet}`;
  return { text, handle, embedUri: h.url, mentionRange: { byteStart, byteEnd } };
}

export function renderThread(
  highlights: Highlight[],
  isoDate: string,
  opts: RenderThreadOpts = {},
): ThreadDraft {
  if (highlights.length !== 3) {
    throw new Error(`renderThread: expected exactly 3 highlights, got ${highlights.length}`);
  }
  const date = formatDateFr(isoDate);
  const lead = { text: buildLead(date, opts) };
  const replies = highlights.map((h, i) => buildReply(i + 1, h));
  for (const r of replies) {
    if (graphemeLength(r.text) > MAX_GRAPHEMES) {
      throw new Error(`renderThread: reply ${r.handle} exceeds 300 graphemes (${graphemeLength(r.text)})`);
    }
  }
  return { lead, replies };
}
