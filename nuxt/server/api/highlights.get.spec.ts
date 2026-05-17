import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

declare const globalThis: any;

beforeEach(() => {
  vi.resetModules();
  globalThis.useRuntimeConfig = () => ({
    apiBaseUrl: 'https://api.example.test',
    apiClientSecret: 'shared-secret',
  });
  globalThis.getQuery = (event: any) => event.__query ?? {};
  globalThis.createError = (e: any) => Object.assign(new Error(e.statusMessage ?? 'err'), e);
  globalThis.defineEventHandler = (handler: any) => handler;
});

afterEach(() => {
  delete globalThis.useRuntimeConfig;
  delete globalThis.$fetch;
  delete globalThis.getQuery;
  delete globalThis.createError;
  delete globalThis.defineEventHandler;
});

function makeEvent(query: Record<string, string>) {
  return { __query: query };
}

function makeHydraBody(items: any[]) {
  return {
    '@context': '/api/contexts/Highlight',
    '@id': '/api/highlights',
    '@type': 'hydra:Collection',
    'hydra:totalItems': items.length,
    'hydra:member': items,
  };
}

describe('GET /api/highlights (Nitro proxy)', () => {
  it('calls upstream with Bearer authorization', async () => {
    let observedHeaders: any = null;
    globalThis.$fetch = vi.fn(async (_url: string, opts: any) => {
      observedHeaders = opts.headers;
      return makeHydraBody([]);
    });

    vi.doMock('../utils/apiToken', () => ({
      getApiToken: vi.fn(async () => 'test-bearer'),
      refreshApiToken: vi.fn(async () => 'fresh-bearer'),
    }));

    const handler = (await import('./highlights.get')).default;
    await handler(makeEvent({ startDate: '2026-05-01', endDate: '2026-05-01' }));

    expect(observedHeaders.authorization).toBe('Bearer test-bearer');
  });

  it('calls /api/highlights, not /api/twitter/highlights', async () => {
    let observedUrl = '';
    globalThis.$fetch = vi.fn(async (url: string) => {
      observedUrl = url;
      return makeHydraBody([]);
    });
    vi.doMock('../utils/apiToken', () => ({
      getApiToken: vi.fn(async () => 'b'),
      refreshApiToken: vi.fn(async () => 'b'),
    }));

    const handler = (await import('./highlights.get')).default;
    await handler(makeEvent({ startDate: '2026-05-01', endDate: '2026-05-01' }));

    expect(observedUrl).toContain('/api/highlights?');
    expect(observedUrl).not.toContain('/api/twitter/highlights');
  });

  it('passes itemsPerPage=10 (not pageSize)', async () => {
    let observedUrl = '';
    globalThis.$fetch = vi.fn(async (url: string) => {
      observedUrl = url;
      return makeHydraBody([]);
    });
    vi.doMock('../utils/apiToken', () => ({
      getApiToken: vi.fn(async () => 'b'),
      refreshApiToken: vi.fn(async () => 'b'),
    }));

    const handler = (await import('./highlights.get')).default;
    await handler(makeEvent({ startDate: '2026-05-01', endDate: '2026-05-01' }));

    expect(observedUrl).toContain('itemsPerPage=10');
    expect(observedUrl).not.toContain('pageSize=');
  });

  it('returns legacy shape so useHighlights is unchanged', async () => {
    globalThis.$fetch = vi.fn(async () => makeHydraBody([{
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
    }]));
    vi.doMock('../utils/apiToken', () => ({
      getApiToken: vi.fn(async () => 'b'),
      refreshApiToken: vi.fn(async () => 'b'),
    }));

    const handler = (await import('./highlights.get')).default;
    const body: any = await handler(makeEvent({ startDate: '2026-05-01', endDate: '2026-05-01' }));

    expect(body.aggregates).toEqual([]);
    expect(body.statuses).toHaveLength(1);
    expect(body.statuses[0].screen_name).toBe('lemonde.fr');
    expect(body.statuses[0].publication_id).toBe('pub-1');
    expect(body.statuses[0].status.screen_name).toBe('lemonde.fr');
    expect(body.version).toMatch(/^v6\./);
  });

  it('retries once with refreshed token on 401', async () => {
    let call = 0;
    globalThis.$fetch = vi.fn(async () => {
      call++;
      if (call === 1) {
        const err: any = new Error('Unauthorized');
        err.statusCode = 401;
        throw err;
      }
      return makeHydraBody([]);
    });
    const refresh = vi.fn(async () => 'fresh-bearer');
    vi.doMock('../utils/apiToken', () => ({
      getApiToken: vi.fn(async () => 'stale-bearer'),
      refreshApiToken: refresh,
    }));

    const handler = (await import('./highlights.get')).default;
    await handler(makeEvent({ startDate: '2026-05-01', endDate: '2026-05-01' }));

    expect(call).toBe(2);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('throws 400 when startDate/endDate missing', async () => {
    globalThis.$fetch = vi.fn(async () => makeHydraBody([]));
    vi.doMock('../utils/apiToken', () => ({
      getApiToken: vi.fn(async () => 'b'),
      refreshApiToken: vi.fn(async () => 'b'),
    }));

    const handler = (await import('./highlights.get')).default;

    await expect(handler(makeEvent({}))).rejects.toMatchObject({ statusCode: 400 });
  });
});
