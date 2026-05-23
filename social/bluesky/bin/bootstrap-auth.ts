#!/usr/bin/env -S node --env-file=.env.local --import tsx
import { createServer } from 'node:http';
import { exec } from 'node:child_process';
import { writeFile, chmod, rename } from 'node:fs/promises';
import { NodeOAuthClient, type NodeSavedSession, type NodeSavedState } from '@atproto/oauth-client-node';
import { JoseKey } from '@atproto/jwk-jose';
import { loadConfig, ConfigError } from '../src/config.ts';
import { createFileSessionStore, createFileStateStore } from '../src/oauthStore.ts';
import { logger } from '../src/logger.ts';

const EXIT = { OK: 0, CONFIG: 4, BLUESKY: 3 };

function clientMetadata(cfg: ReturnType<typeof loadConfig>) {
  return {
    client_id: cfg.blueskyClientMetadataUrl,
    client_name: 'Revue de Presse — daily Bluesky digest',
    client_uri: new URL(cfg.blueskyClientMetadataUrl).origin,
    redirect_uris: [cfg.blueskyRedirectUri] as [string],
    grant_types: ['authorization_code', 'refresh_token'] as ['authorization_code', 'refresh_token'],
    response_types: ['code'] as ['code'],
    scope: 'atproto transition:generic',
    token_endpoint_auth_method: 'none' as const,
    application_type: 'native' as const,
    dpop_bound_access_tokens: true as const,
  };
}

async function main(): Promise<number> {
  const cfg = loadConfig();
  const sessionStore = createFileSessionStore<NodeSavedSession>(cfg.blueskySessionFile);
  const stateStore = createFileStateStore<NodeSavedState>(`${cfg.blueskySessionFile}.state`);

  const client = new NodeOAuthClient({
    clientMetadata: clientMetadata(cfg),
    stateStore,
    sessionStore,
    keyset: await Promise.all([JoseKey.generate(['ES256'])]),
  });

  const redirect = new URL(cfg.blueskyRedirectUri);
  const port = Number(redirect.port) || 80;

  const url = await client.authorize(cfg.blueskyHandle, {
    scope: 'atproto transition:generic',
  });

  process.stdout.write(
    [
      '',
      '1) Opening the atproto authorization URL in your browser:',
      '',
      `   ${url.toString()}`,
      '',
      `2) Approve. Your browser will be redirected to ${cfg.blueskyRedirectUri}?code=…`,
      `3) This process will receive the redirect on port ${port} and exit.`,
      '',
    ].join('\n'),
  );

  exec(`open '${url.toString()}' >/dev/null 2>&1 || xdg-open '${url.toString()}' >/dev/null 2>&1 || true`);

  const codePromise = new Promise<URLSearchParams>((resolve, reject) => {
    const server = createServer((req, res) => {
      const fullUrl = new URL(req.url ?? '/', `http://${req.headers.host}`);
      if (fullUrl.pathname !== redirect.pathname) {
        res.writeHead(404).end('not found');
        return;
      }
      res.writeHead(200, { 'content-type': 'text/plain' }).end('OK — you can close this tab.');
      server.close();
      resolve(fullUrl.searchParams);
    });
    server.on('error', reject);
    server.listen(port, '127.0.0.1');
  });

  const params = await codePromise;
  const { session } = await client.callback(params);

  const summaryPath = `${cfg.blueskySessionFile}.did`;
  const tmp = `${summaryPath}.tmp`;
  await writeFile(tmp, session.did, { mode: 0o600 });
  await chmod(tmp, 0o600);
  await rename(tmp, summaryPath);

  logger.info({ did: session.did, sessionFile: cfg.blueskySessionFile }, 'bootstrap OK');
  process.stdout.write(`\n✓ Session written for ${session.did}\n✓ You can now run \`make bluesky-post-dry\`\n`);
  return EXIT.OK;
}

main()
  .then((code) => process.exit(code))
  .catch((err: unknown) => {
    if (err instanceof ConfigError) {
      process.stderr.write(`Config error: ${err.message}\n`);
      process.exit(EXIT.CONFIG);
    }
    process.stderr.write(`Bootstrap failed: ${(err as Error).message}\n`);
    process.exit(EXIT.BLUESKY);
  });
