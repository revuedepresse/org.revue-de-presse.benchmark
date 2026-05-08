// Pure TS — no Vue/Nuxt deps — so nuxt.config.ts can import this directly.
// Mirrors legacy/mixins/date.ts, legacy/mixins/api.ts (HIGHLIGHTS_PATH_PREFIX,
// localizeDate), and legacy/nuxt.config.ts lines 72-107 (days()).
//
// Timezone note: localizeDate uses the runtime's resolved timezone. On Netlify
// (UTC) the human-readable suffix renders in UTC, matching legacy build-time
// behaviour. Pin to 'Europe/Paris' here if drift is observed in production.

const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
  const out: Date[] = [setTimezone(new Date(Date.parse(SITEMAP_MIN_DATE)))];
  let next = out[out.length - 1];

  const upTo = yesterday();
  if (typeof until !== 'undefined') {
    upTo.setTime(until.getTime());
  }

  do {
    out.push(
      setTimezone(new Date(next.getFullYear(), next.getMonth(), next.getDate() + 1)),
    );
    next = out[out.length - 1];
  } while (next <= upTo);

  return out.map((d) => `/${formatDate(d)}`);
};

export const buildLegacySitemapUrls = (): SitemapUrl[] => {
  const yest = yesterday();
  const yestStr = formatDate(yest);
  const yestIso = yest.toISOString();

  const fixed: SitemapUrl[] = [
    { loc: '/', changefreq: 'daily', lastmod: yestIso },
    {
      loc: `/${yestStr}${HIGHLIGHTS_PATH_PREFIX}${localizeDate(yestStr)}`,
      changefreq: 'daily',
      lastmod: yestIso,
    },
    { loc: '/mentions-legales', lastmod: new Date('2023-01-23').toISOString() },
    { loc: '/nous-contacter',   lastmod: new Date('2023-03-02').toISOString() },
    { loc: '/nous-soutenir',    lastmod: new Date('2023-03-07').toISOString() },
    { loc: '/sources',          lastmod: new Date('2025-03-08').toISOString() },
  ];

  const dynamic: SitemapUrl[] = days()
    .filter((d) => d !== `/${yestStr}`)
    .map((d) => {
      const day = new Date(d.replace('/', ''));
      day.setTime(day.getTime() + 23 * 60 * 60 * 1000);
      return {
        loc: `${d}${HIGHLIGHTS_PATH_PREFIX}${localizeDate(d.replace('/', ''))}`,
        lastmod: day.toISOString(),
      };
    })
    .reverse();

  return [...fixed, ...dynamic];
};
