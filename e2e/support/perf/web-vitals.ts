import { createRequire } from 'node:module';
import type { Page } from '@playwright/test';
import { BUDGETS, type WebVitalsBudget } from './budgets';

const require = createRequire(import.meta.url);
// Inject the IIFE bundle so `webVitals` is a page global before any app script runs.
const WEB_VITALS_IIFE = require.resolve('web-vitals/dist/web-vitals.iife.js');

export type WebVitalsReport = Partial<
  Record<'LCP' | 'INP' | 'CLS' | 'TTFB' | 'FCP', number>
>;

export async function collectWebVitals(page: Page, url: string): Promise<WebVitalsReport> {
  await page.addInitScript({ path: WEB_VITALS_IIFE });
  await page.addInitScript(() => {
    (window as unknown as { __vitals: WebVitalsReport }).__vitals = {};
    const wv = (window as unknown as {
      webVitals: Record<string, (cb: (m: { value: number }) => void) => void>;
    }).webVitals;
    const set = (k: keyof WebVitalsReport) => (m: { value: number }) => {
      (window as unknown as { __vitals: WebVitalsReport }).__vitals[k] = m.value;
    };
    wv.onLCP(set('LCP'));
    wv.onINP(set('INP'));
    wv.onCLS(set('CLS'));
    wv.onTTFB(set('TTFB'));
    wv.onFCP(set('FCP'));
  });

  await page.goto(url);
  await page.waitForLoadState('networkidle');
  // INP requires interaction; synthesize a click + scroll.
  await page.mouse.click(10, 10);
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.waitForTimeout(500);

  return page.evaluate(() => (window as unknown as { __vitals: WebVitalsReport }).__vitals);
}

export async function measureN<T>(n: number, fn: () => Promise<T>): Promise<T[]> {
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(await fn());
  return out;
}

export function medianWebVitals(reports: WebVitalsReport[]): WebVitalsReport {
  const keys: (keyof WebVitalsReport)[] = ['LCP', 'INP', 'CLS', 'TTFB', 'FCP'];
  const result: WebVitalsReport = {};
  for (const k of keys) {
    const values = reports
      .map((r) => r[k])
      .filter((v): v is number => v != null)
      .sort((a, b) => a - b);
    if (values.length > 0) result[k] = values[Math.floor(values.length / 2)];
  }
  return result;
}

export function assertWebVitals(
  report: WebVitalsReport,
  budget: WebVitalsBudget = BUDGETS.webVitals,
  ctx: { project: string; route: string } = { project: '', route: '' },
): void {
  const violations: string[] = [];
  for (const k of ['LCP', 'INP', 'CLS', 'TTFB', 'FCP'] as const) {
    const value = report[k];
    if (value == null) continue;
    const max = budget[k];
    if (value > max) violations.push(`${k}=${value} > ${max}`);
  }
  if (violations.length > 0) {
    throw new Error(`[web-vitals] ${ctx.project} ${ctx.route}: ${violations.join(', ')}`);
  }
}
