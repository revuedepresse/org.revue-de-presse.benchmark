#!/usr/bin/env node
// Boot apps/demo-{vue,react,svelte,solid} in parallel, screenshot Button#primary
// in each, assert the rdp-button element exists with the brand background colour
// applied. Verifies cross-framework parity before publishing.

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const TARGETS = [
  { name: 'vue', port: 5173, filter: '@revue-de-presse/design-system-demo' },
  { name: 'react', port: 5174, filter: '@revue-de-presse/design-system-demo-react' },
  { name: 'svelte', port: 5175, filter: '@revue-de-presse/design-system-demo-svelte' },
  { name: 'solid', port: 5176, filter: '@revue-de-presse/design-system-demo-solid' },
];

const procs = [];
function bootDemo(target) {
  const proc = spawn('pnpm', ['--filter', target.filter, 'dev'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
  });
  proc.stdout.on('data', () => {});
  proc.stderr.on('data', () => {});
  procs.push(proc);
  return proc;
}

async function waitFor(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(url);
      if (r.ok) return true;
    } catch {}
    await sleep(500);
  }
  return false;
}

async function main() {
  for (const t of TARGETS) bootDemo(t);
  console.log('booting demos…');

  for (const t of TARGETS) {
    const ok = await waitFor(`http://localhost:${t.port}/`);
    console.log(`  ${t.name}: ${ok ? 'ready' : 'TIMED OUT'} (port ${t.port})`);
    if (!ok) {
      console.error(`abort: ${t.name} did not boot`);
      process.exit(1);
    }
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 800, height: 400 } });
  const page = await ctx.newPage();
  const screenshotDir = '/tmp/cross-target';
  mkdirSync(screenshotDir, { recursive: true });

  const results = [];
  for (const t of TARGETS) {
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errs.push(m.text());
    });
    await page.goto(`http://localhost:${t.port}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const evidence = await page.evaluate(() => {
      const btn = document.querySelector('button.rdp-button.rdp-button--primary');
      if (!btn) return { btnFound: false };
      const cs = getComputedStyle(btn);
      const useTags = btn.querySelectorAll('use').length;
      return {
        btnFound: true,
        text: btn.textContent?.trim().slice(0, 40),
        bg: cs.backgroundColor,
        color: cs.color,
        w: cs.width,
        h: cs.height,
        iconUseCount: useTags,
        brandVar: getComputedStyle(document.documentElement)
          .getPropertyValue('--color-brand')
          .trim(),
      };
    });
    await page.screenshot({ path: `${screenshotDir}/${t.name}.png` });

    const ok =
      evidence.btnFound === true &&
      evidence.bg === 'rgb(0, 205, 199)' &&
      evidence.color === 'rgb(255, 255, 255)' &&
      evidence.iconUseCount === 1 &&
      evidence.brandVar === '#006663' &&
      errs.length === 0;
    results.push({ target: t.name, ok, evidence, errors: errs });

    console.log(
      `[${ok ? 'PASS' : 'FAIL'}] ${t.name}: btn=${evidence.btnFound} bg=${evidence.bg} icons=${evidence.iconUseCount} brand=${evidence.brandVar} errors=${errs.length}`
    );
    if (!ok) {
      for (const e of errs) console.log(`  → console: ${e}`);
      console.log(`  → evidence: ${JSON.stringify(evidence)}`);
    }
  }

  await browser.close();
  for (const proc of procs) proc.kill('SIGTERM');

  const failures = results.filter((r) => !r.ok).length;
  console.log(`\n=== ${results.length - failures}/${results.length} targets pass ===`);
  console.log(`screenshots saved to ${screenshotDir}/`);
  process.exit(failures > 0 ? 1 : 0);
}

process.on('SIGINT', () => {
  for (const proc of procs) proc.kill('SIGTERM');
  process.exit(130);
});

main().catch((err) => {
  console.error(err);
  for (const proc of procs) proc.kill('SIGTERM');
  process.exit(1);
});
