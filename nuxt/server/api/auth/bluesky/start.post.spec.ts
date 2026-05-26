import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

declare const globalThis: any;

beforeEach(() => {
  vi.resetModules();
  globalThis.useRuntimeConfig = () => ({
    chat: {
      apiJwtSecret: 'jwt-secret',
      publicOrigin: '',
      sessionStoreDir: '',
    },
  });
  globalThis.readBody = async (event: any) => event.__body ?? {};
  globalThis.createError = (e: any) =>
    Object.assign(new Error(e.statusMessage ?? 'err'), e);
  globalThis.defineEventHandler = (handler: any) => handler;
});

afterEach(() => {
  delete globalThis.useRuntimeConfig;
  delete globalThis.readBody;
  delete globalThis.createError;
  delete globalThis.defineEventHandler;
  delete (globalThis as any).fetch;
});

function makeEvent(body: any) {
  return { __body: body };
}

function mockOauth(authorize = vi.fn(async () => new URL('https://pds.example/authorize'))) {
  vi.doMock('../../../utils/blueskyOauth', () => ({
    getBlueskyClient: () => ({ authorize }),
  }));
  return authorize;
}

describe('POST /api/auth/bluesky/start', () => {
  it('rejects an empty handle with code=handle_invalid (no fetch)', async () => {
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock;
    mockOauth();

    const handler = (await import('./start.post')).default;
    const err = await handler(makeEvent({ handle: '' })).catch((e: any) => e);

    expect(err.statusCode).toBe(400);
    expect(err.data).toEqual({ code: 'handle_invalid' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a dotless handle with code=handle_invalid (no fetch)', async () => {
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock;
    mockOauth();

    const handler = (await import('./start.post')).default;
    const err = await handler(makeEvent({ handle: 'alice' })).catch((e: any) => e);

    expect(err.statusCode).toBe(400);
    expect(err.data).toEqual({ code: 'handle_invalid' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns code=handle_not_found when the AppView returns 400', async () => {
    globalThis.fetch = vi.fn(async () => new Response('{}', { status: 400 }));
    mockOauth();

    const handler = (await import('./start.post')).default;
    const err = await handler(
      makeEvent({ handle: 'ghost.bsky.social' }),
    ).catch((e: any) => e);

    expect(err.statusCode).toBe(404);
    expect(err.data).toEqual({ code: 'handle_not_found' });
  });

  it('proceeds to authorize when the AppView returns 200', async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response(JSON.stringify({ did: 'did:plc:abc' }), { status: 200 }),
    );
    const authorize = mockOauth();

    const handler = (await import('./start.post')).default;
    const result = await handler(makeEvent({ handle: ' @Alice.Bsky.Social ' }));

    expect(authorize).toHaveBeenCalledWith('alice.bsky.social', {
      scope: 'atproto transition:generic',
    });
    expect(result).toEqual({ redirectUrl: 'https://pds.example/authorize' });
  });

  it('returns 502 when the AppView is unreachable', async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error('network down');
    });
    mockOauth();

    const handler = (await import('./start.post')).default;
    const err = await handler(
      makeEvent({ handle: 'alice.bsky.social' }),
    ).catch((e: any) => e);

    expect(err.statusCode).toBe(502);
  });
});
