import { test as base, chromium } from '@playwright/test';
import * as chromeLauncher from 'chrome-launcher';
import { playAudit } from 'playwright-lighthouse';
import { BUDGETS } from './budgets';

// playwright-lighthouse hands the audit to `lighthouse`, which uses
// puppeteer-core's `getWSEndpoint()`. That call hits `/json/version` over
// HTTP — but Playwright always launches Chromium with
// `--remote-debugging-pipe`, and pipe mode suppresses the `/json/*` JSON API
// even when `--remote-debugging-port` is also set. So we can't reuse the
// fixture's browser for Lighthouse.
//
// chrome-launcher launches its own Chrome WITHOUT pipe mode, exposing the
// JSON API on the chosen port. We let it pick a free port per worker so
// concurrent workers can't fight over it AND we don't collide with any other
// Chrome on the host (e.g. a developer's manually-started Chrome that pinned
// 9222 for its own DevTools). The actual port is read back from
// `chrome.port` and threaded through the fixture.
//
// Playwright's bundled Chrome-for-Testing binary is used so CI doesn't need a
// separately-installed system Chrome.

type LighthouseWorkerFixtures = {
  lighthousePort: number;
};

export const lighthouseTest = base.extend<{}, LighthouseWorkerFixtures>({
  lighthousePort: [
    async ({}, use) => {
      const chrome = await chromeLauncher.launch({
        chromePath: chromium.executablePath(),
        chromeFlags: [
          '--headless=new',
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
        ],
      });
      try {
        await use(chrome.port);
      } finally {
        await chrome.kill();
      }
    },
    { scope: 'worker' },
  ],
});

export function slugify(s: string): string {
  return s.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'root';
}

export type LighthouseRunOpts = {
  url: string;
  port: number;
  reportName: string;
};

export async function runLighthouse(opts: LighthouseRunOpts): Promise<void> {
  await playAudit({
    url: opts.url,
    port: opts.port,
    ignoreBrowserName: true,
    thresholds: BUDGETS.lighthouse as unknown as Record<string, number>,
    reports: {
      formats: { html: true, json: true },
      name: opts.reportName,
      directory: 'reports/lighthouse',
    },
  });
}
