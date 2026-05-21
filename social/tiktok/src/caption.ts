import type { Highlight } from './types.ts';
import { handleToDisplayName } from './displayNames.ts';
import { handleToHashtag } from './handleToHashtag.ts';

const STATIC_HASHTAGS = ['#RevueDePresse', '#Médias', '#Bluesky', '#Actu', '#Presse', '#Journalisme'];
const WEBSITE_URL = 'revue-de-presse.org';
const PLAY_STORE_URL = 'play.google.com/store/apps/details?id=org.revue_2_presse';

function uniqueInOrder<T>(xs: T[]): T[] {
  const seen = new Set<T>();
  const out: T[] = [];
  for (const x of xs) {
    if (!seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  }
  return out;
}

function formatDateFr(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

export function buildCaption(highlights: Highlight[], isoDate: string): string {
  if (highlights.length === 0) {
    throw new Error('buildCaption: no highlights to render');
  }
  const sources = uniqueInOrder(highlights.map((h) => h.screenName));
  const sourceList = sources.map(handleToDisplayName).join(' · ');
  const sourceHashtags = uniqueInOrder(sources.map(handleToHashtag));
  const staticTags = STATIC_HASHTAGS.filter((t) => !sourceHashtags.includes(t));
  const hashtags = [...sourceHashtags, ...staticTags].join(' ');

  const caption = [
    `Revue de presse du ${formatDateFr(isoDate)} — top 10 des médias les plus relayés sur Bluesky aujourd'hui.`,
    '',
    `Au programme : ${sourceList}`,
    '',
    `🔗 ${WEBSITE_URL}`,
    `📱 ${PLAY_STORE_URL}`,
    '',
    hashtags,
  ].join('\n');

  if (caption.length > 2200) {
    throw new Error(`Caption exceeds TikTok limit: ${caption.length}/2200`);
  }
  return caption;
}
