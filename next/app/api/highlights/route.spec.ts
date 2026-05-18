import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('API_BASE_URL', 'https://api.example.test');
  vi.stubEnv('API_CLIENT_SECRET', 'shared-secret');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.doUnmock('@/lib/apiToken');
});

function mockUpstream(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

function makeHydraBody(items: unknown[]) {
  return {
    '@context': '/api/contexts/Highlight',
    '@id': '/api/highlights',
    '@type': 'hydra:Collection',
    'hydra:totalItems': items.length,
    'hydra:member': items,
  };
}

function makeRequest(query: Record<string, string> = {}) {
  const url = new URL('http://localhost/api/highlights');
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  return new NextRequest(url);
}

describe('GET /api/highlights', () => {
  it('calls upstream with Bearer authorization', async () => {
    let observedHeaders: HeadersInit | undefined;
    vi.stubGlobal('fetch', vi.fn((_url: string, opts: RequestInit) => {
      observedHeaders = opts.headers;
      return Promise.resolve(mockUpstream(makeHydraBody([])));
    }));
    vi.doMock('@/lib/apiToken', () => ({
      getApiToken: vi.fn(async () => 'test-bearer'),
      refreshApiToken: vi.fn(async () => 'fresh-bearer'),
    }));

    const { GET } = await import('./route');
    await GET(makeRequest({ startDate: '2026-05-01', endDate: '2026-05-01' }));

    expect((observedHeaders as Record<string, string>).authorization).toBe('Bearer test-bearer');
  });

  it('calls /api/highlights, not /api/twitter/highlights', async () => {
    let observedUrl = '';
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      observedUrl = url;
      return Promise.resolve(mockUpstream(makeHydraBody([])));
    }));
    vi.doMock('@/lib/apiToken', () => ({
      getApiToken: vi.fn(async () => 'b'),
      refreshApiToken: vi.fn(async () => 'b'),
    }));

    const { GET } = await import('./route');
    await GET(makeRequest({ startDate: '2026-05-01', endDate: '2026-05-01' }));

    expect(observedUrl).toContain('/api/highlights?');
    expect(observedUrl).not.toContain('/api/twitter/highlights');
  });

  it('passes itemsPerPage=10 (not pageSize)', async () => {
    let observedUrl = '';
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      observedUrl = url;
      return Promise.resolve(mockUpstream(makeHydraBody([])));
    }));
    vi.doMock('@/lib/apiToken', () => ({
      getApiToken: vi.fn(async () => 'b'),
      refreshApiToken: vi.fn(async () => 'b'),
    }));

    const { GET } = await import('./route');
    await GET(makeRequest({ startDate: '2026-05-01', endDate: '2026-05-01' }));

    expect(observedUrl).toContain('itemsPerPage=10');
    expect(observedUrl).not.toContain('pageSize=');
  });

  it('returns legacy shape so useHighlights is unchanged', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(mockUpstream(makeHydraBody([{
      '@id': '/api/highlights/x',
      publicationId: 'pub-1',
      screenName: 'lemonde.fr',
      avatarUrl: 'https://cdn/a.jpg',
      text: 'hello',
      reposts: 1,
      likes: 2,
      replies: 0,
      date: '2026-05-01T10:00:00+02:00',
      url: 'https://bsky.app/p',
    }])))));
    vi.doMock('@/lib/apiToken', () => ({
      getApiToken: vi.fn(async () => 'b'),
      refreshApiToken: vi.fn(async () => 'b'),
    }));

    const { GET } = await import('./route');
    const res = await GET(makeRequest({ startDate: '2026-05-01', endDate: '2026-05-01' }));
    const body = await res.json();

    expect(body.aggregates).toEqual([]);
    expect(body.statuses).toHaveLength(1);
    expect(body.statuses[0].screen_name).toBe('lemonde.fr');
    expect(body.statuses[0].publication_id).toBe('pub-1');
    expect(body.statuses[0].status.screen_name).toBe('lemonde.fr');
    expect(body.version).toMatch(/^v6\./);
  });

  it('retries once with refreshed token on 401', async () => {
    let call = 0;
    vi.stubGlobal('fetch', vi.fn(() => {
      call++;
      if (call === 1) return Promise.resolve(mockUpstream({ error: 'unauth' }, false, 401));
      return Promise.resolve(mockUpstream(makeHydraBody([])));
    }));
    const refresh = vi.fn(async () => 'fresh-bearer');
    vi.doMock('@/lib/apiToken', () => ({
      getApiToken: vi.fn(async () => 'stale-bearer'),
      refreshApiToken: refresh,
    }));

    const { GET } = await import('./route');
    await GET(makeRequest({ startDate: '2026-05-01', endDate: '2026-05-01' }));

    expect(call).toBe(2);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('returns 400 when startDate/endDate missing', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(mockUpstream(makeHydraBody([])))));
    vi.doMock('@/lib/apiToken', () => ({
      getApiToken: vi.fn(async () => 'b'),
      refreshApiToken: vi.fn(async () => 'b'),
    }));

    const { GET } = await import('./route');
    const res = await GET(makeRequest({}));

    expect(res.status).toBe(400);
  });
});
