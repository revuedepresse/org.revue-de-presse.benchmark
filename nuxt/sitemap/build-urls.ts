// Pure TS — no Vue/Nuxt deps — so nuxt.config.ts can import this directly.
// Mirrors legacy/mixins/date.ts, legacy/mixins/api.ts (HIGHLIGHTS_PATH_PREFIX,
// localizeDate), and legacy/nuxt.config.ts lines 72-107 (days()).
//
// Timezone note: localizeDate uses the runtime's resolved timezone. On Netlify
// (UTC) the human-readable suffix renders in UTC, matching legacy build-time
// behaviour. Pin to 'Europe/Paris' here if drift is observed in production.

import { PUBLISHER_LISTS } from '../utils/publisher-lists';

const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Every page can be read through another publisher list, with ?liste=<id>: the
// day is the same, the top 10 is not, so each is an address of its own. The
// French media carry no parameter — they are what the site shows without one —
// so the queries below are the other lists', and '' stands for the French media
// wherever the three are walked together.
export const LIST_QUERIES: string[] = [
  '',
  ...PUBLISHER_LISTS.filter((list) => list.id !== 'fr').map((list) => `?liste=${list.id}`),
];

export const HIGHLIGHTS_PATH_PREFIX = '/actualites-du-';
export const SITEMAP_MIN_DATE = '04 Mar 2025 00:00:00 GMT';

export type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

export const setTimezone = (date: Date, timezone = serverTimezone): Date => {
  return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
};

export const now = (timezone = serverTimezone): Date => {
  return setTimezone(new Date(), timezone);
};

export const yesterday = (timezone = serverTimezone): Date => {
  const d = now(timezone);
  d.setDate(d.getDate() - 1);
  return d;
};

export const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const localizeDate = (date: string): string => {
  const event = setTimezone(new Date(date));
  const diacritics = /[̀-ͯ]/g;
  return event
    .toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .normalize('NFD')
    .replace(diacritics, '')
    .replace(/\s/g, '-');
};

export const days = (until: Date | undefined = undefined): string[] => {
  // Inclusive walk from SITEMAP_MIN_DATE up to and including upTo. The
  // legacy do-while overshot by one (pushed upTo+1 before checking),
  // which leaked today into the sitemap. Pre-check stops at upTo exactly.
  const upTo = until ?? yesterday();
  const out: Date[] = [];
  let cursor = setTimezone(new Date(Date.parse(SITEMAP_MIN_DATE)));
  while (cursor <= upTo) {
    out.push(cursor);
    cursor = setTimezone(
      new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1),
    );
  }

  return out.map((d) => `/${formatDate(d)}`);
};

// The dated address of a day, as the site writes it: /2026-11-14/actualites-du-…
const datedLoc = (d: string): string =>
  `${d}${HIGHLIGHTS_PATH_PREFIX}${localizeDate(d.replace('/', ''))}`;

export const buildLegacySitemapUrls = (): SitemapUrl[] => {
  const yest = yesterday();
  const yestStr = formatDate(yest);
  const yestIso = yest.toISOString();
  const sourcesLastmod = new Date('2025-03-08').toISOString();

  // The home page, yesterday's top 10 and the sources, once per list.
  const perList: SitemapUrl[] = LIST_QUERIES.flatMap((query) => [
    { loc: `/${query}`, changefreq: 'daily' as const, lastmod: yestIso },
    { loc: `${datedLoc(`/${yestStr}`)}${query}`, changefreq: 'daily' as const, lastmod: yestIso },
    { loc: `/sources${query}`, lastmod: sourcesLastmod },
  ]);

  const fixed: SitemapUrl[] = [
    ...perList,
    { loc: '/mentions-legales', lastmod: new Date('2026-05-27').toISOString() },
    { loc: '/conditions-utilisation', lastmod: new Date('2026-05-27').toISOString() },
    { loc: '/nous-contacter',   lastmod: new Date('2023-03-02').toISOString() },
    { loc: '/nous-soutenir',    lastmod: new Date('2023-03-07').toISOString() },
    // The newsletter pages (/lettre-quotidienne…) are reachable but stay out
    // of the sitemap until they are advertised (see nuxt.config.ts).
  ];

  const datedDays = days().filter((d) => d !== `/${yestStr}`);

  const dated = (query: string): SitemapUrl[] =>
    datedDays
      .map((d) => {
        const day = new Date(d.replace('/', ''));
        day.setTime(day.getTime() + 23 * 60 * 60 * 1000);
        return {
          loc: `${datedLoc(d)}${query}`,
          lastmod: day.toISOString(),
        };
      })
      .reverse();

  // Newest first within a list, the lists one after another, so a reader of the
  // file still walks each list's archive in the order it had on its own.
  const dynamic: SitemapUrl[] = LIST_QUERIES.flatMap((query) => dated(query));

  return [...fixed, ...dynamic];
};
