import { describe, expect, it, vi, beforeEach } from 'vitest';
import { refreshAccessToken } from '../src/tiktok/oauth.ts';
import {
  TikTokAuthError,
  TikTokClientCredentialsError,
} from '../src/tiktok/types.ts';

const env = {
  TIKTOK_CLIENT_KEY:    'ck',
  TIKTOK_CLIENT_SECRET: 'cs',
  TIKTOK_REFRESH_TOKEN: 'rt-old',
} as const;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('refreshAccessToken', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns access + new refresh on 200', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({
      access_token:       'at',
      refresh_token:      'rt-new',
      expires_in:         86400,
      refresh_expires_in: 31536000,
    })));

    const out = await refreshAccessToken(env);
    expect(out.accessToken).toBe('at');
    expect(out.newRefreshToken).toBe('rt-new');
    expect(out.expiresInSec).toBe(86400);
  });

  it('throws TikTokAuthError on 401 invalid_grant (expired refresh)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response('{"error":"invalid_grant"}', { status: 401, headers: { 'content-type': 'application/json' } }),
    ));
    await expect(refreshAccessToken(env)).rejects.toBeInstanceOf(TikTokAuthError);
  });

  it('throws TikTokClientCredentialsError on 400 invalid_client', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response('{"error":"invalid_client"}', { status: 400, headers: { 'content-type': 'application/json' } }),
    ));
    await expect(refreshAccessToken(env)).rejects.toBeInstanceOf(TikTokClientCredentialsError);
  });

  it('throws on unparsable response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ unexpected: true })));
    await expect(refreshAccessToken(env)).rejects.toThrow();
  });

  it('encodes credentials as application/x-www-form-urlencoded', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      access_token:       'at',
      refresh_token:      'rt-new',
      expires_in:         86400,
      refresh_expires_in: 31536000,
    }));
    vi.stubGlobal('fetch', fetchMock);
    await refreshAccessToken(env);
    const init = fetchMock.mock.calls[0][1];
    expect(init.headers['Content-Type']).toBe('application/x-www-form-urlencoded');
    const body = init.body as URLSearchParams;
    expect(body.get('grant_type')).toBe('refresh_token');
    expect(body.get('client_key')).toBe('ck');
    expect(body.get('client_secret')).toBe('cs');
    expect(body.get('refresh_token')).toBe('rt-old');
  });
});
