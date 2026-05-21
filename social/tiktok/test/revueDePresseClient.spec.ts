import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createRevueDePresseClient, UpstreamError } from '../src/revueDePresseClient.ts';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('createRevueDePresseClient', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('mints a token, then fetches highlights with bearer + filters', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({
        access_token: 'tok-1',
        expires_in: 3600,
        token_type: 'Bearer',
      }))
      .mockResolvedValueOnce(jsonResponse({
        '@type': 'hydra:Collection',
        'hydra:member': [
          { '@id': '/h/1', publicationId: 'p1', screenName: 'lemonde.fr',  url: 'https://x/1', text: 't1', date: '2026-05-21' },
          { '@id': '/h/2', publicationId: 'p2', screenName: 'mediapart.fr', url: 'https://x/2', text: 't2', date: '2026-05-21' },
        ],
      }));
    vi.stubGlobal('fetch', fetchMock);

    const client = createRevueDePresseClient({
      baseUrl: 'https://api.revue-de-presse.org',
      clientSecret: 'apisec',
    });
    const out = await client.fetchTopTen('2026-05-21');
    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({
      screenName: 'lemonde.fr',
      publicationId: 'p1',
      url: 'https://x/1',
      text: 't1',
      date: '2026-05-21',
    });

    // Token call uses Basic auth with empty user + secret:
    const tokenInit = fetchMock.mock.calls[0][1];
    expect(String(fetchMock.mock.calls[0][0])).toContain('/api/token');
    expect(tokenInit.method).toBe('POST');
    expect(tokenInit.headers.authorization).toMatch(/^Basic /);
    expect(Buffer.from(tokenInit.headers.authorization.slice(6), 'base64').toString())
      .toBe(':apisec');

    // Highlights call uses bearer + Hydra Accept + the canonical filters.
    const highlightsUrl = new URL(String(fetchMock.mock.calls[1][0]));
    expect(highlightsUrl.pathname).toBe('/api/highlights');
    expect(highlightsUrl.searchParams.get('startDate')).toBe('2026-05-21');
    expect(highlightsUrl.searchParams.get('endDate')).toBe('2026-05-21');
    expect(highlightsUrl.searchParams.get('itemsPerPage')).toBe('10');
    expect(highlightsUrl.searchParams.get('distinctSources')).toBe('1');
    expect(highlightsUrl.searchParams.get('includeRetweets')).toBe('0');
    expect(highlightsUrl.searchParams.get('excludeMedia')).toBe('1');
    expect(fetchMock.mock.calls[1][1].headers.authorization).toBe('Bearer tok-1');
    expect(fetchMock.mock.calls[1][1].headers.accept).toBe('application/ld+json');
  });

  it('falls back to "member" key when "hydra:member" absent', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ access_token: 'tok', expires_in: 3600, token_type: 'Bearer' }))
      .mockResolvedValueOnce(jsonResponse({
        '@type': 'hydra:Collection',
        member: [
          { '@id': '/h/1', publicationId: 'p1', screenName: 'lemonde.fr', url: 'https://x/1', text: 't1', date: '2026-05-21' },
        ],
      }));
    vi.stubGlobal('fetch', fetchMock);
    const client = createRevueDePresseClient({ baseUrl: 'https://api', clientSecret: 'apisec' });
    expect((await client.fetchTopTen('2026-05-21')).length).toBe(1);
  });

  it('retries with a fresh token on 401', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ access_token: 'tok-1', expires_in: 3600, token_type: 'Bearer' }))
      .mockResolvedValueOnce(new Response('', { status: 401 }))
      .mockResolvedValueOnce(jsonResponse({ access_token: 'tok-2', expires_in: 3600, token_type: 'Bearer' }))
      .mockResolvedValueOnce(jsonResponse({ '@type': 'hydra:Collection', 'hydra:member': [] }));
    vi.stubGlobal('fetch', fetchMock);
    const client = createRevueDePresseClient({ baseUrl: 'https://api', clientSecret: 'apisec' });
    expect((await client.fetchTopTen('2026-05-21')).length).toBe(0);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('throws UpstreamError on non-2xx token mint', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('nope', { status: 500 })));
    const client = createRevueDePresseClient({ baseUrl: 'https://api', clientSecret: 'apisec' });
    await expect(client.fetchTopTen('2026-05-21')).rejects.toBeInstanceOf(UpstreamError);
  });

  it('throws UpstreamError on non-2xx highlights after a successful token', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ access_token: 'tok', expires_in: 3600, token_type: 'Bearer' }))
      .mockResolvedValueOnce(new Response('boom', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    const client = createRevueDePresseClient({ baseUrl: 'https://api', clientSecret: 'apisec' });
    await expect(client.fetchTopTen('2026-05-21')).rejects.toBeInstanceOf(UpstreamError);
  });
});
