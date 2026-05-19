// Upstream highlights fetch, shared between the /api/highlights route handler
// and Server Components that need to seed initial post data at SSR time.
// Mints a Bearer via getApiToken, retries once on 401, and normalises the
// Hydra collection into the legacy { aggregates, statuses, version } shape
// that useHighlights consumes.

import { getApiToken, refreshApiToken } from '@/lib/apiToken';

type HydraHighlight = {
  '@id': string;
  publicationId: string;
  screenName: string;
  avatarUrl?: string | null;
  text: string;
  reposts: number;
  likes: number;
  replies?: number;
  date: string;
  url: string;
};

type HydraCollection<T> = {
  '@context': string;
  '@id': string;
  '@type': 'hydra:Collection' | 'Collection';
  'hydra:totalItems'?: number;
  totalItems?: number;
  'hydra:member'?: T[];
  member?: T[];
};

export type LegacyHighlight = {
  screen_name: string;
  publication_id: string;
  url: string;
  avatar_url: string | null;
  text: string;
  reposts: number;
  likes: number;
  replies: number;
  date: string;
};

export type LegacyHighlightsResponse = {
  aggregates: never[];
  statuses: Array<LegacyHighlight & { status: LegacyHighlight }>;
  version: string;
};

export class HighlightsUpstreamError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
  }
}

async function callOnce(
  url: string,
  token: string,
): Promise<HydraCollection<HydraHighlight>> {
  const res = await fetch(url, {
    headers: { authorization: `Bearer ${token}`, accept: 'application/ld+json' },
  });
  if (!res.ok) {
    throw new HighlightsUpstreamError(res.status, `Upstream returned ${res.status}`);
  }
  return (await res.json()) as HydraCollection<HydraHighlight>;
}

function adaptHydraToLegacyShape(
  body: HydraCollection<HydraHighlight>,
): LegacyHighlightsResponse {
  const members = body['hydra:member'] ?? body.member ?? [];
  return {
    aggregates: [],
    statuses: members.map((h) => {
      const status: LegacyHighlight = {
        screen_name: h.screenName,
        publication_id: h.publicationId,
        url: h.url,
        avatar_url: h.avatarUrl ?? null,
        text: h.text,
        reposts: h.reposts,
        likes: h.likes,
        replies: h.replies ?? 0,
        date: h.date,
      };
      return { ...status, status };
    }),
    version: 'v6.0.0',
  };
}

export async function fetchHighlights(
  startDate: string,
  endDate: string,
): Promise<LegacyHighlightsResponse> {
  const apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) {
    throw new HighlightsUpstreamError(500, 'API_BASE_URL is not configured');
  }

  const url = new URL('/api/highlights', apiBaseUrl);
  url.searchParams.set('distinctSources', '1');
  url.searchParams.set('includeRetweets', '0');
  url.searchParams.set('excludeMedia', '1');
  url.searchParams.set('startDate', startDate);
  url.searchParams.set('endDate', endDate);
  url.searchParams.set('itemsPerPage', '10');

  let body: HydraCollection<HydraHighlight>;
  try {
    body = await callOnce(url.toString(), await getApiToken());
  } catch (err) {
    if (err instanceof HighlightsUpstreamError && err.statusCode === 401) {
      body = await callOnce(url.toString(), await refreshApiToken());
    } else {
      throw err;
    }
  }
  return adaptHydraToLegacyShape(body);
}
