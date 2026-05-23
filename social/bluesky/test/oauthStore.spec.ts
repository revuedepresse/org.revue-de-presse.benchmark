import { describe, expect, it, beforeEach } from 'vitest';
import { mkdtempSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createFileSessionStore, createFileStateStore, createEnvSessionStore } from '../src/oauthStore.ts';

let dir: string;
let path: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'rdp-bsky-oauth-'));
  path = join(dir, 'session.json');
});

describe('createFileSessionStore', () => {
  it('returns undefined when the file does not exist', async () => {
    const store = createFileSessionStore(path);
    expect(await store.get('did:plc:abc')).toBeUndefined();
  });

  it('round-trips set → get for a session blob', async () => {
    const store = createFileSessionStore(path);
    const blob = { dpopJwk: { kty: 'EC' }, accessToken: 'a', refreshToken: 'r' };
    await store.set('did:plc:abc', blob as never);
    expect(await store.get('did:plc:abc')).toEqual(blob);
  });

  it('writes the session file with mode 0600', async () => {
    const store = createFileSessionStore(path);
    await store.set('did:plc:abc', { x: 1 } as never);
    const mode = statSync(path).mode & 0o777;
    expect(mode).toBe(0o600);
  });

  it('del() removes the session under the given key', async () => {
    const store = createFileSessionStore(path);
    await store.set('did:plc:abc', { x: 1 } as never);
    await store.del('did:plc:abc');
    expect(await store.get('did:plc:abc')).toBeUndefined();
  });

  it('persists multiple keys side by side', async () => {
    const store = createFileSessionStore(path);
    await store.set('did:plc:a', { v: 'A' } as never);
    await store.set('did:plc:b', { v: 'B' } as never);
    expect(await store.get('did:plc:a')).toEqual({ v: 'A' });
    expect(await store.get('did:plc:b')).toEqual({ v: 'B' });
  });
});

describe('createFileStateStore', () => {
  it('round-trips set → get', async () => {
    const store = createFileStateStore(join(dir, 'state.json'));
    await store.set('csrf-1', { nonce: 'abc' } as never);
    expect(await store.get('csrf-1')).toEqual({ nonce: 'abc' });
  });
});

describe('createEnvSessionStore', () => {
  it('returns the decoded blob keyed by did from BLUESKY_OAUTH_SESSION', async () => {
    const blob = { did: 'did:plc:abc', session: { v: 1 } };
    const b64 = Buffer.from(JSON.stringify(blob), 'utf8').toString('base64');
    const store = createEnvSessionStore(b64);
    expect(await store.get('did:plc:abc')).toEqual(blob.session);
  });

  it('throws when BLUESKY_OAUTH_SESSION is not valid base64-encoded JSON', () => {
    expect(() => createEnvSessionStore('!!!not-base64!!!')).toThrow();
  });

  it('captures the latest set() value so the CLI can write a rotated-session file', async () => {
    const blob = { did: 'did:plc:abc', session: { v: 1 } };
    const b64 = Buffer.from(JSON.stringify(blob), 'utf8').toString('base64');
    const store = createEnvSessionStore(b64);
    await store.set('did:plc:abc', { v: 2 } as never);
    expect(store.lastSet?.value).toEqual({ v: 2 });
    expect(store.lastSet?.did).toBe('did:plc:abc');
  });
});
