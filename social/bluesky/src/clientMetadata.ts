import type { Config } from './types.ts';

/**
 * Single source of truth for the atproto OAuth client metadata document.
 *
 * This object MUST stay byte-for-byte equivalent to the JSON published at
 * `client_id` (nuxt/public/bluesky-client-metadata.json) — the authorization
 * server fetches that URL and authorises against what it finds there, while
 * the local client library authorises against this object. Divergence between
 * the two produces failures that only ever surface against the live PDS.
 * `test/clientMetadata.spec.ts` pins the two together.
 *
 * ## Why the shape depends on BLUESKY_PRIVATE_JWK
 *
 * atproto caps the *absolute* lifetime of an OAuth session — no amount of
 * refreshing extends it:
 *
 *   public client       SESSION_LIFETIME          = 2 weeks
 *   confidential client SESSION_LIFETIME_EXTENDED = 2 years
 *
 * A client is confidential precisely when it authenticates itself with
 * something other than `none`; here that is `private_key_jwt` signed with the
 * ES256 key in BLUESKY_PRIVATE_JWK. Without that key the client is public and
 * the posting session dies after a fortnight, requiring a human to re-approve
 * in a browser.
 *
 * The two shapes are not freely mixable, because the authorization server
 * rejects these combinations (see @atproto/oauth-provider client-manager):
 *
 *   - `application_type: "native"` with any auth method other than `none`
 *     → "Native clients must authenticate using \"none\" method"
 *   - a loopback (127.0.0.1) redirect_uri on a non-native client
 *     → "Loopback redirect URIs are only allowed for native apps"
 *
 * So going confidential necessarily also means moving off the loopback
 * redirect and onto an HTTPS one. Both switches are driven from the single
 * `isConfidential` flag below so the invalid halfway states are unreachable.
 */

export class ClientMetadataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientMetadataError';
  }
}

export type ClientMetadata = {
  client_id: string;
  client_name: string;
  client_uri: string;
  redirect_uris: [string];
  grant_types: ['authorization_code', 'refresh_token'];
  response_types: ['code'];
  scope: string;
  application_type: 'native' | 'web';
  dpop_bound_access_tokens: true;
  token_endpoint_auth_method: 'none' | 'private_key_jwt';
  token_endpoint_auth_signing_alg?: 'ES256';
  jwks_uri?: string;
};

export const CLIENT_NAME = 'Revue de Presse — daily Bluesky digest';
export const SCOPE = 'atproto transition:generic';

export function isLoopbackRedirect(redirectUri: string): boolean {
  let url: URL;
  try {
    url = new URL(redirectUri);
  } catch {
    throw new ClientMetadataError(`BLUESKY_REDIRECT_URI is not a valid URL: ${redirectUri}`);
  }
  return url.hostname === '127.0.0.1' || url.hostname === '[::1]' || url.hostname === '::1';
}

export function isConfidential(cfg: Pick<Config, 'blueskyPrivateJwk'>): boolean {
  return cfg.blueskyPrivateJwk !== null;
}

export function buildClientMetadata(
  cfg: Pick<Config, 'blueskyClientMetadataUrl' | 'blueskyRedirectUri' | 'blueskyPrivateJwk' | 'blueskyJwksUri'>,
): ClientMetadata {
  const confidential = isConfidential(cfg);
  const loopback = isLoopbackRedirect(cfg.blueskyRedirectUri);

  // Fail here rather than at the PDS: these are the exact two rejections the
  // authorization server would raise, and its error surfaces only at bootstrap
  // time against a live server.
  if (confidential && loopback) {
    throw new ClientMetadataError(
      'A confidential client cannot use a loopback redirect URI — loopback is native-only, ' +
        'and native clients must authenticate with "none". Point BLUESKY_REDIRECT_URI at the ' +
        'HTTPS callback published alongside the client metadata document.',
    );
  }
  if (confidential && !cfg.blueskyJwksUri) {
    throw new ClientMetadataError(
      'BLUESKY_PRIVATE_JWK is set but BLUESKY_JWKS_URI is not. A confidential client must ' +
        'publish its public key so the authorization server can verify the client assertion.',
    );
  }
  if (!confidential && !loopback) {
    throw new ClientMetadataError(
      'BLUESKY_REDIRECT_URI is not a loopback URI but no BLUESKY_PRIVATE_JWK is set, so this ' +
        'client is public. Either set BLUESKY_PRIVATE_JWK (recommended — 2-year sessions) or ' +
        'use a 127.0.0.1 redirect URI.',
    );
  }

  const base = {
    client_id: cfg.blueskyClientMetadataUrl,
    client_name: CLIENT_NAME,
    client_uri: new URL(cfg.blueskyClientMetadataUrl).origin,
    redirect_uris: [cfg.blueskyRedirectUri] as [string],
    grant_types: ['authorization_code', 'refresh_token'] as ['authorization_code', 'refresh_token'],
    response_types: ['code'] as ['code'],
    scope: SCOPE,
    dpop_bound_access_tokens: true as const,
  };

  if (!confidential) {
    return { ...base, application_type: 'native', token_endpoint_auth_method: 'none' };
  }

  return {
    ...base,
    application_type: 'web',
    token_endpoint_auth_method: 'private_key_jwt',
    token_endpoint_auth_signing_alg: 'ES256',
    jwks_uri: cfg.blueskyJwksUri!,
  };
}
