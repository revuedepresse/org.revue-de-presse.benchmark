import { getApiToken, refreshApiToken } from '../utils/apiToken';
import { logger } from '../utils/logger';

const log = logger.child({ route: '/api/highlights' });

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

// Publisher lists the API ranks into a daily top 10. `fr` is the API default,
// so it is never forwarded: that keeps this proxy compatible with API releases
// that predate the `list` parameter. `fr-coop-medias` ranks the members of
// either list together, each post once.
const PUBLISHER_LISTS = ['fr', 'coop-medias', 'fr-coop-medias'];

// Rankings the API serves. Forwarded only when asked for, so that the API's
// configured default applies otherwise.
const RANKINGS = ['first-sighting', 'end-of-day'];

export default defineEventHandler(async (event) => {
  const { startDate, endDate, list, ranking } = getQuery(event) as Record<string, string | undefined>;
  if (!startDate || !endDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'startDate and endDate query params are required',
    });
  }
  if (ranking !== undefined && !RANKINGS.includes(ranking)) {
    throw createError({
      statusCode: 400,
      statusMessage: `ranking must be one of ${RANKINGS.join(', ')}`,
    });
  }
  if (list !== undefined && !PUBLISHER_LISTS.includes(list)) {
    throw createError({
      statusCode: 400,
      statusMessage: `list must be one of ${PUBLISHER_LISTS.join(', ')}`,
    });
  }

  const config = useRuntimeConfig();
  if (!config.apiBaseUrl) {
    log.error('NUXT_API_BASE_URL is not configured');
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
  if (list !== undefined && list !== 'fr') {
    url.searchParams.set('list', list);
  }
  if (ranking !== undefined) {
    url.searchParams.set('ranking', ranking);
  }

  const callOnce = async (token: string) =>
    $fetch<HydraCollection<HydraHighlight>>(url.toString(), {
      headers: { authorization: `Bearer ${token}`, accept: 'application/ld+json' },
    });

  let body: HydraCollection<HydraHighlight>;
  try {
    body = await callOnce(await getApiToken());
  } catch (err: any) {
    if (err?.statusCode === 401) {
      log.info({ startDate, endDate }, 'upstream highlights returned 401 — refreshing token');
      body = await callOnce(await refreshApiToken());
    } else {
      log.warn(
        { startDate, endDate, status: err?.statusCode, err: err?.message },
        'upstream highlights fetch failed',
      );
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
