import { chromium } from 'playwright';
import { mkdir, readdir, rename, rm } from 'node:fs/promises';
import { join } from 'node:path';
import {
  buildSteps,
  CHOREO_TOTAL_MS,
  type ChoreoStep,
} from './scrollChoreo.ts';

export interface RecordOpts {
  baseUrl: string;
  date: string;
  outDir: string;
  // Output base name (no extension). Defaults to `date`. Set this when two
  // invocations share an outDir (test parallelism) so each lands in its own
  // tempdir and its own final webm/mp4 path.
  fileBase?: string;
}

export class RenderInvariantError extends Error {
  readonly exitCode = 10;
  constructor(message: string) {
    super(message);
    this.name = 'RenderInvariantError';
  }
}

export class RenderNavigationError extends Error {
  readonly exitCode = 11;
  constructor(message: string) {
    super(message);
    this.name = 'RenderNavigationError';
  }
}

export class RenderArtifactError extends Error {
  readonly exitCode = 12;
  constructor(message: string) {
    super(message);
    this.name = 'RenderArtifactError';
  }
}

export async function recordScroll(opts: RecordOpts): Promise<{ webmPath: string; leadingMs: number }> {
  const base = opts.fileBase ?? opts.date;
  // Record into a per-invocation subdir so concurrent invocations against
  // the same outDir don't fight over Playwright's random-named .webm output.
  const videoTmpDir = join(opts.outDir, `.video-${base}`);
  await rm(videoTmpDir, { recursive: true, force: true });
  await mkdir(videoTmpDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--font-render-hinting=none'],
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 540, height: 960 },
      deviceScaleFactor: 2,
      recordVideo: {
        dir: videoTmpDir,
        size: { width: 1080, height: 1920 },
      },
    });
    const page = await context.newPage();
    // Playwright begins capturing to the .webm here. Time from this point
    // to the first choreo tick is the leading blank/white window we want
    // ffmpeg to drop on transcode.
    const recordStartMs = performance.now();

    const url = `${opts.baseUrl.replace(/\/$/, '')}/${opts.date}?capture=tiktok`;
    let resp;
    try {
      resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
    } catch (e) {
      throw new RenderNavigationError(`goto failed for ${url}: ${(e as Error).message}`);
    }
    if (!resp || resp.status() >= 400) {
      throw new RenderNavigationError(
        `status ${resp?.status() ?? 'no-response'} for ${url}`,
      );
    }

    // Pre-flight invariants
    const introCount = await page.locator('.rdp-intro-card').count();
    const outroCount = await page.locator('.rdp-banner-about').count();
    const itemsCount = await page.locator('.rdp-app__post-item').count();
    if (introCount !== 0) {
      throw new RenderInvariantError(
        `expected no .rdp-intro-card, got ${introCount}`,
      );
    }
    if (outroCount !== 0) {
      throw new RenderInvariantError(
        `expected no .rdp-banner-about, got ${outroCount}`,
      );
    }
    if (itemsCount < 1) {
      throw new RenderInvariantError(
        `expected at least 1 .rdp-app__post-item, got ${itemsCount}`,
      );
    }

    await page.evaluate(() => document.fonts.ready);

    const targetY = await page.evaluate(() => {
      const last = document.querySelector('.rdp-app__post-item:last-of-type') as HTMLElement | null;
      if (!last) return 0;
      const rect = last.getBoundingClientRect();
      return rect.bottom + window.scrollY - window.innerHeight + 24;
    });

    const steps: ChoreoStep[] = buildSteps(targetY);
    const leadingMs = performance.now() - recordStartMs;
    await page.evaluate(async (s: ChoreoStep[]) => {
      const start = performance.now();
      let i = 0;
      await new Promise<void>((resolve) => {
        // Holder pattern: tsx invokes esbuild with keepNames:true, which wraps
        // any named function declaration or `const tick = () => …` arrow with
        // a `__name(...)` helper call. That helper isn't defined in the page
        // sandbox, so the eval throws `ReferenceError: __name is not defined`.
        // Esbuild does not emit `__name` for arrows assigned via property
        // assignment after the holder is initialised to `null`.
        const tickRef: { current: (() => void) | null } = { current: null };
        tickRef.current = () => {
          const now = performance.now() - start;
          while (i < s.length - 1 && s[i + 1].atMs <= now) i++;
          window.scrollTo(0, s[i].scrollY);
          if (now >= s[s.length - 1].atMs) {
            resolve();
            return;
          }
          requestAnimationFrame(tickRef.current!);
        };
        requestAnimationFrame(tickRef.current);
      });
    }, steps);

    await page.waitForTimeout(50);

    await page.close();
    await context.close();  // flush video to disk

    const files = (await readdir(videoTmpDir)).filter((f) => f.endsWith('.webm'));
    if (files.length === 0) {
      throw new RenderArtifactError(`no .webm produced in ${videoTmpDir}`);
    }
    files.sort();
    const newest = files[files.length - 1];
    const finalPath = join(opts.outDir, `${base}.webm`);
    await rename(join(videoTmpDir, newest), finalPath);
    await rm(videoTmpDir, { recursive: true, force: true });
    return { webmPath: finalPath, leadingMs };
  } finally {
    await browser.close();
  }
}

// Silence unused-import warning for the constant when it isn't referenced
// elsewhere in this module (it's exposed so callers can read the canonical
// 23.5s total without importing scrollChoreo themselves).
void CHOREO_TOTAL_MS;
