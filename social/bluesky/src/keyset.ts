import { JoseKey } from '@atproto/jwk-jose';
import type { Config } from './types.ts';

export class KeysetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KeysetError';
  }
}

export const CLIENT_KEY_ALG = 'ES256';
export const CLIENT_KEY_CRV = 'P-256';

/**
 * BLUESKY_PRIVATE_JWK is stored base64-encoded rather than as raw JSON.
 *
 * Node's `--env-file` parser is not a full shell: an unquoted `#` starts a
 * comment (the .env.local.dist template already warns about this for
 * POST_HASHTAG), and a JWK is JSON full of `{`, `"`, `,` and `=`. base64
 * collapses all of that into one opaque token with no quoting hazards, and
 * matches the convention BLUESKY_OAUTH_SESSION already uses.
 */
export function decodePrivateJwk(b64: string): Record<string, unknown> {
  let json: string;
  try {
    json = Buffer.from(b64, 'base64').toString('utf8');
  } catch (err) {
    throw new KeysetError(`BLUESKY_PRIVATE_JWK is not valid base64: ${(err as Error).message}`);
  }

  let jwk: unknown;
  try {
    jwk = JSON.parse(json);
  } catch (err) {
    throw new KeysetError(
      `BLUESKY_PRIVATE_JWK does not decode to JSON: ${(err as Error).message}. ` +
        'It must be the base64 of a private JWK — regenerate with `make bluesky-keygen`.',
    );
  }

  if (typeof jwk !== 'object' || jwk === null || Array.isArray(jwk)) {
    throw new KeysetError('BLUESKY_PRIVATE_JWK must decode to a JSON object');
  }

  const rec = jwk as Record<string, unknown>;
  // `d` is the private component. Without it the client can hold the key but
  // never sign a client assertion, which fails only at token-exchange time.
  if (typeof rec.d !== 'string' || rec.d.length === 0) {
    throw new KeysetError(
      'BLUESKY_PRIVATE_JWK is a public JWK (no "d" component). The private half belongs in ' +
        '.env.local; only the public half belongs in the published JWKS.',
    );
  }
  if (rec.kty !== 'EC' || rec.crv !== CLIENT_KEY_CRV) {
    throw new KeysetError(
      `BLUESKY_PRIVATE_JWK must be an EC ${CLIENT_KEY_CRV} key (atproto requires ${CLIENT_KEY_ALG}), ` +
        `got kty=${String(rec.kty)} crv=${String(rec.crv)}`,
    );
  }
  if (typeof rec.kid !== 'string' || rec.kid.length === 0) {
    throw new KeysetError(
      'BLUESKY_PRIVATE_JWK has no "kid". The key id ties the client assertion to an entry in the ' +
        'published JWKS and is what makes key rotation possible.',
    );
  }

  return rec;
}

/**
 * Build the client keyset used for `private_key_jwt` authentication, or
 * `undefined` when no key is configured (public-client mode).
 */
export async function loadClientKeyset(
  cfg: Pick<Config, 'blueskyPrivateJwk'>,
): Promise<JoseKey[] | undefined> {
  if (cfg.blueskyPrivateJwk === null) return undefined;
  const jwk = decodePrivateJwk(cfg.blueskyPrivateJwk);
  const key = await JoseKey.fromImportable(
    { ...jwk, alg: CLIENT_KEY_ALG } as never,
    jwk.kid as string,
  );
  return [key];
}
