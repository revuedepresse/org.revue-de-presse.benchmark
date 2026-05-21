#!/usr/bin/env tsx
import { config as dotenvConfig } from 'dotenv';
import { createHash, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

import { TIKTOK } from '../src/tiktok/endpoints.ts';
import { TokenResponseSchema } from '../src/tiktok/types.ts';
import { rewriteEnvLine } from '../src/tiktok/rewriteEnvLine.ts';

const HERE = resolve(fileURLToPath(import.meta.url), '..', '..');
const ENV_PATH = resolve(HERE, '.env.local');
// TikTok's Login Kit portal requires an https:// Redirect URI on a public
// domain (it rejects http://, http://localhost, and https://localhost).
// We point it at the public API host; the route itself does not need to
// exist (a 404 is fine) — the browser's URL bar still carries
// `?code=...&state=...` after the redirect, which is all we need.
// The exact string below MUST match the Redirect URI registered in the
// TikTok dev portal under Login Kit -> Redirect URI.
const REDIRECT_URI = 'https://api.revue-de-presse.org/tiktok/oauth/callback';
const SCOPES = 'user.info.basic,video.upload,video.publish';

const EnvSchema = z.object({
  TIKTOK_CLIENT_KEY:    z.string().min(1),
  TIKTOK_CLIENT_SECRET: z.string().min(1),
});

function b64url(buf: Buffer): string {
  return buf.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function openBrowser(url: string): Promise<void> {
  const { spawn } = await import('node:child_process');
  const cmd =
    process.platform === 'darwin' ? 'open' :
    process.platform === 'win32'  ? 'cmd'  : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];
  spawn(cmd, args, { stdio: 'ignore', detached: true }).unref();
}

function extractCallbackParams(input: string): { code: string; state: string } {
  const trimmed = input.trim();
  // Accept either the full callback URL or just the query string portion.
  const url = trimmed.startsWith('http')
    ? new URL(trimmed)
    : new URL(`https://placeholder/${trimmed.replace(/^[?&]/, '?')}`);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code) throw new Error('no `code` param in the pasted URL');
  if (!state) throw new Error('no `state` param in the pasted URL');
  return { code, state };
}

async function main(): Promise<void> {
  dotenvConfig({ path: ENV_PATH });
  const env = EnvSchema.parse(process.env);

  const state = b64url(randomBytes(16));
  const codeVerifier = b64url(randomBytes(32));
  const codeChallenge = b64url(createHash('sha256').update(codeVerifier).digest());

  const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
  authUrl.searchParams.set('client_key', env.TIKTOK_CLIENT_KEY);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', SCOPES);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  process.stdout.write(
    `\nOpening the TikTok authorization page in your browser.\n` +
    `Sign in as @revue_2_presse and approve the scopes.\n\n` +
    `After approval, TikTok will redirect you to:\n` +
    `  ${REDIRECT_URI}?code=...&state=...\n\n` +
    `That page may show a 404 — that is fine. Copy the FULL URL from your\n` +
    `browser's address bar and paste it back here.\n\n` +
    `Authorize URL:\n${authUrl.toString()}\n\n`,
  );
  void openBrowser(authUrl.toString());

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  let code: string;
  try {
    const pasted = await rl.question('Paste the full callback URL (or just the ?code=...&state=... portion): ');
    const got = extractCallbackParams(pasted);
    if (got.state !== state) {
      throw new Error(`state mismatch — expected ${state}, got ${got.state}`);
    }
    code = got.code;
  } finally {
    rl.close();
  }

  const tokenRes = await fetch(TIKTOK.oauthToken, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    body: new URLSearchParams({
      client_key:    env.TIKTOK_CLIENT_KEY,
      client_secret: env.TIKTOK_CLIENT_SECRET,
      grant_type:    'authorization_code',
      code,
      redirect_uri:  REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });
  if (!tokenRes.ok) {
    throw new Error(`token exchange ${tokenRes.status}: ${await tokenRes.text()}`);
  }
  const token = TokenResponseSchema.parse(await tokenRes.json());

  await rewriteEnvLine(ENV_PATH, 'TIKTOK_REFRESH_TOKEN', token.refresh_token);

  process.stdout.write(`\nrefresh_token persisted to ${ENV_PATH}\n`);
  process.stdout.write(`\nTo enable the GitHub Action, run (replace <owner/repo> as appropriate):\n`);
  process.stdout.write(`  gh secret set TIKTOK_CLIENT_KEY         -R <owner/repo> -b '${env.TIKTOK_CLIENT_KEY}'\n`);
  process.stdout.write(`  gh secret set TIKTOK_CLIENT_SECRET      -R <owner/repo> -b '${env.TIKTOK_CLIENT_SECRET}'\n`);
  process.stdout.write(`  gh secret set TIKTOK_REFRESH_TOKEN      -R <owner/repo> -b '${token.refresh_token}'\n`);
  process.stdout.write(`  gh secret set TIKTOK_SECRET_ROTATOR_PAT -R <owner/repo> -b '<fine-grained PAT: Actions secrets read+write on this repo only>'\n`);
}

main().catch((e) => {
  process.stderr.write((e as Error).stack ?? String(e));
  process.exit(1);
});
