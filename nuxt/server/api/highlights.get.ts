import { getApiToken, refreshApiToken } from '../utils/apiToken';

// Browser → Nitro → API Platform upstream proxy. Mints a short-lived bearer
// via POST /api/token and forwards GET /api/highlights with Authorization: Bearer.
// Adapter at the bottom converts JSON-LD/Hydra response back to the legacy
// { aggregates, statuses, version } shape so useHighlights stays unchanged.

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

export default defineEventHandler(async (event) => {
  const { startDate, endDate } = getQuery(event) as Record<string, string | undefined>;
  if (!startDate || !endDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'startDate and endDate query params are required',
    });
  }

  const config = useRuntimeConfig();
  if (!config.apiBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_API_BASE_URL is not configured',
    });
  }

  const url = new URL('/api/highlights', config.apiBaseUrl as string);
  url.searchParams.set('distinctSources', '1');
  url.searchParams.set('includeRetweets', '0');
  url.searchParams.set('excludeMedia', '1');
  url.searchParams.set('startDate', startDate);
  url.searchParams.set('endDate', endDate);
  url.searchParams.set('itemsPerPage', '10');

  const callOnce = async (token: string) =>
    $fetch<HydraCollection<HydraHighlight>>(url.toString(), {
      headers: { authorization: `Bearer ${token}`, accept: 'application/ld+json' },
    });

  let body: HydraCollection<HydraHighlight>;
  try {
    body = await callOnce(await getApiToken());
  } catch (err: any) {
    if (err?.statusCode === 401) {
      body = await callOnce(await refreshApiToken());
    } else {
      throw createError({
        statusCode: err?.statusCode ?? 502,
        statusMessage: `Upstream highlights fetch failed: ${err?.message ?? 'unknown error'}`,
      });
    }
  }

  return adaptHydraToLegacyShape(body);
});

function adaptHydraToLegacyShape(body: HydraCollection<HydraHighlight>): {
  aggregates: never[];
  statuses: any[];
  version: string;
} {
  const members = body['hydra:member'] ?? body.member ?? [];

  return {
    aggregates: [],
    statuses: members.map((h) => {
      const status = {
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
      // Legacy parity: client code may access status.status (self-reference).
      return { ...status, status };
    }),
    version: 'v6.0.0',
  };
}
