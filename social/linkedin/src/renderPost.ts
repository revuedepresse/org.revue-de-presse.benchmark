import type { Highlight } from './types.ts';

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
  const lines = highlights.map((h, i) => {
    const rank = String(i + 1).padStart(2, ' ');
    return `${rank}. ${h.screenName} — ${h.url}`;
  });
  return [
    `Top 10 des publications de presse les plus relayées sur Bluesky le ${dateFr} :`,
    '',
    ...lines,
    '',
    `Retrouvez la revue de presse complète : ${PLAY_STORE_URL}`,
    '',
    '#RevueDePresse',
  ].join('\n');
}
