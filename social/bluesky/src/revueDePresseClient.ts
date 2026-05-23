import type { Highlight } from './types.ts';

export class UpstreamError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = 'UpstreamError';
  }
}

type CachedToken = { value: string; expiresAt: number };

type HydraHighlight = {
  '@id': string;
  publicationId: string;
  screenName: string;
  text: string;
  date: string;
  url: string;
};

type HydraCollection = {
  '@type': string;
  'hydra:member'?: HydraHighlight[];
  member?: HydraHighlight[];
};

export type RevueDePresseClient = {
  fetchTopThree: (isoDate: string) => Promise<Highlight[]>;
};

export function createRevueDePresseClient(opts: {
  baseUrl: string;
  clientSecret: string;
}): RevueDePresseClient {
  let cached: CachedToken | null = null;

  async function mintToken(): Promise<string> {
    const url = new URL('/api/token', opts.baseUrl);
    const auth = 'Basic ' + Buffer.from(':' + opts.clientSecret).toString('base64');
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { authorization: auth, accept: 'application/json' },
    });
    if (!res.ok) throw new UpstreamError(res.status, `Token mint failed: ${res.status}`);
    const body = (await res.json()) as { access_token: string; expires_in: number; token_type: string };
    if (body.token_type !== 'Bearer' || !body.access_token) {
      throw new UpstreamError(500, 'Malformed token response');
    }
    cached = { value: body.access_token, expiresAt: Date.now() + body.expires_in * 1000 };
    return body.access_token;
  }

  async function getToken(forceRefresh = false): Promise<string> {
    const now = Date.now();
    if (!forceRefresh && cached && cached.expiresAt - 60_000 > now) return cached.value;
    cached = null;
    return mintToken();
  }

  async function callHighlights(token: string, isoDate: string): Promise<Response> {
    const url = new URL('/api/highlights', opts.baseUrl);
    url.searchParams.set('distinctSources', '1');
    url.searchParams.set('includeRetweets', '0');
    url.searchParams.set('excludeMedia', '1');
    url.searchParams.set('startDate', isoDate);
    url.searchParams.set('endDate', isoDate);
    url.searchParams.set('itemsPerPage', '3');
    return fetch(url.toString(), {
      headers: { authorization: `Bearer ${token}`, accept: 'application/ld+json' },
    });
  }

  function adapt(body: HydraCollection): Highlight[] {
    const members = body['hydra:member'] ?? body.member ?? [];
    return members.map((h) => ({
      screenName: h.screenName,
      publicationId: h.publicationId,
      url: h.url,
      text: h.text,
      date: h.date,
    }));
  }

  return {
    async fetchTopThree(isoDate: string): Promise<Highlight[]> {
      let res = await callHighlights(await getToken(), isoDate);
      if (res.status === 401) res = await callHighlights(await getToken(true), isoDate);
      if (!res.ok) throw new UpstreamError(res.status, `Highlights fetch failed: ${res.status}`);
      // The upstream API treats itemsPerPage as a page-size hint but still
      // returns its full daily ranking. Slice to the top 3 client-side so
      // the method name's contract holds.
      return adapt((await res.json()) as HydraCollection).slice(0, 3);
    },
  };
}
