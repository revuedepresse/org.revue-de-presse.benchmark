import { join } from 'node:path';
import {
  NodeOAuthClient,
  type NodeSavedSession,
  type NodeSavedState,
} from '@atproto/oauth-client-node';
import { createFileStore, resolveStoreDir } from './fileStore';

let cached: NodeOAuthClient | null = null;

type ChatRuntimeConfig = {
  publicOrigin: string;
  sessionStoreDir: string;
};

/**
 * Build (and cache) the Bluesky OAuth client.
 *
 * - In dev (no `publicOrigin` set), constructs a localhost loopback
 *   client_id per the atproto OAuth spec.
 * - In prod, points at the public client-metadata.json hosted under
 *   /public/oauth/.
 *
 * The DPoP keyset is in-memory and ephemeral. That's fine for
 * `transition:generic` scope; persisting a keyset across restarts is
 * a follow-up only if longer-lived sessions are needed.
 */
export function getBlueskyClient(cfg: ChatRuntimeConfig): NodeOAuthClient {
  if (cached !== null) return cached;

  const storeRoot = resolveStoreDir(cfg.sessionStoreDir);
  const sessionStore = createFileStore<NodeSavedSession>(join(storeRoot, 'bluesky-sessions.json'));
  const stateStore = createFileStore<NodeSavedState>(join(storeRoot, 'bluesky-oauth-state.json'));

  const clientMetadata = cfg.publicOrigin
    ? prodClientMetadata(cfg.publicOrigin)
    : devClientMetadata();

  cached = new NodeOAuthClient({
    clientMetadata,
    sessionStore: {
      async get(sub) {
        return await sessionStore.get(sub);
      },
      async set(sub, session) {
        await sessionStore.set(sub, session);
      },
      async del(sub) {
        await sessionStore.del(sub);
      },
    },
    stateStore: {
      async get(key) {
        return await stateStore.get(key);
      },
      async set(key, state) {
        await stateStore.set(key, state);
      },
      async del(key) {
        await stateStore.del(key);
      },
    },
  });

  return cached;
}

function prodClientMetadata(origin: string) {
  const base = origin.replace(/\/$/, '');
  return {
    client_id: `${base}/oauth/client-metadata.json`,
    client_name: 'Revue de presse — chat',
    client_uri: `${base}/discuter`,
    logo_uri: `${base}/logo-revue-de-presse.png`,
    tos_uri: `${base}/mentions-legales#cgu`,
    policy_uri: `${base}/mentions-legales#confidentialite`,
    redirect_uris: [`${base}/api/auth/bluesky/callback`] as [string],
    scope: 'atproto transition:generic',
    grant_types: ['authorization_code', 'refresh_token'] as [
      'authorization_code',
      'refresh_token',
    ],
    response_types: ['code'] as ['code'],
    application_type: 'web' as const,
    token_endpoint_auth_method: 'none' as const,
    dpop_bound_access_tokens: true as const,
  };
}

function devClientMetadata() {
  // atproto OAuth spec allows the loopback client_id form
  //   http://localhost?redirect_uri=…&scope=…
  // when running on http://localhost or http://127.0.0.1.
  const redirect = 'http://127.0.0.1:3000/api/auth/bluesky/callback';
  const scope = 'atproto transition:generic';
  const clientId = `http://localhost?redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent(scope)}`;
  return {
    client_id: clientId,
    redirect_uris: [redirect] as [string],
    scope,
    grant_types: ['authorization_code', 'refresh_token'] as [
      'authorization_code',
      'refresh_token',
    ],
    response_types: ['code'] as ['code'],
    application_type: 'web' as const,
    token_endpoint_auth_method: 'none' as const,
    dpop_bound_access_tokens: true as const,
  };
}
