import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

declare const globalThis: any;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-05-17T10:00:00Z'));
  vi.resetModules();
  globalThis.useRuntimeConfig = () => ({
    apiBaseUrl: 'https://api.example.test',
    apiClientSecret: 'shared-secret',
  });
});

afterEach(async () => {
  vi.useRealTimers();
  delete globalThis.useRuntimeConfig;
  delete globalThis.$fetch;
  try {
    const mod = await import('./apiToken');
    mod.__resetApiTokenForTesting?.();
  } catch {
    // fresh on next import
  }
});

describe('apiToken', () => {
  it('mints once and returns cached value for subsequent calls', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      access_token: 'aaaa', token_type: 'Bearer', expires_in: 900,
    });
    globalThis.$fetch = fetchMock;

    const { getApiToken } = await import('./apiToken');
    const a = await getApiToken();
    const b = await getApiToken();

    expect(a).toBe('aaaa');
    expect(b).toBe('aaaa');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('refreshApiToken clears cache and mints again', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ access_token: 'first',  token_type: 'Bearer', expires_in: 900 })
      .mockResolvedValueOnce({ access_token: 'second', token_type: 'Bearer', expires_in: 900 });
    globalThis.$fetch = fetchMock;

    const { getApiToken, refreshApiToken } = await import('./apiToken');
    expect(await getApiToken()).toBe('first');
    expect(await refreshApiToken()).toBe('second');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('refreshes proactively when within 60s of expiry', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ access_token: 'first',  token_type: 'Bearer', expires_in: 900 })
      .mockResolvedValueOnce({ access_token: 'second', token_type: 'Bearer', expires_in: 900 });
    globalThis.$fetch = fetchMock;

    const { getApiToken } = await import('./apiToken');
    expect(await getApiToken()).toBe('first');

    vi.setSystemTime(new Date('2026-05-17T10:14:20Z'));

    expect(await getApiToken()).toBe('second');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('sends Basic auth header with empty username', async () => {
    let observedHeaders: any = null;
    globalThis.$fetch = vi.fn(async (_url: string, opts: any) => {
      observedHeaders = opts.headers;
      return { access_token: 'a', token_type: 'Bearer', expires_in: 900 };
    });

    const { getApiToken } = await import('./apiToken');
    await getApiToken();

    expect(observedHeaders.authorization).toBe(
      'Basic ' + Buffer.from(':shared-secret').toString('base64'),
    );
  });

  it('throws on malformed upstream response', async () => {
    globalThis.$fetch = vi.fn().mockResolvedValue({ access_token: 'a', token_type: 'NotBearer', expires_in: 900 });
    const { getApiToken } = await import('./apiToken');

    await expect(getApiToken()).rejects.toThrow();
  });

  it('hits POST /api/token at the configured base URL', async () => {
    let observedUrl: string = '';
    globalThis.$fetch = vi.fn(async (url: string) => {
      observedUrl = url;
      return { access_token: 'a', token_type: 'Bearer', expires_in: 900 };
    });
    const { getApiToken } = await import('./apiToken');

    await getApiToken();

    expect(observedUrl).toBe('https://api.example.test/api/token');
  });
});
