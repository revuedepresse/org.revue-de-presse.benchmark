import { describe, expect, it } from 'vitest';
import { JoseKey } from '@atproto/jwk-jose';
import { decodePrivateJwk, KeysetError, loadClientKeyset } from '../src/keyset.ts';

const b64 = (v: unknown) => Buffer.from(JSON.stringify(v), 'utf8').toString('base64');

async function generatePrivateJwk(kid = 'rdp-test') {
  const key = await JoseKey.generate(['ES256'], kid);
  return key.privateJwk!;
}

describe('decodePrivateJwk', () => {
  it('round-trips a generated ES256 private JWK', async () => {
    const jwk = await generatePrivateJwk();
    expect(decodePrivateJwk(b64(jwk))).toMatchObject({ kty: 'EC', crv: 'P-256', kid: 'rdp-test' });
  });

  it('rejects input that is not JSON once decoded', () => {
    expect(() => decodePrivateJwk(Buffer.from('nope', 'utf8').toString('base64')))
      .toThrow(KeysetError);
  });

  it('rejects a JSON value that is not an object', () => {
    expect(() => decodePrivateJwk(b64(['a']))).toThrow(KeysetError);
    expect(() => decodePrivateJwk(b64('a'))).toThrow(KeysetError);
  });

  it('rejects a public JWK — the private half is what signs the assertion', async () => {
    const key = await JoseKey.generate(['ES256'], 'rdp-test');
    expect(() => decodePrivateJwk(b64(key.publicJwk!))).toThrow(/public JWK/);
  });

  it('rejects a key that is not EC P-256', async () => {
    const jwk = await generatePrivateJwk();
    expect(() => decodePrivateJwk(b64({ ...jwk, crv: 'P-384' }))).toThrow(/P-256/);
    expect(() => decodePrivateJwk(b64({ ...jwk, kty: 'RSA' }))).toThrow(/P-256/);
  });

  it('rejects a key with no kid, since rotation depends on it', async () => {
    const jwk = await generatePrivateJwk();
    const { kid, ...withoutKid } = jwk as Record<string, unknown>;
    expect(() => decodePrivateJwk(b64(withoutKid))).toThrow(/kid/);
  });
});

describe('loadClientKeyset', () => {
  it('returns undefined in public-client mode', async () => {
    await expect(loadClientKeyset({ blueskyPrivateJwk: null })).resolves.toBeUndefined();
  });

  it('returns a signing-capable key whose kid matches the JWK', async () => {
    const jwk = await generatePrivateJwk('rdp-2026-08');
    const keyset = await loadClientKeyset({ blueskyPrivateJwk: b64(jwk) });
    expect(keyset).toHaveLength(1);
    expect(keyset![0].kid).toBe('rdp-2026-08');
    expect(keyset![0].isPrivate).toBe(true);
    // The whole point of the key is signing client assertions.
    const jwt = await keyset![0].createJwt({ alg: 'ES256' }, { iss: 'client', aud: 'pds' });
    expect(jwt.split('.')).toHaveLength(3);
  });
});
