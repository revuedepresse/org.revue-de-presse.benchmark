import { playAudit } from 'playwright-lighthouse';
import type { Page } from '@playwright/test';
import { BUDGETS } from './budgets';

// Each Playwright worker needs a distinct remote-debugging port so concurrent
// Lighthouse runs don't collide. playwright.config.ts sets the base port via
// --remote-debugging-port on launch; we offset by workerIndex here.
const LIGHTHOUSE_PORT_BASE = 9222;

export function lighthousePortForWorker(workerIndex: number): number {
  return LIGHTHOUSE_PORT_BASE + workerIndex;
}

export function slugify(s: string): string {
  return s.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'root';
}

export type LighthouseRunOpts = {
  url: string;
  port: number;
  reportName: string;
};

export async function runLighthouse(page: Page, opts: LighthouseRunOpts): Promise<void> {
  await playAudit({
    page,
    url: opts.url,
    port: opts.port,
    thresholds: BUDGETS.lighthouse as unknown as Record<string, number>,
    reports: {
      formats: { html: true, json: true },
      name: opts.reportName,
      directory: 'reports/lighthouse',
    },
  });
}
