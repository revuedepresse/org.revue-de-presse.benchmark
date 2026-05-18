// Browser -> Next route handler -> upstream proxy. Mints a short-lived
// Bearer via POST /api/token (in lib/apiToken) and forwards GET /api/highlights
// with Authorization: Bearer. Adapts JSON-LD/Hydra back to the legacy
// { aggregates, statuses, version } shape so useHighlights stays unchanged.

import { NextRequest, NextResponse } from 'next/server';
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

class UpstreamError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
  }
}

async function callOnce(url: string, token: string): Promise<HydraCollection<HydraHighlight>> {
  const res = await fetch(url, {
    headers: { authorization: `Bearer ${token}`, accept: 'application/ld+json' },
  });
  if (!res.ok) throw new UpstreamError(res.status, `Upstream returned ${res.status}`);
  return (await res.json()) as HydraCollection<HydraHighlight>;
}

export async function GET(request: NextRequest): Promise<Response> {
  const startDate = request.nextUrl.searchParams.get('startDate');
  const endDate = request.nextUrl.searchParams.get('endDate');
  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'startDate and endDate query params are required' },
      { status: 400 },
    );
  }

  const apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) {
    return NextResponse.json({ error: 'API_BASE_URL is not configured' }, { status: 500 });
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
    if (err instanceof UpstreamError && err.statusCode === 401) {
      body = await callOnce(url.toString(), await refreshApiToken());
    } else {
      const status = err instanceof UpstreamError ? err.statusCode : 502;
      const message = err instanceof Error ? err.message : 'unknown error';
      return NextResponse.json(
        { error: `Upstream highlights fetch failed: ${message}` },
        { status },
      );
    }
  }

  return NextResponse.json(adaptHydraToLegacyShape(body));
}

function adaptHydraToLegacyShape(body: HydraCollection<HydraHighlight>): {
  aggregates: never[];
  statuses: unknown[];
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
      return { ...status, status };
    }),
    version: 'v6.0.0',
  };
}
