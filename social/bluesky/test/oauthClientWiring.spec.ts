import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { JoseKey } from '@atproto/jwk-jose';
import { NodeOAuthClient, type NodeSavedSession, type NodeSavedState } from '@atproto/oauth-client-node';
import { buildClientMetadata } from '../src/clientMetadata.ts';
import { loadClientKeyset } from '../src/keyset.ts';
import { createFileSessionStore, createFileStateStore } from '../src/oauthStore.ts';
import { createRequestLock, lockDirForSessionFile } from '../src/requestLock.ts';

/**
 * Types alone cannot prove the client accepts our keyset: the previous
 * dependency pair resolved two separate copies of @atproto/jwk, so a JoseKey
 * built from the direct dependency was not the `Key` the OAuth client expected.
 * These tests construct the real client, which is where such a mismatch shows.
 * Nothing here touches the network.
 */

async function tmpSessionFile() {
  return join(await mkdtemp(join(tmpdir(), 'rdp-oauth-')), '.bluesky-session.json');
}

const CONFIDENTIAL = {
  blueskyClientMetadataUrl: 'https://revue-de-presse.org/bluesky-client-metadata.json',
  blueskyRedirectUri: 'https://revue-de-presse.org/bluesky-callback',
  blueskyJwksUri: 'https://revue-de-presse.org/bluesky-jwks.json',
};

async function b64PrivateJwk(kid = 'rdp-test') {
  const key = await JoseKey.generate(['ES256'], kid);
  return Buffer.from(JSON.stringify(key.privateJwk), 'utf8').toString('base64');
}

async function buildClient(cfg: Parameters<typeof buildClientMetadata>[0]) {
  const sessionFile = await tmpSessionFile();
  return new NodeOAuthClient({
    clientMetadata: buildClientMetadata(cfg),
    keyset: await loadClientKeyset(cfg),
    requestLock: createRequestLock({ dir: lockDirForSessionFile(sessionFile) }),
    stateStore: createFileStateStore<NodeSavedState>(`${sessionFile}.state`),
    sessionStore: createFileSessionStore<NodeSavedSession>(sessionFile),
  });
}

describe('NodeOAuthClient wiring', () => {
  it('accepts the confidential metadata together with the ES256 keyset', async () => {
    const cfg = { ...CONFIDENTIAL, blueskyPrivateJwk: await b64PrivateJwk() };
    const client = await buildClient(cfg);
    expect(client.clientMetadata.token_endpoint_auth_method).toBe('private_key_jwt');
    expect(client.clientMetadata.jwks_uri).toBe(CONFIDENTIAL.blueskyJwksUri);
  });

  it('exposes the key through the client keyset, so assertions can be signed', async () => {
    const cfg = { ...CONFIDENTIAL, blueskyPrivateJwk: await b64PrivateJwk('rdp-signing') };
    const client = await buildClient(cfg);
    expect(client.keyset).toBeDefined();
    expect([...client.keyset!].map((k) => k.kid)).toContain('rdp-signing');
  });

  it('still builds the public/native client when no key is configured', async () => {
    const client = await buildClient({
      blueskyClientMetadataUrl: CONFIDENTIAL.blueskyClientMetadataUrl,
      blueskyRedirectUri: 'http://127.0.0.1:8080/callback',
      blueskyPrivateJwk: null,
      blueskyJwksUri: null,
    });
    expect(client.clientMetadata.token_endpoint_auth_method).toBe('none');
    expect(client.keyset).toBeUndefined();
  });
});
