// The RSS feeds the site publishes: one per publisher list, each carrying the
// same daily top 10 as the page for that list.
//
// /feed.xml stays the French media one. It predates the other lists, and a
// reader subscribed to it would silently change feed if the path were reused.
// Its title and description are kept verbatim for the same reason: a feed
// reader shows them as the subscription's name.
//
// The list is named on every source, including the French media; what varies
// is whether the upstream call forwards it, since the API ranks the French
// media without being asked (see server/api/highlights.get.ts).

import type { PublisherListId } from './publisher-lists';

export type FeedSource = {
  path: string;
  list: PublisherListId;
  title: string;
  description: string;
};

export const FEED_ORIGIN = 'https://revue-de-presse.org';

export const FEED_SOURCES: FeedSource[] = [
  {
    path: '/feed.xml',
    list: 'fr',
    title: 'Revue de presse',
    description:
      'Retrouver chaque jour les 10 publications médias ayant été les plus relayés la veille.',
  },
  {
    path: '/feed-coop-medias.xml',
    list: 'coop-medias',
    title: 'Revue de presse — Coop Médias',
    description:
      'Retrouver chaque jour les 10 publications de Coop Médias ayant été les plus relayées la veille.',
  },
  {
    path: '/feed-fr-coop-medias.xml',
    list: 'fr-coop-medias',
    title: 'Revue de presse — Médias français + Coop Médias',
    description:
      'Retrouver chaque jour les 10 publications des médias français et de Coop Médias ayant été les plus relayées la veille, chacune comptée une fois.',
  },
];

// The page a feed's channel points at: the home page for the French media, the
// same page carrying ?liste= for the others — the address the site itself uses.
export const feedLink = (source: FeedSource): string =>
  source.list === 'fr' ? FEED_ORIGIN : `${FEED_ORIGIN}/?liste=${source.list}`;

export const feedSourceByPath = (path: string | undefined): FeedSource | undefined =>
  FEED_SOURCES.find((source) => source.path === path);
