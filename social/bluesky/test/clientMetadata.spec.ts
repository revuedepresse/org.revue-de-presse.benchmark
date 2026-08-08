import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  buildClientMetadata,
  ClientMetadataError,
  isConfidential,
  isLoopbackRedirect,
} from '../src/clientMetadata.ts';

const PUBLISHED = fileURLToPath(
  new URL('../../../nuxt/public/bluesky-client-metadata.json', import.meta.url),
);

const PROD = {
  blueskyClientMetadataUrl: 'https://revue-de-presse.org/bluesky-client-metadata.json',
  blueskyRedirectUri: 'https://revue-de-presse.org/bluesky-callback',
  blueskyPrivateJwk: 'ZmFrZQ==',
  blueskyJwksUri: 'https://revue-de-presse.org/bluesky-jwks.json',
};

const LOOPBACK = {
  blueskyClientMetadataUrl: 'https://revue-de-presse.org/bluesky-client-metadata.json',
  blueskyRedirectUri: 'http://127.0.0.1:8080/callback',
  blueskyPrivateJwk: null,
  blueskyJwksUri: null,
};

describe('isLoopbackRedirect', () => {
  it('recognises the IPv4 and IPv6 loopback literals', () => {
    expect(isLoopbackRedirect('http://127.0.0.1:8080/callback')).toBe(true);
    expect(isLoopbackRedirect('http://[::1]:8080/callback')).toBe(true);
  });

  it('does not treat localhost or a public host as loopback', () => {
    // atproto rejects `localhost` outright, so it must not take the native path.
    expect(isLoopbackRedirect('http://localhost:8080/callback')).toBe(false);
    expect(isLoopbackRedirect('https://revue-de-presse.org/bluesky-callback')).toBe(false);
  });

  it('rejects a malformed redirect URI', () => {
    expect(() => isLoopbackRedirect('not a url')).toThrow(ClientMetadataError);
  });
});

describe('isConfidential', () => {
  it('is driven solely by the presence of a client signing key', () => {
    expect(isConfidential({ blueskyPrivateJwk: 'x' })).toBe(true);
    expect(isConfidential({ blueskyPrivateJwk: null })).toBe(false);
  });
});

describe('buildClientMetadata — confidential', () => {
  it('produces a web client authenticating with private_key_jwt', () => {
    const md = buildClientMetadata(PROD);
    expect(md.application_type).toBe('web');
    expect(md.token_endpoint_auth_method).toBe('private_key_jwt');
    expect(md.token_endpoint_auth_signing_alg).toBe('ES256');
    expect(md.jwks_uri).toBe(PROD.blueskyJwksUri);
  });

  it('derives client_uri from the client_id origin', () => {
    expect(buildClientMetadata(PROD).client_uri).toBe('https://revue-de-presse.org');
  });

  it('matches the published client metadata document byte-for-byte', async () => {
    // The authorization server authorises against the published document while
    // the client library authorises against the object built here. If these two
    // drift, the failure only ever appears against a live PDS.
    const published = JSON.parse(await readFile(PUBLISHED, 'utf8'));
    expect(buildClientMetadata(PROD)).toEqual(published);
  });
});

describe('buildClientMetadata — public fallback', () => {
  it('produces a native client authenticating with none', () => {
    const md = buildClientMetadata(LOOPBACK);
    expect(md.application_type).toBe('native');
    expect(md.token_endpoint_auth_method).toBe('none');
    expect(md.jwks_uri).toBeUndefined();
    expect(md.token_endpoint_auth_signing_alg).toBeUndefined();
  });
});

describe('buildClientMetadata — combinations the PDS would reject', () => {
  it('refuses a confidential client on a loopback redirect', () => {
    // @atproto/oauth-provider: "Loopback redirect URIs are only allowed for
    // native apps" + "Native clients must authenticate using \"none\" method".
    expect(() => buildClientMetadata({ ...PROD, blueskyRedirectUri: 'http://127.0.0.1:8080/callback' }))
      .toThrow(ClientMetadataError);
  });

  it('refuses a confidential client with no published JWKS', () => {
    expect(() => buildClientMetadata({ ...PROD, blueskyJwksUri: null })).toThrow(ClientMetadataError);
  });

  it('refuses a public client on a non-loopback redirect', () => {
    expect(() => buildClientMetadata({ ...LOOPBACK, blueskyRedirectUri: 'https://revue-de-presse.org/bluesky-callback' }))
      .toThrow(ClientMetadataError);
  });
});
