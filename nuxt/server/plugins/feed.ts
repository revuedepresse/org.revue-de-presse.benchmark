// Nitro plugin that populates /feed.xml. nuxt-module-feed fires `feed:generate`
// for every configured source; we dispatch by options.path.
//
// Field mapping is verbatim from legacy/nuxt.config.ts createFeed (lines 15-61):
//   title       ← screen_name
//   id          ← publication_id
//   link        ← url
//   description ← avatar_url   (legacy parity — intentionally not the text)
//   content     ← text
//
// Errors are swallowed (legacy used logger.error noop). On any failure the
// feed still renders with channel metadata and zero items rather than 5xx.

import { defineNitroPlugin } from 'nitropack/runtime/plugin';
import type { NitroCtx } from 'nuxt-module-feed';
import { cleanForFeed } from '../../utils/clean-text';

export type RawStatus = {
  screen_name?: string;
  publication_id?: string;
  url?: string;
  avatar_url?: string;
  text?: string;
  date?: string;
  status?: RawStatus;
};

export type FeedItem = {
  title: string;
  id: string;
  link: string;
  description: string;
  content: string;
  date: Date;
};

export const mapStatusToFeedItem = (raw: RawStatus): FeedItem => {
  const s = raw.status ?? raw;
  return {
    title: cleanForFeed(s.screen_name ?? ''),
    id: s.publication_id ?? s.url ?? '',
    link: s.url ?? '',
    description: cleanForFeed(s.avatar_url ?? ''),
    content: cleanForFeed(s.text ?? ''),
    date: s.date ? new Date(s.date) : new Date(),
  };
};

const formatYmd = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const yesterdayYmd = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatYmd(d);
};

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('feed:generate', async (ctx: NitroCtx) => {
    if (ctx.options.path !== '/feed.xml') return;

    const { feed } = ctx;

    feed.options = {
      id: 'https://revue-de-presse.org',
      link: 'https://revue-de-presse.org',
      title: 'Revue de presse',
      description:
        'Retrouver chaque jour les 10 publications médias ayant été les plus relayés au cours de la journée.',
      copyright: '',
    };

    const config = useRuntimeConfig();
    const apiBaseUrl = config.apiBaseUrl as string | undefined;
    const apiAuthToken = config.apiAuthToken as string | undefined;

    if (!apiBaseUrl) {
      console.warn('[feed.xml] NUXT_API_BASE_URL is not set; emitting empty feed.');
      return;
    }

    const day = yesterdayYmd();
    const url = new URL('/api/twitter/highlights', apiBaseUrl);
    url.searchParams.set('distinctSources', '1');
    url.searchParams.set('includeRetweets', '1');
    url.searchParams.set('excludeMedia', '0');
    url.searchParams.set('startDate', day);
    url.searchParams.set('endDate', day);

    const headers: Record<string, string> = { accept: '*/*' };
    if (apiAuthToken) headers['x-auth-token'] = apiAuthToken;

    let payload: { statuses?: RawStatus[] } | null = null;
    try {
      payload = await $fetch<{ statuses?: RawStatus[] }>(url.toString(), { headers });
    } catch (err) {
      console.warn('[feed.xml] upstream fetch failed:', (err as Error).message);
      return;
    }

    const statuses = payload?.statuses ?? [];
    for (const raw of statuses) {
      feed.addItem(mapStatusToFeedItem(raw));
    }
  });
});
