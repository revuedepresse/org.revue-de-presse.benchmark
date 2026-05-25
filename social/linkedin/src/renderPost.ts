import type { Highlight } from './types.ts';
import { cleanText } from './cleanText.ts';

export type RenderPostOpts = {
  // URL appended in the footer (e.g. a Play Store / website link). Omitted
  // from the post if empty.
  footerUrl?: string;
  // Hashtag printed on the last line. Omitted from the post if empty.
  hashtag?: string;
  // Optional transform applied to user-controlled text in the rendered
  // commentary (headline body, screen names, and URLs — but never the
  // hashtag, which must stay literal so LinkedIn's HashtagElement detector
  // picks it up). Used by the LinkedIn posting path to apply LITTLE_TEXT
  // escaping; the dry-run path leaves it undefined so output stays
  // human-readable.
  escapeText?: (s: string) => string;
};

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

export function renderPost(
  highlights: Highlight[],
  isoDate: string,
  opts: RenderPostOpts = {},
): string {
  if (highlights.length === 0) {
    throw new Error('renderPost: no highlights to render');
  }
  const dateFr = formatDateFr(isoDate);
  const escape = opts.escapeText ?? ((s: string) => s);
  const entries = highlights.map((h, i) => {
    const rank = String(i + 1).padStart(2, ' ');
    const text = escape(cleanText(h.text).replace(/\s+/g, ' ').trim());
    const lines = [`${rank}. ${escape(h.screenName)}`];
    if (text) lines.push(`    ${text}`);
    lines.push(`    ${escape(h.url)}`);
    return lines.join('\n');
  });
  const sections: string[] = [
    `Top 10 des publications de presse les plus relayées sur Bluesky le ${dateFr} :`,
    '',
    entries.join('\n\n'),
  ];
  if (opts.footerUrl) {
    sections.push('', `Retrouvez la revue de presse complète : ${escape(opts.footerUrl)}`);
  }
  if (opts.hashtag) {
    sections.push('', opts.hashtag);
  }
  return sections.join('\n');
}
