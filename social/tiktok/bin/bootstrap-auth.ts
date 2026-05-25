#!/usr/bin/env tsx
import { config as dotenvConfig } from 'dotenv';
import { createHash, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

import { TokenResponseSchema, type TokenResponse } from '../src/tiktok/types.ts';
import { rewriteEnvLine } from '../src/tiktok/rewriteEnvLine.ts';

const HERE = resolve(fileURLToPath(import.meta.url), '..', '..');
const ENV_PATH = resolve(HERE, '.env.local');
// TikTok's Login Kit portal requires an https:// Redirect URI on a public
// domain (it rejects http://, http://localhost, and https://localhost).
// The API exposes a public landing page at this exact path that renders
// the incoming `code` + `state` so the maintainer can paste them back in.
// MUST match the Redirect URI registered in the TikTok dev portal under
// Login Kit -> Redirect URI, and the API's `app_tiktok_oauth_callback` route.
const REDIRECT_URI = 'https://api.revue-de-presse.org/api/tiktok/oauth/callback';
// `video.publish` (Direct Post) is only grantable after TikTok app audit;
// pre-audit the Content Posting API portal only exposes `video.list` +
// `video.upload`, and requesting `video.publish` makes TikTok reject the
// whole `scope` param on the consent page. `inbox` (the default
// PUBLISH_MODE) only needs `video.upload`. Override via TIKTOK_SCOPES
// once the app is audited and you want PUBLISH_MODE=direct, e.g.
// `TIKTOK_SCOPES=user.info.basic,video.upload,video.publish make tiktok-bootstrap`.
const SCOPES = process.env.TIKTOK_SCOPES ?? 'user.info.basic,video.upload';

const EnvSchema = z.object({
  TIKTOK_CLIENT_KEY:    z.string().min(1),
  TIKTOK_CLIENT_SECRET: z.string().min(1),
  API_BASE_URL:         z
    .string()
    .url()
    .default('https://api.revue-de-presse.org')
    .or(z.literal('').transform(() => 'https://api.revue-de-presse.org')),
  API_CLIENT_SECRET:    z.string().min(1),
});

const ApiTokenResponseSchema = z.object({
  access_token: z.string().min(1),
  expires_in:   z.number().int().positive(),
  token_type:   z.string().min(1),
});

const ProblemJsonSchema = z.object({
  title:  z.string().optional(),
  detail: z.string().optional(),
  status: z.number().optional(),
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
  const url = trimmed.startsWith('http')
    ? new URL(trimmed)
    : new URL(`https://placeholder/${trimmed.replace(/^[?&]/, '?')}`);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code) throw new Error('no `code` param in the pasted URL');
  if (!state) throw new Error('no `state` param in the pasted URL');
  return { code, state };
}

async function describeUpstreamFailure(res: Response): Promise<string> {
  const text = await res.text();
  if (res.headers.get('content-type')?.includes('problem+json')) {
    try {
      const problem = ProblemJsonSchema.parse(JSON.parse(text));
      const parts = [problem.title, problem.detail].filter((s): s is string => Boolean(s));
      if (parts.length > 0) return parts.join(': ');
    } catch {
      // fall through to raw body
    }
  }
  return text;
}

async function mintApiAccessToken(baseUrl: string, clientSecret: string): Promise<string> {
  const url = new URL('/api/token', baseUrl);
  const basic = 'Basic ' + Buffer.from(':' + clientSecret).toString('base64');
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { authorization: basic, accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`/api/token mint failed: ${res.status} ${await describeUpstreamFailure(res)}`);
  }
  const body = ApiTokenResponseSchema.parse(await res.json());
  if (body.token_type !== 'Bearer') {
    throw new Error(`unexpected token_type from /api/token: ${body.token_type}`);
  }
  return body.access_token;
}

async function exchangeViaApi(
  baseUrl: string,
  bearer: string,
  body: { code: string; code_verifier: string; redirect_uri: string },
): Promise<TokenResponse> {
  const url = new URL('/api/tiktok/oauth/exchange', baseUrl);
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      authorization:  `Bearer ${bearer}`,
      'content-type': 'application/json',
      accept:         'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(
      `/api/tiktok/oauth/exchange failed: ${res.status} ${await describeUpstreamFailure(res)}`,
    );
  }
  return TokenResponseSchema.parse(await res.json());
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
    `The API renders that URL as an HTML page showing the code, state, and\n` +
    `the full callback URL — copy any of those back into this prompt.\n\n` +
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

  const bearer = await mintApiAccessToken(env.API_BASE_URL, env.API_CLIENT_SECRET);
  const token = await exchangeViaApi(env.API_BASE_URL, bearer, {
    code,
    code_verifier: codeVerifier,
    redirect_uri:  REDIRECT_URI,
  });

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
