import { chromium } from 'playwright';
import { readdir, rename } from 'node:fs/promises';
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

export async function recordScroll(opts: RecordOpts): Promise<{ webmPath: string }> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--font-render-hinting=none'],
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 540, height: 960 },
      deviceScaleFactor: 2,
      recordVideo: {
        dir: opts.outDir,
        size: { width: 1080, height: 1920 },
      },
    });
    const page = await context.newPage();

    const url = `${opts.baseUrl.replace(/\/$/, '')}/${opts.date}/?capture=tiktok`;
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
    await page.evaluate(async (s: ChoreoStep[]) => {
      const start = performance.now();
      let i = 0;
      await new Promise<void>((resolve) => {
        function tick(): void {
          const now = performance.now() - start;
          while (i < s.length - 1 && s[i + 1].atMs <= now) i++;
          window.scrollTo(0, s[i].scrollY);
          if (now >= s[s.length - 1].atMs) {
            resolve();
            return;
          }
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, steps);

    await page.waitForTimeout(50);

    await page.close();
    await context.close();  // flush video to disk

    const files = (await readdir(opts.outDir)).filter(
      (f) => f.endsWith('.webm') && !f.startsWith(opts.date),
    );
    if (files.length === 0) {
      throw new RenderArtifactError(`no .webm produced in ${opts.outDir}`);
    }
    files.sort();
    const newest = files[files.length - 1];
    const finalPath = join(opts.outDir, `${opts.date}.webm`);
    await rename(join(opts.outDir, newest), finalPath);
    return { webmPath: finalPath };
  } finally {
    await browser.close();
  }
}

// Silence unused-import warning for the constant when it isn't referenced
// elsewhere in this module (it's exposed so callers can read the canonical
// 23.5s total without importing scrollChoreo themselves).
void CHOREO_TOTAL_MS;
