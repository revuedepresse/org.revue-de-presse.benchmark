#!/usr/bin/env node
// Dual visual regression: boot the Vue and React demos, screenshot full page
// and each <section>, then pixelmatch-diff Vue ↔ React. Fails when diff %
// exceeds DIFF_THRESHOLD (default 1.0%).
//
// Usage:
//   node scripts/visual-regression.mjs                  # compare and report
//   DIFF_THRESHOLD=0.5 node scripts/visual-regression.mjs
//
// Outputs:
//   /tmp/visual-regression/vue/<region>.png
//   /tmp/visual-regression/react/<region>.png
//   /tmp/visual-regression/diff/<region>.png       (only when diff > 0)

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = '/tmp/visual-regression';
const DIFF_THRESHOLD = Number(process.env.DIFF_THRESHOLD ?? 1.0);

const TARGETS = [
  { name: 'vue', port: 5173, filter: '@revue-de-presse/design-system-demo' },
  { name: 'react', port: 5174, filter: '@revue-de-presse/design-system-demo-react' },
];

// Regions to compare. `selector: null` means full page.
const REGIONS = [
  { id: 'fullpage', selector: null },
  { id: 'buttons', selector: 'main > section:nth-of-type(1)' },
  { id: 'form', selector: 'main > section:nth-of-type(2)' },
  { id: 'misc', selector: 'main > section:nth-of-type(3)' },
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

async function captureRegions(page, target) {
  const dir = `${OUT}/${target.name}`;
  mkdirSync(dir, { recursive: true });
  await page.goto(`http://localhost:${target.port}/`, { waitUntil: 'networkidle' });
  // Settle: web fonts, sprite <object>, layout
  await page.waitForTimeout(2000);

  const captured = [];
  for (const region of REGIONS) {
    const path = `${dir}/${region.id}.png`;
    if (region.selector) {
      const el = await page.$(region.selector);
      if (!el) {
        console.warn(`  ${target.name}/${region.id}: selector "${region.selector}" not found`);
        continue;
      }
      await el.screenshot({ path });
    } else {
      await page.screenshot({ path, fullPage: true });
    }
    captured.push(region.id);
  }
  return captured;
}

function diffPair(regionId) {
  const a = PNG.sync.read(readFileSync(`${OUT}/vue/${regionId}.png`));
  const b = PNG.sync.read(readFileSync(`${OUT}/react/${regionId}.png`));

  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const total = width * height;

  // Pad smaller image to common size by re-rendering pixel buffers cropped
  // (pixelmatch requires identical dimensions).
  const cropA = cropToSize(a, width, height);
  const cropB = cropToSize(b, width, height);

  const diff = new PNG({ width, height });
  const diffPx = pixelmatch(cropA.data, cropB.data, diff.data, width, height, {
    threshold: 0.1,
    includeAA: false,
  });

  const dimensionMismatch = a.width !== b.width || a.height !== b.height;
  const pct = (diffPx / total) * 100;
  const result = {
    regionId,
    diffPx,
    total,
    pct,
    dimensionMismatch,
    vueDim: `${a.width}x${a.height}`,
    reactDim: `${b.width}x${b.height}`,
  };

  if (diffPx > 0) {
    mkdirSync(`${OUT}/diff`, { recursive: true });
    writeFileSync(`${OUT}/diff/${regionId}.png`, PNG.sync.write(diff));
  }
  return result;
}

function cropToSize(png, width, height) {
  if (png.width === width && png.height === height) return png;
  const out = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (png.width * y + x) * 4;
      const dstIdx = (width * y + x) * 4;
      out.data[dstIdx] = png.data[srcIdx];
      out.data[dstIdx + 1] = png.data[srcIdx + 1];
      out.data[dstIdx + 2] = png.data[srcIdx + 2];
      out.data[dstIdx + 3] = png.data[srcIdx + 3];
    }
  }
  return out;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  for (const t of TARGETS) bootDemo(t);
  console.log(`booting ${TARGETS.map((t) => t.name).join(' + ')}…`);

  for (const t of TARGETS) {
    const ok = await waitFor(`http://localhost:${t.port}/`);
    console.log(`  ${t.name}: ${ok ? 'ready' : 'TIMED OUT'} (port ${t.port})`);
    if (!ok) {
      console.error(`abort: ${t.name} did not boot`);
      process.exit(1);
    }
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await ctx.newPage();

  for (const t of TARGETS) {
    const captured = await captureRegions(page, t);
    console.log(`  ${t.name}: captured ${captured.length} region(s)`);
  }

  await browser.close();
  for (const proc of procs) proc.kill('SIGTERM');

  console.log('\ncomparing regions…');
  const results = REGIONS.map((r) => diffPair(r.id));
  const failures = [];
  for (const r of results) {
    const status = r.pct <= DIFF_THRESHOLD ? 'PASS' : 'FAIL';
    if (status === 'FAIL') failures.push(r);
    const dimNote = r.dimensionMismatch ? ` (dim mismatch ${r.vueDim} vs ${r.reactDim})` : '';
    console.log(
      `  [${status}] ${r.regionId}: ${r.diffPx} / ${r.total} px diff (${r.pct.toFixed(2)}%)${dimNote}`
    );
  }

  console.log(
    `\n=== ${results.length - failures.length}/${results.length} regions pass (threshold ${DIFF_THRESHOLD}%) ===`
  );
  console.log(`screenshots in ${OUT}/{vue,react}/`);
  if (failures.length > 0) console.log(`diffs in ${OUT}/diff/`);
  process.exit(failures.length > 0 ? 1 : 0);
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
