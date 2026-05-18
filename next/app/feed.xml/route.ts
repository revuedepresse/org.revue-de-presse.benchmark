// RSS 2.0 feed for revue-de-presse.org. Ports nuxt/server/plugins/feed.ts —
// same field mapping (title<-screen_name, id<-publication_id, link<-url,
// description<-avatar_url, content<-text), same yesterday-only window,
// same swallow-on-error behaviour (emit channel metadata with zero items
// rather than 5xx).

import { cleanForFeed } from '@/lib/cleanText';
import { getApiToken, refreshApiToken } from '@/lib/apiToken';

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

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildFeedXml(items: FeedItem[]): string {
  const itemsXml = items.map((it) => `
    <item>
      <title>${escapeXml(it.title)}</title>
      <guid isPermaLink="false">${escapeXml(it.id)}</guid>
      <link>${escapeXml(it.link)}</link>
      <description>${escapeXml(it.description)}</description>
      <content:encoded><![CDATA[${it.content}]]></content:encoded>
      <pubDate>${it.date.toUTCString()}</pubDate>
    </item>`).join('');

  return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(CHANNEL.title)}</title>
    <link>${escapeXml(CHANNEL.link)}</link>
    <description>${escapeXml(CHANNEL.description)}</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${itemsXml}
  </channel>
</rss>`;
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
