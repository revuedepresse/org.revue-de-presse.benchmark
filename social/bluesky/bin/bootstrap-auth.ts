#!/usr/bin/env -S node --env-file=.env.local --import tsx
import { createServer } from 'node:http';
import { exec } from 'node:child_process';
import { writeFile, chmod, rename } from 'node:fs/promises';
import * as readline from 'node:readline';
import { NodeOAuthClient, type NodeSavedSession, type NodeSavedState } from '@atproto/oauth-client-node';
import { loadConfig, ConfigError } from '../src/config.ts';
import { createFileSessionStore, createFileStateStore } from '../src/oauthStore.ts';
import { parseCallbackParams } from '../src/oauthCallback.ts';
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

function listenForCallback(redirect: URL, port: number): Promise<URLSearchParams> {
  return new Promise((resolve, reject) => {
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
}

async function promptForCallback(redirectUri: string): Promise<URLSearchParams> {
  process.stdout.write(
    [
      '',
      `2) Approve. Your browser will be redirected to ${redirectUri}?code=…`,
      "   The page will fail to load — that's expected on a headless host;",
      '   the URL in the address bar is what we need.',
      '',
      '3) Paste the full redirected URL (or its query string), then press Enter:',
      '',
    ].join('\n'),
  );
  const rl = readline.createInterface({ input: process.stdin, terminal: false });
  const line = await new Promise<string>((resolve, reject) => {
    rl.once('line', (l) => {
      rl.close();
      resolve(l);
    });
    rl.once('close', () => reject(new Error('stdin closed before callback URL was pasted')));
  });
  return parseCallbackParams(line);
}

function isHeadless(): boolean {
  return Boolean(process.env.SSH_CONNECTION);
}

function isBindError(err: unknown): boolean {
  const code = (err as NodeJS.ErrnoException | null)?.code;
  return code === 'EADDRINUSE' || code === 'EACCES' || code === 'EADDRNOTAVAIL';
}

async function main(): Promise<number> {
  const cfg = loadConfig();
  const sessionStore = createFileSessionStore<NodeSavedSession>(cfg.blueskySessionFile);
  const stateStore = createFileStateStore<NodeSavedState>(`${cfg.blueskySessionFile}.state`);

  const client = new NodeOAuthClient({
    clientMetadata: clientMetadata(cfg),
    stateStore,
    sessionStore,
  });

  const redirect = new URL(cfg.blueskyRedirectUri);
  const port = Number(redirect.port) || 80;
  const headless = isHeadless();

  const url = await client.authorize(cfg.blueskyHandle, {
    scope: 'atproto transition:generic',
  });

  process.stdout.write(
    [
      '',
      '1) Open the atproto authorization URL in a browser:',
      '',
      `   ${url.toString()}`,
      '',
    ].join('\n'),
  );

  let params: URLSearchParams;
  if (headless) {
    process.stdout.write('Headless mode (SSH_CONNECTION detected) — paste-back enabled.\n');
    params = await promptForCallback(cfg.blueskyRedirectUri);
  } else {
    process.stdout.write(
      [
        `2) Approve. Your browser will be redirected to ${cfg.blueskyRedirectUri}?code=…`,
        `3) This process will receive the redirect on port ${port} and exit.`,
        '',
      ].join('\n'),
    );
    exec(`open '${url.toString()}' >/dev/null 2>&1 || xdg-open '${url.toString()}' >/dev/null 2>&1 || true`);
    try {
      params = await listenForCallback(redirect, port);
    } catch (err) {
      if (!isBindError(err)) throw err;
      process.stdout.write(
        `\nCould not bind ${redirect.host} (${(err as NodeJS.ErrnoException).code}). Falling back to paste-back.\n`,
      );
      params = await promptForCallback(cfg.blueskyRedirectUri);
    }
  }

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
