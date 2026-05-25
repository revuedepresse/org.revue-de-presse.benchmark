#!/usr/bin/env tsx
import { config as dotenvConfig } from 'dotenv';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pino from 'pino';

import { loadEnv } from '../src/env.ts';
import {
  recordScroll,
  RenderInvariantError,
  RenderNavigationError,
  RenderArtifactError,
} from '../src/render/recordScroll.ts';
import { transcode } from '../src/render/transcode.ts';
import { createRevueDePresseClient } from '../src/revueDePresseClient.ts';
import { buildCaption } from '../src/caption.ts';
import { refreshAccessToken } from '../src/tiktok/oauth.ts';
import { persistRefreshToken } from '../src/tiktok/rotateSecret.ts';
import { publishVideo } from '../src/tiktok/publish.ts';
import {
  TikTokAuthError,
  TikTokClientCredentialsError,
  TikTokInitError,
  TikTokUploadError,
  TikTokPublishFailedError,
  TikTokStatusTimeoutError,
  TikTokRotateError,
} from '../src/tiktok/types.ts';

const HERE = resolve(fileURLToPath(import.meta.url), '..', '..');
const ENV_PATH = resolve(HERE, '.env.local');
const OUT_DIR = resolve(HERE, 'out');

function yesterdayParis(): string {
  // The Revue de presse top-10 for a given Paris day publishes at the end of
  // that day, well after this CLI typically runs. Targeting yesterday's date
  // by default guarantees the page is populated. Operators backfill or
  // re-render a specific day via DATE_OVERRIDE.
  const fmt = new Intl.DateTimeFormat('fr-CA', {
    timeZone: 'Europe/Paris',
    year:  'numeric',
    month: '2-digit',
    day:   '2-digit',
  });
  const todayInParis = fmt.format(new Date());
  const [y, m, d] = todayInParis.split('-').map(Number);
  // Date.UTC normalises d-1 across month/year boundaries; the Paris
  // formatter then renders the corresponding calendar date, which is
  // unambiguous because UTC midnight is mid-day in Paris regardless of DST.
  return fmt.format(new Date(Date.UTC(y, m - 1, d - 1)));
}

async function main(): Promise<number> {
  dotenvConfig({ path: ENV_PATH });

  let env: ReturnType<typeof loadEnv>;
  try {
    env = loadEnv();
  } catch (e) {
    process.stderr.write(`${(e as Error).message}\n`);
    return 2;
  }

  const logger = pino({
    level: env.LOG_LEVEL,
    transport: process.stdout.isTTY ? { target: 'pino-pretty' } : undefined,
  });
  const date = env.DATE_OVERRIDE ?? yesterdayParis();
  logger.info({ date, mode: env.PUBLISH_MODE, dryRun: env.DRY_RUN }, 'starting tiktok post');

  await mkdir(OUT_DIR, { recursive: true });

  // 1. render
  let webmPath: string;
  let leadingMs: number;
  const fileBase = env.OUT_VARIANT ? `${date}-${env.OUT_VARIANT}` : date;
  try {
    ({ webmPath, leadingMs } = await recordScroll({
      baseUrl: env.NUXT_CAPTURE_URL,
      date,
      outDir: OUT_DIR,
      fileBase,
    }));
    logger.info({ webmPath, leadingMs }, 'recordScroll done');
  } catch (e) {
    if (e instanceof RenderInvariantError) { logger.error({ err: e.message }, 'invariant'); return 10; }
    if (e instanceof RenderNavigationError) { logger.error({ err: e.message }, 'nav'); return 11; }
    if (e instanceof RenderArtifactError) { logger.error({ err: e.message }, 'artifact'); return 12; }
    logger.error({ err: (e as Error).message }, 'render');
    return 1;
  }

  // 2. transcode — drop the blank window Playwright captured between
  // page creation and the first choreo tick so the video opens on
  // already-rendered content rather than the browser's white default.
  const mp4Path = webmPath.replace(/\.webm$/, '.mp4');
  try {
    await transcode(webmPath, mp4Path, { trimStartSec: leadingMs / 1000 });
    logger.info({ mp4Path }, 'transcode done');
  } catch (e) {
    logger.error({ err: (e as Error).message }, 'ffmpeg');
    return 13;
  }

  // 3. caption (always generated)
  const client = createRevueDePresseClient({
    baseUrl: env.API_BASE_URL,
    clientSecret: env.API_CLIENT_SECRET,
  });
  const highlights = await client.fetchTopTen(date);
  const caption = buildCaption(highlights, date);
  if (env.PUBLISH_MODE === 'inbox') {
    process.stdout.write('\n--- Suggested caption (paste in TikTok app) ---\n');
    process.stdout.write(caption);
    process.stdout.write('\n--- end caption ---\n');
  }

  // 4. dry-run short-circuit
  if (env.DRY_RUN) {
    logger.info('DRY_RUN=true; skipping TikTok publish');
    return 0;
  }

  // 5. OAuth -> rotate -> publish
  let access: string;
  let newRefresh: string;
  try {
    const t = await refreshAccessToken({
      TIKTOK_CLIENT_KEY:    env.TIKTOK_CLIENT_KEY,
      TIKTOK_CLIENT_SECRET: env.TIKTOK_CLIENT_SECRET,
      TIKTOK_REFRESH_TOKEN: env.TIKTOK_REFRESH_TOKEN,
    });
    access = t.accessToken;
    newRefresh = t.newRefreshToken;
  } catch (e) {
    if (e instanceof TikTokAuthError) {
      logger.error({ err: e.message }, 'refresh_token rejected - re-run `make tiktok-bootstrap`');
      return 20;
    }
    if (e instanceof TikTokClientCredentialsError) { logger.error({ err: e.message }, 'client credentials'); return 21; }
    logger.error({ err: (e as Error).message }, 'oauth');
    return 1;
  }

  // Persist BEFORE upload - if upload fails later, we don't lose the rotation.
  try {
    await persistRefreshToken(newRefresh, { envFilePath: ENV_PATH, pat: env.TIKTOK_SECRET_ROTATOR_PAT });
    logger.info('refresh_token rotated');
  } catch (e) {
    if (e instanceof TikTokRotateError) {
      logger.error({ err: e.message }, 'rotation failed BEFORE publish');
      process.stderr.write(`NEW_REFRESH_TOKEN=${newRefresh}\n`);
      return 26;
    }
    throw e;
  }

  try {
    const r = await publishVideo({
      accessToken: access,
      mp4Path,
      caption: env.PUBLISH_MODE === 'direct' ? caption : '',
      mode: env.PUBLISH_MODE,
    });
    logger.info({ publishId: r.publishId, finalStatus: r.finalStatus }, 'tiktok publish complete');
    return 0;
  } catch (e) {
    if (e instanceof TikTokInitError) { logger.error({ err: e.message }, 'init'); return 22; }
    if (e instanceof TikTokUploadError) { logger.error({ err: e.message }, 'upload'); return 23; }
    if (e instanceof TikTokPublishFailedError) { logger.error({ err: e.message }, 'publish FAILED'); return 24; }
    if (e instanceof TikTokStatusTimeoutError) { logger.error({ err: e.message }, 'poll timeout'); return 25; }
    logger.error({ err: (e as Error).message }, 'publish');
    return 1;
  }
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    process.stderr.write((e as Error).stack ?? String(e));
    process.exit(1);
  });
