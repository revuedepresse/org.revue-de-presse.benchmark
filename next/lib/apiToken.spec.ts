import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-05-17T10:00:00Z'));
  vi.resetModules();
  vi.stubEnv('API_BASE_URL', 'https://api.example.test');
  vi.stubEnv('API_CLIENT_SECRET', 'shared-secret');
});

afterEach(async () => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  try {
    const mod = await import('./apiToken');
    mod.__resetApiTokenForTesting?.();
  } catch {
    // module not loaded
  }
});

function mockFetchResponse(body: unknown) {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  } as Response);
}

describe('apiToken', () => {
  it('mints once and returns cached value for subsequent calls', async () => {
    const fetchMock = vi.fn(() =>
      mockFetchResponse({ access_token: 'aaaa', token_type: 'Bearer', expires_in: 900 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { getApiToken } = await import('./apiToken');
    const a = await getApiToken();
    const b = await getApiToken();

    expect(a).toBe('aaaa');
    expect(b).toBe('aaaa');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('refreshApiToken clears cache and mints again', async () => {
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => mockFetchResponse({ access_token: 'first', token_type: 'Bearer', expires_in: 900 }))
      .mockImplementationOnce(() => mockFetchResponse({ access_token: 'second', token_type: 'Bearer', expires_in: 900 }));
    vi.stubGlobal('fetch', fetchMock);

    const { getApiToken, refreshApiToken } = await import('./apiToken');
    expect(await getApiToken()).toBe('first');
    expect(await refreshApiToken()).toBe('second');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('refreshes proactively when within 60s of expiry', async () => {
    const fetchMock = vi.fn()
      .mockImplementationOnce(() => mockFetchResponse({ access_token: 'first', token_type: 'Bearer', expires_in: 900 }))
      .mockImplementationOnce(() => mockFetchResponse({ access_token: 'second', token_type: 'Bearer', expires_in: 900 }));
    vi.stubGlobal('fetch', fetchMock);

    const { getApiToken } = await import('./apiToken');
    expect(await getApiToken()).toBe('first');

    vi.setSystemTime(new Date('2026-05-17T10:14:20Z'));

    expect(await getApiToken()).toBe('second');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('sends Basic auth header with empty username', async () => {
    let observedHeaders: HeadersInit | undefined;
    const fetchMock = vi.fn((_url: string, opts: RequestInit) => {
      observedHeaders = opts.headers;
      return mockFetchResponse({ access_token: 'a', token_type: 'Bearer', expires_in: 900 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const { getApiToken } = await import('./apiToken');
    await getApiToken();

    expect((observedHeaders as Record<string, string>).authorization).toBe(
      'Basic ' + Buffer.from(':shared-secret').toString('base64'),
    );
  });

  it('throws on malformed upstream response', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      mockFetchResponse({ access_token: 'a', token_type: 'NotBearer', expires_in: 900 }),
    ));
    const { getApiToken } = await import('./apiToken');

    await expect(getApiToken()).rejects.toThrow();
  });

  it('hits POST /api/token at the configured base URL', async () => {
    let observedUrl = '';
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      observedUrl = url;
      return mockFetchResponse({ access_token: 'a', token_type: 'Bearer', expires_in: 900 });
    }));
    const { getApiToken } = await import('./apiToken');

    await getApiToken();

    expect(observedUrl).toBe('https://api.example.test/api/token');
  });
});
