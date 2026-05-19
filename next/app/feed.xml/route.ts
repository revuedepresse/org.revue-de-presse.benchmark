// RSS 2.0 feed for revue-de-presse.org. Ports nuxt/server/plugins/feed.ts —
// same field mapping (title<-screen_name, id<-publication_id, link<-url,
// description<-avatar_url, content<-text), same yesterday-only window,
// same swallow-on-error behaviour (emit channel metadata with zero items
// rather than 5xx). Uses the `feed` library — the same one nuxt-module-feed
// wraps internally — so RSS escaping/structure matches the Nuxt build.
//
// Pure mapping helpers live in ./mapStatusToFeedItem.ts because Next App
// Router route files cannot export non-HTTP-method names (build fails
// otherwise).

import { Feed } from 'feed';
import { getApiToken, refreshApiToken } from '@/lib/apiToken';
import { mapStatusToFeedItem, type FeedItem, type RawStatus } from './mapStatusToFeedItem';

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

const CHANNEL = {
  id: 'https://revue-de-presse.org',
  link: 'https://revue-de-presse.org',
  title: 'Revue de presse',
  description:
    'Retrouver chaque jour les 10 publications médias ayant été les plus relayés au cours de la journée.',
};

class UpstreamError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
  }
}

async function callUpstream(url: string, token: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { authorization: `Bearer ${token}`, accept: 'application/ld+json' },
  });
  if (!res.ok) throw new UpstreamError(res.status, `Upstream ${res.status}`);
  return res.json();
}

async function fetchItems(): Promise<FeedItem[]> {
  const apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) {
    console.warn('[feed.xml] API_BASE_URL is not set; emitting empty feed.');
    return [];
  }

  const day = yesterdayYmd();
  const url = new URL('/api/highlights', apiBaseUrl);
  url.searchParams.set('distinctSources', '1');
  url.searchParams.set('includeRetweets', '1');
  url.searchParams.set('excludeMedia', '0');
  url.searchParams.set('startDate', day);
  url.searchParams.set('endDate', day);

  let upstream: any;
  try {
    try {
      upstream = await callUpstream(url.toString(), await getApiToken());
    } catch (err) {
      if (err instanceof UpstreamError && err.statusCode === 401) {
        upstream = await callUpstream(url.toString(), await refreshApiToken());
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.warn('[feed.xml] upstream fetch failed:', (err as Error).message);
    return [];
  }

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

  return statuses.map(mapStatusToFeedItem);
}

function buildFeedXml(items: FeedItem[]): string {
  const feed = new Feed({
    id: CHANNEL.id,
    link: CHANNEL.link,
    title: CHANNEL.title,
    description: CHANNEL.description,
    copyright: '',
    language: 'fr',
  });
  for (const it of items) {
    feed.addItem({
      title: it.title,
      id: it.id,
      link: it.link,
      description: it.description,
      content: it.content,
      date: it.date,
    });
  }
  return feed.rss2();
}

export async function GET(): Promise<Response> {
  const items = await fetchItems();
  const xml = buildFeedXml(items);
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=900',
    },
  });
}
