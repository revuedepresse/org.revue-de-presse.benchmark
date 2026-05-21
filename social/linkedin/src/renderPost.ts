import type { Highlight } from './types.ts';
import { cleanText } from './cleanText.ts';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=org.revue_2_presse';

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

export function renderPost(highlights: Highlight[], isoDate: string): string {
  if (highlights.length === 0) {
    throw new Error('renderPost: no highlights to render');
  }
  const dateFr = formatDateFr(isoDate);
  const entries = highlights.map((h, i) => {
    const rank = String(i + 1).padStart(2, ' ');
    const text = cleanText(h.text).replace(/\s+/g, ' ').trim();
    const lines = [`${rank}. ${h.screenName}`];
    if (text) lines.push(`    ${text}`);
    lines.push(`    ${h.url}`);
    return lines.join('\n');
  });
  return [
    `Top 10 des publications de presse les plus relayées sur Bluesky le ${dateFr} :`,
    '',
    entries.join('\n\n'),
    '',
    `Retrouvez la revue de presse complète : ${PLAY_STORE_URL}`,
    '',
    '#RevueDePresse',
  ].join('\n');
}
