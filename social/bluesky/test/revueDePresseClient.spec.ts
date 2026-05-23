import { describe, expect, it, beforeEach, vi } from 'vitest';
import { createRevueDePresseClient, UpstreamError } from '../src/revueDePresseClient.ts';

type FetchMock = ReturnType<typeof vi.fn>;

const TOKEN_RES = () =>
  new Response(JSON.stringify({ access_token: 'tok-1', token_type: 'Bearer', expires_in: 3600 }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

const HIGHLIGHTS_RES = () =>
  new Response(
    JSON.stringify({
      '@type': 'hydra:Collection',
      'hydra:member': [
        {
          '@id': '/api/highlights/1',
          publicationId: 'p1',
          screenName: 'Le Monde',
          text: 't',
          reposts: 10,
          likes: 20,
          date: '2026-05-20',
          url: 'https://bsky.app/post/1',
        },
      ],
    }),
    { status: 200, headers: { 'content-type': 'application/ld+json' } },
  );

let fetchMock: FetchMock;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

describe('revueDePresseClient', () => {
  it('mints a token then fetches highlights for the given date', async () => {
    fetchMock.mockResolvedValueOnce(TOKEN_RES()).mockResolvedValueOnce(HIGHLIGHTS_RES());
    const client = createRevueDePresseClient({
      baseUrl: 'https://api.revue-de-presse.org',
      clientSecret: 'sek',
    });
    const out = await client.fetchTopThree('2026-05-20');
    expect(out).toHaveLength(1);
    expect(out[0].screenName).toBe('Le Monde');

    const highlightsUrl = new URL(fetchMock.mock.calls[1][0] as string);
    expect(highlightsUrl.pathname).toBe('/api/highlights');
    expect(highlightsUrl.searchParams.get('startDate')).toBe('2026-05-20');
    expect(highlightsUrl.searchParams.get('endDate')).toBe('2026-05-20');
    expect(highlightsUrl.searchParams.get('itemsPerPage')).toBe('3');
  });

  it('reuses a cached token across calls', async () => {
    fetchMock
      .mockResolvedValueOnce(TOKEN_RES())
      .mockResolvedValueOnce(HIGHLIGHTS_RES())
      .mockResolvedValueOnce(HIGHLIGHTS_RES());
    const client = createRevueDePresseClient({
      baseUrl: 'https://api.revue-de-presse.org',
      clientSecret: 'sek',
    });
    await client.fetchTopThree('2026-05-20');
    await client.fetchTopThree('2026-05-21');
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('refreshes the token on a 401 and retries once', async () => {
    fetchMock
      .mockResolvedValueOnce(TOKEN_RES())
      .mockResolvedValueOnce(new Response('', { status: 401 }))
      .mockResolvedValueOnce(TOKEN_RES())
      .mockResolvedValueOnce(HIGHLIGHTS_RES());
    const client = createRevueDePresseClient({
      baseUrl: 'https://api.revue-de-presse.org',
      clientSecret: 'sek',
    });
    const out = await client.fetchTopThree('2026-05-20');
    expect(out).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('throws UpstreamError on 5xx', async () => {
    fetchMock
      .mockResolvedValueOnce(TOKEN_RES())
      .mockResolvedValueOnce(new Response('', { status: 503 }));
    const client = createRevueDePresseClient({
      baseUrl: 'https://api.revue-de-presse.org',
      clientSecret: 'sek',
    });
    await expect(client.fetchTopThree('2026-05-20')).rejects.toBeInstanceOf(UpstreamError);
  });
});
