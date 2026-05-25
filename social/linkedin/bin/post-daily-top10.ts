#!/usr/bin/env -S node --import tsx
import { writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { loadConfig, ConfigError } from '../src/config.ts';
import { createRevueDePresseClient, UpstreamError } from '../src/revueDePresseClient.ts';
import { createLinkedinClient, LinkedinApiError } from '../src/linkedinClient.ts';
import { readTokenFile, writeTokenFile, TokenFileError } from '../src/tokenStore.ts';
import { hasPostedFor, recordPost, StateFileError } from '../src/stateStore.ts';
import { renderPost } from '../src/renderPost.ts';
import { escapeLittleText } from '../src/littleText.ts';
import { logger } from '../src/logger.ts';

const EXIT = {
  OK: 0,
  ALREADY_POSTED: 1,
  UPSTREAM: 2,
  LINKEDIN: 3,
  CONFIG: 4,
};

function previousDateInTz(tz: string): string {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const todayInTz = fmt.format(now); // YYYY-MM-DD
  const [y, m, d] = todayInTz.split('-').map(Number);
  const yesterday = new Date(Date.UTC(y, m - 1, d - 1));
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(yesterday);
}

async function main(): Promise<number> {
  const { values } = parseArgs({
    options: {
      date: { type: 'string' },
      force: { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
    },
    strict: true,
  });

  const cfg = loadConfig();
  const envMode = cfg.linkedinRefreshTokenEnv !== null;
  const targetDate = values.date ?? previousDateInTz(cfg.tz);
  logger.info({ targetDate, dryRun: values['dry-run'], force: values.force, envMode }, 'starting');

  if (!values.force && !envMode && (await hasPostedFor(cfg.linkedinStateFile, targetDate))) {
    logger.warn({ targetDate }, 'already posted for this date — pass --force to override');
    return EXIT.ALREADY_POSTED;
  }

  const upstream = createRevueDePresseClient({
    baseUrl: cfg.apiBaseUrl,
    clientSecret: cfg.apiClientSecret,
  });

  let highlights;
  try {
    highlights = await upstream.fetchTopTen(targetDate);
  } catch (err) {
    logger.error({ err }, 'upstream fetchTopTen failed');
    return EXIT.UPSTREAM;
  }
  if (highlights.length === 0) {
    logger.error({ targetDate }, 'upstream returned 0 highlights — refusing to post empty digest');
    return EXIT.UPSTREAM;
  }

  const commentary = renderPost(highlights, targetDate, {
    footerUrl: cfg.postFooterUrl,
    hashtag: cfg.postHashtag,
  });

  if (values['dry-run']) {
    // Dry-run output is for human inspection — keep it readable, no escapes.
    process.stdout.write(commentary + '\n');
    logger.info('dry-run complete — no LinkedIn call made');
    return EXIT.OK;
  }

  // Re-render with LinkedIn LITTLE_TEXT escaping applied to all
  // user-controlled text (headline, screenName, URLs). Unescaped
  // `()@[]{}<>*_~|\\` in the commentary cause LinkedIn's parser to either
  // truncate the post (2026-05-25 05:30 Paris: `(J'ai du mal...)` dropped
  // entries 2–10) or eat reserved chars as inline formatting (LinkedIn
  // activity 7464597081169620992: `org.revue_2_presse` rendered as
  // `org.revue2presse` because `_2_` was consumed as italic).
  const linkedinCommentary = renderPost(highlights, targetDate, {
    footerUrl: cfg.postFooterUrl,
    hashtag: cfg.postHashtag,
    escapeText: escapeLittleText,
  });

  let refreshToken: string;
  if (envMode) {
    refreshToken = cfg.linkedinRefreshTokenEnv!;
  } else {
    const tokens = await readTokenFile(cfg.linkedinTokenFile);
    if (!tokens) {
      logger.error({ tokenFile: cfg.linkedinTokenFile }, 'token file missing — run `make linkedin-bootstrap` first');
      return EXIT.CONFIG;
    }
    const REFRESH_WARN_MS = 14 * 24 * 60 * 60 * 1000;
    if (tokens.refresh_token_expires_at - Date.now() < REFRESH_WARN_MS) {
      logger.warn(
        { refreshTokenExpiresAt: tokens.refresh_token_expires_at },
        'refresh token expires in < 14 days — re-run `make linkedin-bootstrap` soon',
      );
    }
    refreshToken = tokens.refresh_token;
  }

  const linkedin = createLinkedinClient({
    clientId: cfg.linkedinClientId,
    clientSecret: cfg.linkedinClientSecret,
    redirectUrl: cfg.linkedinRedirectUri,
    version: cfg.linkedinVersion,
  });

  let fresh;
  try {
    fresh = await linkedin.refreshAccessToken(refreshToken);
  } catch (err) {
    logger.error({ err }, 'LinkedIn refresh-token exchange failed');
    return EXIT.LINKEDIN;
  }

  const now = Date.now();
  if (envMode) {
    if (cfg.linkedinRotatedRefreshTokenFile) {
      await writeFile(cfg.linkedinRotatedRefreshTokenFile, fresh.refresh_token, { mode: 0o600 });
    }
    if (fresh.refresh_token !== refreshToken) {
      logger.warn(
        'LinkedIn rotated the refresh_token — ensure LINKEDIN_REFRESH_TOKEN secret is updated',
      );
    }
  } else {
    await writeTokenFile(cfg.linkedinTokenFile, {
      access_token: fresh.access_token,
      access_token_expires_at: now + fresh.expires_in * 1000,
      refresh_token: fresh.refresh_token,
      refresh_token_expires_at: now + fresh.refresh_token_expires_in * 1000,
      rotated_at: now,
    });
  }

  let postUrn: string;
  try {
    postUrn = await linkedin.createPost({
      accessToken: fresh.access_token,
      authorUrn: cfg.linkedinOrganizationUrn,
      commentary: linkedinCommentary,
    });
  } catch (err) {
    logger.error({ err }, 'LinkedIn create-post failed');
    return EXIT.LINKEDIN;
  }

  if (!envMode) {
    await recordPost(cfg.linkedinStateFile, targetDate, postUrn, new Date().toISOString());
  }
  logger.info({ postUrn, targetDate }, 'posted');
  process.stdout.write(postUrn + '\n');
  return EXIT.OK;
}

main()
  .then((code) => process.exit(code))
  .catch((err: unknown) => {
    if (err instanceof ConfigError || err instanceof TokenFileError || err instanceof StateFileError) {
      logger.error({ err }, 'config / token-store / state-store error');
      process.exit(EXIT.CONFIG);
    }
    if (err instanceof UpstreamError) process.exit(EXIT.UPSTREAM);
    if (err instanceof LinkedinApiError) process.exit(EXIT.LINKEDIN);
    logger.error({ err }, 'unhandled error');
    process.exit(EXIT.LINKEDIN);
  });
