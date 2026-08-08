#!/usr/bin/env -S node --import tsx
/**
 * Generate the ES256 client-authentication key that makes this a *confidential*
 * OAuth client (see src/clientMetadata.ts for why that matters: 2-year sessions
 * instead of 2-week ones).
 *
 * Deliberately does NOT read .env.local — it runs before that file has a key in
 * it — and deliberately never writes the private half to disk. The public half
 * goes into the committed JWKS; the private half is printed once, for you to
 * paste into .env.local (mode 0600).
 *
 * Re-running adds a second key rather than replacing the first, which is the
 * rotation procedure the atproto spec describes: publish the new key, start
 * signing new sessions with it, drop the old one once no session uses it.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { JoseKey } from '@atproto/jwk-jose';

const DEFAULT_JWKS = fileURLToPath(
  new URL('../../../nuxt/public/bluesky-jwks.json', import.meta.url),
);

type Jwks = { keys: Record<string, unknown>[] };

async function readJwks(path: string): Promise<Jwks> {
  try {
    const parsed = JSON.parse(await readFile(path, 'utf8')) as Jwks;
    if (!Array.isArray(parsed.keys)) throw new Error('missing "keys" array');
    return parsed;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return { keys: [] };
    throw new Error(`Existing JWKS at ${path} is unreadable: ${(err as Error).message}`);
  }
}

function defaultKid(now: Date): string {
  return `rdp-${now.toISOString().slice(0, 10)}`;
}

async function main(): Promise<number> {
  const { values } = parseArgs({
    options: {
      kid: { type: 'string' },
      jwks: { type: 'string' },
      replace: { type: 'boolean', default: false },
    },
    strict: true,
  });

  const jwksPath = values.jwks ?? DEFAULT_JWKS;
  const kid = values.kid ?? defaultKid(new Date());

  const existing = values.replace ? { keys: [] } : await readJwks(jwksPath);
  if (existing.keys.some((k) => k.kid === kid)) {
    process.stderr.write(
      `✗ A key with kid "${kid}" is already published in ${jwksPath}.\n` +
        '  Pass --kid <name> to add a distinct one, or --replace to start the set over.\n',
    );
    return 1;
  }

  const key = await JoseKey.generate(['ES256'], kid);
  const publicJwk = key.publicJwk;
  const privateJwk = key.privateJwk;
  if (!publicJwk || !privateJwk) throw new Error('key generation produced no JWK');

  // Publish a minimal, self-consistent public JWK. jose's export carries
  // `key_ops: ["verify","encrypt","wrapKey"]`, which contradicts `use: "sig"` —
  // RFC 7517 §4.3 requires the two to agree when both appear, so rather than
  // ship something a strict validator may reject, emit only the members the
  // authorization server needs to verify an ES256 client assertion.
  const { kty, crv, x, y } = publicJwk as Record<string, unknown>;
  const jwks: Jwks = {
    keys: [...existing.keys, { kty, crv, x, y, kid, use: 'sig', alg: 'ES256' }],
  };
  await writeFile(jwksPath, `${JSON.stringify(jwks, null, 2)}\n`, 'utf8');

  const b64 = Buffer.from(JSON.stringify(privateJwk), 'utf8').toString('base64');

  process.stdout.write(
    [
      '',
      `✓ Public key added to ${jwksPath}`,
      `  kid: ${kid}   keys in set: ${jwks.keys.length}`,
      '  Commit that file and deploy it before bootstrapping — the authorization',
      '  server fetches it via jwks_uri to verify the client assertion.',
      '',
      '── Add this line to social/bluesky/.env.local (mode 0600) ──────────────',
      '',
      `BLUESKY_PRIVATE_JWK=${b64}`,
      '',
      '───────────────────────────────────────────────────────────────────────',
      '  This private half is printed once and never written to disk by this',
      '  script. It must never be committed, logged or copied into the JWKS.',
      '',
    ].join('\n'),
  );

  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err: unknown) => {
    process.stderr.write(`Key generation failed: ${(err as Error).message}\n`);
    process.exit(1);
  });
