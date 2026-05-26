import type { Highlight, ThreadDraft, Reply, LinkRange, MentionRange } from './types.ts';
import { cleanText } from './cleanText.ts';

export type RenderThreadOpts = {
  footerUrl?: string;
  hashtag?: string;
};

const MAX_GRAPHEMES = 300;

const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });

// Same shape as @atproto/api richtext detection: an `@` preceded by start /
// whitespace / `(`, then a `[a-zA-Z0-9.-]+` run ending on a word boundary
// (so trailing punctuation like `.` or `,` is left out of the capture).
const MENTION_REGEX = /(^|[\s(])@([a-zA-Z0-9.-]+)\b/g;
// A Bluesky handle is a domain: ≥2 labels, each starting & ending alphanumeric,
// hyphens allowed inside. Rules per https://atproto.com/specs/handle.
const HANDLE_VALIDATOR = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;

function findMentions(text: string): MentionRange[] {
  const out: MentionRange[] = [];
  for (const m of text.matchAll(MENTION_REGEX)) {
    const lead = m[1] ?? '';
    const handle = m[2];
    if (!HANDLE_VALIDATOR.test(handle)) continue;
    const atCharIdx = (m.index ?? 0) + lead.length;
    const byteStart = Buffer.byteLength(text.slice(0, atCharIdx), 'utf8');
    // handle is ASCII by regex, so byte length === char length; +1 for the `@`.
    const byteEnd = byteStart + 1 + handle.length;
    out.push({ handle, byteStart, byteEnd });
  }
  return out;
}

// Mirrors @atproto/api's bare-URL detection: `http(s)://` after start /
// whitespace / `(`, greedy up to the next whitespace.
const URL_REGEX = /(^|[\s(])(https?:\/\/\S+)/g;

function findLinks(text: string): LinkRange[] {
  const out: LinkRange[] = [];
  for (const m of text.matchAll(URL_REGEX)) {
    const lead = m[1] ?? '';
    let uri = m[2];
    // Trim trailing sentence punctuation that doesn't belong to the URL,
    // and a closing `)` that has no matching `(` inside the URI.
    uri = uri.replace(/[.,;:!?]+$/u, '');
    if (uri.endsWith(')') && !uri.includes('(')) uri = uri.slice(0, -1);
    if (uri.length === 0) continue;
    const startCharIdx = (m.index ?? 0) + lead.length;
    const byteStart = Buffer.byteLength(text.slice(0, startCharIdx), 'utf8');
    // URLs are ASCII (percent-encoded for non-ASCII), so byte length === char length.
    const byteEnd = byteStart + uri.length;
    out.push({ uri, byteStart, byteEnd });
  }
  return out;
}

export function graphemeLength(s: string): number {
  let n = 0;
  for (const _ of segmenter.segment(s)) n += 1;
  return n;
}

export function truncateGraphemes(s: string, max: number): string {
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

function buildLead(date: string, opts: RenderThreadOpts): { text: string; linkRange?: LinkRange } {
  const header = `Top 3 des publications de presse parmi les plus relayées sur Bluesky le ${date} :`;
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
    if (graphemeLength(text) <= MAX_GRAPHEMES) {
      if (opts.footerUrl && parts.includes(footer)) {
        const idx = text.lastIndexOf(opts.footerUrl);
        const byteStart = Buffer.byteLength(text.slice(0, idx), 'utf8');
        const byteEnd = byteStart + Buffer.byteLength(opts.footerUrl, 'utf8');
        return { text, linkRange: { byteStart, byteEnd, uri: opts.footerUrl } };
      }
      return { text };
    }
  }
  return { text: truncateGraphemes(header, MAX_GRAPHEMES) };
}

function buildReply(rank: number, h: Highlight): Reply {
  const handle = h.screenName;
  const prefix = `${rank}. `;
  const mention = `@${handle}`;
  const cleanSnippet = cleanText(h.text).replace(/\s+/g, ' ').trim();

  let text: string;
  if (cleanSnippet.length === 0) {
    text = `${prefix}${mention}`;
  } else {
    const head = `${prefix}${mention} — `;
    const headLen = graphemeLength(head);
    const snippetBudget = MAX_GRAPHEMES - headLen;
    const snippet = truncateGraphemes(cleanSnippet, snippetBudget);
    text = `${head}${snippet}`;
  }
  return { text, handle, embedUri: h.url, mentions: findMentions(text), links: findLinks(text) };
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
  const lead = buildLead(date, opts);
  const replies = highlights.map((h, i) => buildReply(i + 1, h));
  for (const r of replies) {
    if (graphemeLength(r.text) > MAX_GRAPHEMES) {
      throw new Error(`renderThread: reply ${r.handle} exceeds 300 graphemes (${graphemeLength(r.text)})`);
    }
  }
  return { lead, replies };
}
