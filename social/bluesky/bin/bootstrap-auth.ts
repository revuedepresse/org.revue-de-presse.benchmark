#!/usr/bin/env -S node --env-file=.env.local --import tsx
import { createServer } from 'node:http';
import { exec } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { writeFile, chmod, rename, access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import * as readline from 'node:readline';
import { NodeOAuthClient, type NodeSavedSession, type NodeSavedState } from '@atproto/oauth-client-node';
import { loadConfig, ConfigError } from '../src/config.ts';
import { createFileSessionStore, createFileStateStore } from '../src/oauthStore.ts';
import { parseCallbackParams } from '../src/oauthCallback.ts';
import { buildClientMetadata, isConfidential, isLoopbackRedirect, SCOPE } from '../src/clientMetadata.ts';
import { loadClientKeyset } from '../src/keyset.ts';
import { createRequestLock, lockDirForSessionFile } from '../src/requestLock.ts';
import { expiryStatus, writeBootstrappedAt } from '../src/sessionLifetime.ts';
import { logger } from '../src/logger.ts';

const EXIT = { OK: 0, CONFIG: 4, BLUESKY: 3 };

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

async function openTtyStream(): Promise<NodeJS.ReadableStream | null> {
  try {
    await access('/dev/tty', fsConstants.R_OK);
    return createReadStream('/dev/tty', { encoding: 'utf8' });
  } catch {
    return null;
  }
}

async function promptForCallback(redirectUri: string): Promise<URLSearchParams> {
  const envCallback = process.env.BLUESKY_CALLBACK_URL?.trim();
  if (envCallback) {
    process.stdout.write('\n   Using BLUESKY_CALLBACK_URL — skipping stdin prompt.\n');
    return parseCallbackParams(envCallback);
  }

  process.stdout.write(
    [
      '',
      `2) Approve. Your browser will be redirected to ${redirectUri}?code=…`,
      "   The page will fail to load — that's expected on a headless host;",
      '   the URL in the address bar is what we need.',
      '',
      '   (If paste-back fails: re-run with BLUESKY_CALLBACK_URL=<url> set.)',
      '',
      '3) Paste the full redirected URL (or its query string), then press Enter:',
      '',
    ].join('\n'),
  );

  const ttyStream = await openTtyStream();
  const input = ttyStream ?? process.stdin;
  const rl = readline.createInterface({ input, terminal: false });
  return new Promise<URLSearchParams>((resolve, reject) => {
    let buffer = '';
    let done = false;
    const finish = (line: string) => {
      if (done) return;
      done = true;
      rl.close();
      try {
        resolve(parseCallbackParams(line));
      } catch (err) {
        reject(err);
      }
    };
    rl.on('line', (l) => {
      if (l.trim()) finish(l);
      else buffer += '\n';
    });
    rl.once('close', () => {
      if (done) return;
      const trimmed = buffer.trim();
      if (trimmed) {
        try {
          resolve(parseCallbackParams(trimmed));
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error('stdin closed before callback URL was pasted'));
      }
    });
  });
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

  const confidential = isConfidential(cfg);
  const client = new NodeOAuthClient({
    clientMetadata: buildClientMetadata(cfg),
    keyset: await loadClientKeyset(cfg),
    requestLock: createRequestLock({ dir: lockDirForSessionFile(cfg.blueskySessionFile) }),
    stateStore,
    sessionStore,
  });

  const redirect = new URL(cfg.blueskyRedirectUri);
  const port = Number(redirect.port) || 80;
  // A confidential client uses an HTTPS redirect on a host we do not control
  // from here, so there is nothing to listen on — the browser lands on the real
  // callback page and the operator copies the URL back. Loopback listening only
  // ever applied to the public/native shape.
  const canListen = isLoopbackRedirect(cfg.blueskyRedirectUri);
  const headless = isHeadless() || !canListen;

  const url = await client.authorize(cfg.blueskyHandle, { scope: SCOPE });

  process.stdout.write(
    confidential
      ? '\nConfidential client (private_key_jwt) — this session gets atproto\'s 2-year ceiling.\n'
      : '\n⚠ PUBLIC client — atproto will expire this session after 14 days.\n' +
        '  Set BLUESKY_PRIVATE_JWK (see `make bluesky-keygen`) to lift that to 2 years.\n',
  );

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
    process.stdout.write(
      canListen
        ? 'Headless mode (SSH_CONNECTION detected) — paste-back enabled.\n'
        : `Paste-back mode — ${redirect.origin} is not a loopback address, so this process ` +
          'cannot receive the redirect itself.\n',
    );
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

  // The absolute session ceiling is not readable from the session blob (the
  // refresh token is opaque), so record the start instant and let `post` count
  // forward from it — that is what makes an ahead-of-time warning possible.
  const bootstrappedAt = new Date();
  await writeBootstrappedAt(cfg.blueskySessionFile, bootstrappedAt.toISOString());
  const status = expiryStatus(bootstrappedAt, confidential);

  logger.info(
    { did: session.did, sessionFile: cfg.blueskySessionFile, confidential, expiresAt: status.expiresAt.toISOString() },
    'bootstrap OK',
  );
  process.stdout.write(
    `\n✓ Session written for ${session.did}\n` +
      `✓ Absolute expiry: ${status.expiresAt.toISOString().slice(0, 10)} (${status.daysRemaining} days) — ` +
      `${confidential ? 'confidential' : 'PUBLIC'} client\n` +
      '✓ You can now run `make bluesky-post-dry`\n',
  );
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
