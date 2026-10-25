import type { Highlight, PublisherList } from './types.ts';
import { cleanText } from './cleanText.ts';

export type RenderPostOpts = {
  // Whose top 10 this is. Defaults to French media.
  list?: PublisherList;
  // Sign-up page of the list's newsletter, invited to right before the full
  // review link. Omitted from the post if empty.
  newsletterUrl?: string;
  // URL appended in the footer (e.g. a Play Store / website link). Omitted
  // from the post if empty.
  footerUrl?: string;
  // Hashtag printed on the last line. Omitted from the post if empty.
  hashtag?: string;
  // Optional transform applied to every piece of free-form text in the post —
  // each entry's headline body AND every URL (entry links plus the footer
  // link). Used by the LinkedIn posting path to apply LITTLE_TEXT escaping;
  // the dry-run path leaves it undefined so output stays human-readable.
  //
  // URLs are NOT exempt: LinkedIn parses LITTLE_TEXT before it auto-detects
  // and shortens links, so an unescaped reserved character inside a URL is
  // consumed as markup and silently corrupts the target. See the 2026-09-19
  // incident in test/renderPost.spec.ts.
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

const HEADINGS: Record<PublisherList, (dateFr: string) => string> = {
  fr: (dateFr) => `Top 10 des publications de presse les plus relayées sur Bluesky le ${dateFr} :`,
  'coop-medias': (dateFr) =>
    `Top 10 des publications des médias de Coop Médias les plus relayées sur Bluesky le ${dateFr} :`,
};

const NEWSLETTERS: Record<PublisherList, string> = {
  fr: "la lettre d'information des médias français",
  'coop-medias': "la lettre d'information dédiée à Coop Médias (coop-medias.org)",
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
    const lines = [`${rank}. ${h.screenName}`];
    if (text) lines.push(`    ${text}`);
    lines.push(`    ${escape(h.url)}`);
    return lines.join('\n');
  });
  const list = opts.list ?? 'fr';
  const sections: string[] = [HEADINGS[list](dateFr), '', entries.join('\n\n')];
  if (opts.newsletterUrl) {
    sections.push(
      '',
      `Pour recevoir ce top 10 chaque matin, inscrivez-vous à ${escape(NEWSLETTERS[list])} : ${escape(opts.newsletterUrl)}`,
    );
  }
  if (opts.footerUrl) {
    sections.push(
      '',
      `Retrouvez la revue de presse complète : ${escape(opts.footerUrl)}`,
    );
  }
  if (opts.hashtag) {
    sections.push('', opts.hashtag);
  }
  return sections.join('\n');
}
