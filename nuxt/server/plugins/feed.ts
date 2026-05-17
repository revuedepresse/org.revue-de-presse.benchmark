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
  // nuxt-module-feed serves /feed.xml as `application/rss+xml` without a
  // charset; some readers default to Latin-1 and mojibake every accent
  // (`é` -> `Ã©`). Pin charset=utf-8 just before the response flushes.
  nitroApp.hooks.hook('beforeResponse', (event) => {
    if (event.path === '/feed.xml') {
      event.node.res.setHeader(
        'content-type',
        'application/rss+xml; charset=utf-8',
      );
    }
  });

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

    if (!apiBaseUrl) {
      console.warn('[feed.xml] NUXT_API_BASE_URL is not set; emitting empty feed.');
      return;
    }

    const day = yesterdayYmd();
    const url = new URL('/api/highlights', apiBaseUrl);
    url.searchParams.set('distinctSources', '1');
    url.searchParams.set('includeRetweets', '1');
    url.searchParams.set('excludeMedia', '0');
    url.searchParams.set('startDate', day);
    url.searchParams.set('endDate', day);

    const callOnce = async (token: string) =>
      $fetch<any>(url.toString(), {
        headers: { authorization: `Bearer ${token}`, accept: 'application/ld+json' },
      });

    let upstream: any;
    try {
      const { getApiToken, refreshApiToken } = await import('../utils/apiToken');
      try {
        upstream = await callOnce(await getApiToken());
      } catch (err: any) {
        if (err?.statusCode === 401) {
          upstream = await callOnce(await refreshApiToken());
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.warn('[feed.xml] upstream fetch failed:', (err as Error).message);
      return;
    }

    // Adapt Hydra collection → legacy RawStatus[] so mapStatusToFeedItem stays unchanged.
    const members = Array.isArray(upstream?.['hydra:member'])
      ? upstream['hydra:member']
      : Array.isArray(upstream?.member)
        ? upstream.member
        : null;
    const statuses: RawStatus[] = members !== null
      ? members.map((h: any): RawStatus => ({
          screen_name: h.screenName,
          publication_id: h.publicationId,
          url: h.url,
          avatar_url: h.avatarUrl ?? null,
          text: h.text,
          date: h.date,
        }))
      : (upstream?.statuses ?? []);

    for (const raw of statuses) {
      feed.addItem(mapStatusToFeedItem(raw));
    }
  });
});
