#!/usr/bin/env -S node --import tsx
import { randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { loadConfig, ConfigError } from '../src/config.ts';
import { createLinkedinClient } from '../src/linkedinClient.ts';
import { writeTokenFile } from '../src/tokenStore.ts';
import { logger } from '../src/logger.ts';

async function main(): Promise<void> {
  const cfg = loadConfig();
  const client = createLinkedinClient({
    clientId: cfg.linkedinClientId,
    clientSecret: cfg.linkedinClientSecret,
    redirectUrl: cfg.linkedinRedirectUri,
    version: cfg.linkedinVersion,
  });

  const state = randomBytes(16).toString('hex');
  const url = client.generateAuthUrl(state);

  stdout.write(
    [
      '',
      '1) Open this URL in a browser as the LinkedIn organization admin:',
      '',
      `   ${url}`,
      '',
      `2) Approve the consent screen. You will be redirected to ${cfg.linkedinRedirectUri}?code=…&state=${state}`,
      '   (The redirect page does not need to exist — your browser will show an error; that is fine.)',
      '',
      '3) Copy the FULL redirect URL from the browser address bar and paste it below.',
      '',
    ].join('\n'),
  );

  const rl = createInterface({ input: stdin, output: stdout });
  const pastedUrl = (await rl.question('Redirect URL: ')).trim();
  rl.close();

  let parsed: URL;
  try {
    parsed = new URL(pastedUrl);
  } catch {
    throw new Error('Pasted value is not a URL');
  }
  const returnedCode = parsed.searchParams.get('code');
  const returnedState = parsed.searchParams.get('state');
  if (!returnedCode) throw new Error('No `code` query param in pasted URL');
  if (returnedState !== state) {
    throw new Error(`CSRF state mismatch: expected ${state}, got ${returnedState}`);
  }

  const tokens = await client.exchangeCode(returnedCode);
  if (!tokens.refresh_token || !tokens.refresh_token_expires_in) {
    throw new Error(
      'LinkedIn did not return a refresh token. The app likely lacks the `offline_access` scope or the Marketing Developer Platform product approval.',
    );
  }
  const now = Date.now();
  await writeTokenFile(cfg.linkedinTokenFile, {
    access_token: tokens.access_token,
    access_token_expires_at: now + tokens.expires_in * 1000,
    refresh_token: tokens.refresh_token,
    refresh_token_expires_at: now + tokens.refresh_token_expires_in * 1000,
    rotated_at: now,
  });

  logger.info({ tokenFile: cfg.linkedinTokenFile, orgUrn: cfg.linkedinOrganizationUrn }, 'bootstrap OK');
  stdout.write(`\n✓ Token file written to ${cfg.linkedinTokenFile}\n✓ Will post as ${cfg.linkedinOrganizationUrn}\n`);
}

main().catch((err: unknown) => {
  if (err instanceof ConfigError) {
    process.stderr.write(`Config error: ${err.message}\n`);
    process.exit(4);
  }
  process.stderr.write(`Bootstrap failed: ${(err as Error).message}\n`);
  process.exit(3);
});
