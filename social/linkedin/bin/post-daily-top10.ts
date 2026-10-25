#!/usr/bin/env -S node --import tsx
import { writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { loadConfig, ConfigError } from '../src/config.ts';
import { createRevueDePresseClient, UpstreamError } from '../src/revueDePresseClient.ts';
import { createBlueskyProfiles } from '../src/blueskyProfiles.ts';
import { createLinkedinClient, LinkedinApiError } from '../src/linkedinClient.ts';
import { readTokenFile, writeTokenFile, TokenFileError } from '../src/tokenStore.ts';
import { hasPostedFor, recordPost, StateFileError } from '../src/stateStore.ts';
import { renderPost } from '../src/renderPost.ts';
import { escapeLittleText } from '../src/littleText.ts';
import { logger } from '../src/logger.ts';
import { PUBLISHER_LISTS, type Highlight, type PublisherList } from '../src/types.ts';

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
      // One list only (fr or coop-medias); every list when absent.
      list: { type: 'string' },
    },
    strict: true,
  });

  const cfg = loadConfig();
  const envMode = cfg.linkedinRefreshTokenEnv !== null;
  const targetDate = values.date ?? previousDateInTz(cfg.tz);
  logger.info({ targetDate, dryRun: values['dry-run'], force: values.force, envMode }, 'starting');

  let lists: readonly PublisherList[] = PUBLISHER_LISTS;
  if (values.list !== undefined) {
    if (!PUBLISHER_LISTS.includes(values.list as PublisherList)) {
      logger.error({ list: values.list, known: PUBLISHER_LISTS }, 'unknown list');
      return EXIT.CONFIG;
    }
    lists = [values.list as PublisherList];
  }

  // One post per list, each deduped on its own: a list already posted for
  // this date is skipped, the others still go out.
  const pending: PublisherList[] = [];
  for (const list of lists) {
    if (!values.force && !envMode && (await hasPostedFor(cfg.linkedinStateFile, targetDate, list))) {
      logger.warn({ targetDate, list }, 'already posted for this date — pass --force to override');
      continue;
    }
    pending.push(list);
  }
  if (pending.length === 0) {
    return EXIT.ALREADY_POSTED;
  }

  const upstream = createRevueDePresseClient({
    baseUrl: cfg.apiBaseUrl,
    clientSecret: cfg.apiClientSecret,
  });

  // The worst outcome across lists is the exit code; one list failing does
  // not hold back the other.
  let exitCode = EXIT.OK;
  const posts: { list: PublisherList; highlights: Highlight[] }[] = [];
  for (const list of pending) {
    let highlights: Highlight[];
    try {
      highlights = await upstream.fetchTopTen(targetDate, list);
    } catch (err) {
      logger.error({ err, list }, 'upstream fetchTopTen failed');
      exitCode = Math.max(exitCode, EXIT.UPSTREAM);
      continue;
    }
    if (highlights.length === 0) {
      logger.error({ targetDate, list }, 'upstream returned 0 highlights — refusing to post empty digest');
      exitCode = Math.max(exitCode, EXIT.UPSTREAM);
      continue;
    }
    posts.push({ list, highlights });
  }
  if (posts.length === 0) {
    return exitCode;
  }

  // Media are named by their Bluesky display name; their handle when it is
  // missing or Bluesky cannot be reached, so a lookup never holds a post back.
  const handles = [...new Set(posts.flatMap(({ highlights }) => highlights.map((h) => h.screenName)))];
  try {
    const names = await createBlueskyProfiles({ baseUrl: cfg.blueskyPublicApiUrl }).fetchDisplayNames(handles);
    for (const post of posts) {
      post.highlights = post.highlights.map((h) => ({ ...h, displayName: names.get(h.screenName) }));
    }
  } catch (err) {
    logger.warn({ err }, 'Bluesky display names unavailable — naming media by their handle');
  }

  const render = (list: PublisherList, highlights: Highlight[], escapeText?: (s: string) => string) =>
    renderPost(highlights, targetDate, {
      list,
      newsletterUrl: cfg.newsletterUrls[list],
      footerUrl: cfg.postFooterUrl,
      hashtag: cfg.postHashtag,
      escapeText,
    });

  if (values['dry-run']) {
    // Dry-run output is for human inspection — keep it readable, no escapes.
    for (const { list, highlights } of posts) {
      process.stdout.write(`--- ${list} ---\n` + render(list, highlights) + '\n');
    }
    logger.info('dry-run complete — no LinkedIn call made');
    return exitCode;
  }

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

  for (const { list, highlights } of posts) {
    // LinkedIn LITTLE_TEXT escaping applied to each entry's free-form text.
    // Unescaped `()@[]{}<>*_~|\\` in the commentary cause LinkedIn's parser
    // to truncate the post silently — see the 2026-05-25 05:30 Paris incident
    // where only entry #1 rendered because of `(J'ai du mal...)` in the headline.
    let postUrn: string;
    try {
      postUrn = await linkedin.createPost({
        accessToken: fresh.access_token,
        authorUrn: cfg.linkedinOrganizationUrn,
        commentary: render(list, highlights, escapeLittleText),
      });
    } catch (err) {
      logger.error({ err, list }, 'LinkedIn create-post failed');
      exitCode = Math.max(exitCode, EXIT.LINKEDIN);
      continue;
    }

    if (!envMode) {
      await recordPost(cfg.linkedinStateFile, targetDate, postUrn, new Date().toISOString(), list);
    }
    logger.info({ postUrn, targetDate, list }, 'posted');
    process.stdout.write(postUrn + '\n');
  }
  return exitCode;
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
