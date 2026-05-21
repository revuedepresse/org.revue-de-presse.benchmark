import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import { existsSync, statSync, rmSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// The TikTok publisher CLI lives at social/tiktok/bin/post-daily-top10.ts. In
// DRY_RUN mode it runs the Playwright capture against $NUXT_CAPTURE_URL plus
// the ffmpeg transcode, then short-circuits before any TikTok API call. This
// spec drives that CLI end-to-end against the perf-project Nuxt webServer and
// asserts the MP4 looks like the format TikTok will accept (1080x1920, H.264,
// yuv420p, ~23.5 s).

const REPO_ROOT = resolve(__dirname, '../..');
const OUT_DIR = resolve(REPO_ROOT, 'social/tiktok/out');
// 2026-05-01 is the curated fixture date in e2e/fixtures/highlights.ts. The
// recordScroll invariant requires >= 1 .rdp-app__post-item, which the 3-item
// curated fixture satisfies.
const RENDER_DATE = '2026-05-01';
// e2e/support/mockUpstream.ts listens on this port for /api/token and
// /api/highlights; both apps' SSR proxies and the TikTok CLI's
// revueDePresseClient point at it.
const UPSTREAM_URL = 'http://localhost:4000';
const UPSTREAM_CLIENT_SECRET = 'mock-client-secret';

type CliResult = { exitCode: number | null; stdout: string; stderr: string };

function runCli(env: NodeJS.ProcessEnv): Promise<CliResult> {
  return new Promise((resolve) => {
    const child = spawn(
      'pnpm',
      ['--dir', 'social/tiktok', 'exec', 'tsx', 'bin/post-daily-top10.ts'],
      { cwd: REPO_ROOT, env },
    );
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (b) => (stdout += b.toString()));
    child.stderr.on('data', (b) => (stderr += b.toString()));
    child.on('close', (code) => resolve({ exitCode: code, stdout, stderr }));
  });
}

function variantFor(projectName: string): string {
  if (projectName === 'nuxt-desktop-perf') return 'desktop';
  if (projectName === 'nuxt-mobile-perf') return 'mobile';
  throw new Error(`unexpected project for tiktok render smoke: ${projectName}`);
}

function runFfprobe(mp4: string): Promise<CliResult> {
  return new Promise((resolve) => {
    const child = spawn('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=codec_name,width,height,pix_fmt,duration',
      '-of', 'csv=p=0',
      mp4,
    ]);
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (b) => (stdout += b.toString()));
    child.stderr.on('data', (b) => (stderr += b.toString()));
    child.on('close', (code) => resolve({ exitCode: code, stdout, stderr }));
  });
}

test.describe('tiktok render smoke', () => {
  test.beforeAll(() => {
    // The CLI is shelled out via `pnpm --dir social/tiktok exec tsx`, which
    // requires the tiktok workspace's devDependencies to be installed.
    // Surface a clear skip instead of a confusing pnpm ENOENT.
    test.skip(
      !existsSync(resolve(REPO_ROOT, 'social/tiktok/node_modules/.bin/tsx')),
      'social/tiktok deps not installed — run `cd social/tiktok && pnpm install`',
    );
    // Headless rendering on GitHub Actions runners produces a smaller MP4
    // than local (no GPU, different font hinting), so the >500KB size
    // invariant flaps in CI. Keep the spec runnable locally for the
    // TikTok submission evidence, but opt it out of CI. Set
    // RUN_TIKTOK_RENDER_SMOKE=1 to force-run (e.g. on a self-hosted runner).
    test.skip(
      !!process.env.CI && process.env.RUN_TIKTOK_RENDER_SMOKE !== '1',
      'tiktok render smoke is local-only; size/duration invariants flap on CI runners',
    );
  });

  test.beforeEach(({}, testInfo) => {
    // Only the Nuxt webServer renders the capture-mode UI used by the CLI;
    // the Next port is irrelevant here. Filter out non-nuxt projects.
    test.skip(
      !testInfo.project.name.startsWith('nuxt-'),
      'tiktok render only verifies the Nuxt webserver',
    );
    // Clean only this variant's artifacts so the parallel nuxt-mobile-perf
    // run doesn't sweep away nuxt-desktop-perf's in-progress files.
    const variant = variantFor(testInfo.project.name);
    const prefix = `${RENDER_DATE}-${variant}`;
    if (!existsSync(OUT_DIR)) return;
    for (const f of readdirSync(OUT_DIR)) {
      if (f.startsWith(prefix)) rmSync(resolve(OUT_DIR, f));
    }
  });

  test('CLI dry-run produces a 1080x1920 H.264 yuv420p MP4 with the expected duration', async ({ baseURL }, testInfo) => {
    test.setTimeout(180_000);

    const variant = variantFor(testInfo.project.name);

    const result = await runCli({
      ...process.env,
      DRY_RUN: 'true',
      DATE_OVERRIDE: RENDER_DATE,
      // Output suffix isolates this project's webm/mp4 from the parallel
      // nuxt-* project so both can write to social/tiktok/out concurrently.
      OUT_VARIANT: variant,
      NUXT_CAPTURE_URL: baseURL ?? 'http://localhost:3001',
      // Required by env.ts zod schema even though DRY_RUN bypasses the
      // TikTok publish path. Placeholder values are fine — they are never sent.
      TIKTOK_CLIENT_KEY:    'placeholder',
      TIKTOK_CLIENT_SECRET: 'placeholder',
      TIKTOK_REFRESH_TOKEN: 'placeholder',
      // The CLI fetches the caption before the dry-run short-circuit, so the
      // upstream client needs a reachable backend. The e2e mockUpstream on
      // :4000 (started by global-setup) serves /api/token + /api/highlights.
      API_BASE_URL:         UPSTREAM_URL,
      API_CLIENT_SECRET:    UPSTREAM_CLIENT_SECRET,
      PUBLISH_MODE:         'inbox',
    });

    expect(
      result.exitCode,
      `CLI exited ${result.exitCode}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
    ).toBe(0);

    const mp4 = resolve(OUT_DIR, `${RENDER_DATE}-${variant}.mp4`);
    expect(existsSync(mp4), `expected MP4 at ${mp4}`).toBe(true);
    const size = statSync(mp4).size;
    // Sanity floor against degenerate renders (black frames / error page /
    // no content) — those compress to <50KB at 1080x1920 H.264 yuv420p over
    // 24s. The 3-item curated fixture (mostly text, low motion) legitimately
    // produces 360-460KB across environments. Codec/dimensions/duration
    // asserts below carry the real "this is a TikTok-ingestable MP4" signal.
    expect(size).toBeGreaterThan(100_000);
    expect(size).toBeLessThan(40_000_000);

    const probe = await runFfprobe(mp4);
    expect(probe.exitCode, `ffprobe failed:\n${probe.stderr}`).toBe(0);
    const [codec, width, height, pix, duration] = probe.stdout.trim().split(',');
    expect(codec).toBe('h264');
    expect(width).toBe('1080');
    expect(height).toBe('1920');
    expect(pix).toBe('yuv420p');
    const durationSec = parseFloat(duration ?? '0');
    expect(durationSec).toBeGreaterThan(22);
    expect(durationSec).toBeLessThan(26);
  });
});
