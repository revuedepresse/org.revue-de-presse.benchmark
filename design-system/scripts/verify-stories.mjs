#!/usr/bin/env node
// Walk every variant of every M1 story in Histoire and assert that:
//   1. The iframe sandbox loads without page-level JS errors
//   2. At least one `rdp-*` element exists in the iframe DOM
//   3. The iframe DOM has --color-brand defined (means tokens.css loaded)
// Output: PASS/FAIL line per variant, plus failure detail.

import { chromium } from 'playwright';

const BASE = process.env.HISTOIRE_URL ?? 'http://localhost:6006';

// One entry per story. variantCount drives the iteration.
const STORIES = [
  { id: 'stories-button-story-vue', variantCount: 9, name: 'Button' },
  { id: 'stories-checkbox-story-vue', variantCount: 2, name: 'Checkbox' },
  { id: 'stories-emailfield-story-vue', variantCount: 2, name: 'EmailField' },
  { id: 'stories-fielderror-story-vue', variantCount: 1, name: 'FieldError' },
  { id: 'stories-formerror-story-vue', variantCount: 2, name: 'FormError' },
  { id: 'stories-icon-story-vue', variantCount: 2, name: 'Icon' },
  { id: 'stories-link-story-vue', variantCount: 3, name: 'Link' },
  { id: 'stories-logo-story-vue', variantCount: 4, name: 'Logo' },
  { id: 'stories-mediaplaceholder-story-vue', variantCount: 2, name: 'MediaPlaceholder' },
  { id: 'stories-passwordfield-story-vue', variantCount: 3, name: 'PasswordField' },
  { id: 'stories-textfield-story-vue', variantCount: 2, name: 'TextField' },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

const results = [];
let totalErrors = 0;

for (const story of STORIES) {
  for (let v = 0; v < story.variantCount; v++) {
    const variantId = `${story.id}-${v}`;
    const sandboxUrl = `${BASE}/__sandbox.html?storyId=${story.id}&variantId=${variantId}`;
    const errs = [];
    const consoleErrors = [];
    const onConsole = (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    };
    const onPageError = (err) => errs.push(err.message);
    page.on('console', onConsole);
    page.on('pageerror', onPageError);

    try {
      await page.goto(sandboxUrl, { waitUntil: 'networkidle', timeout: 15_000 });
      await page.waitForTimeout(300);
      const evidence = await page.evaluate(() => {
        const rdp = document.querySelectorAll('[class^="rdp-"]');
        const brandVar = getComputedStyle(document.documentElement)
          .getPropertyValue('--color-brand')
          .trim();
        // Find first rdp-* element and capture its key computed styles
        const first = rdp[0];
        const firstInfo = first
          ? (() => {
              const cs = getComputedStyle(first);
              // SVG elements have SVGAnimatedString — coerce via getAttribute.
              const cls = first.getAttribute('class') ?? '';
              return {
                tag: first.tagName,
                cls,
                w: cs.width,
                h: cs.height,
                color: cs.color,
                bg: cs.backgroundColor,
                display: cs.display,
              };
            })()
          : null;
        return {
          rdpCount: rdp.length,
          brandVar,
          firstInfo,
          totalEls: document.querySelectorAll('*').length,
        };
      });
      const failures = [];
      if (evidence.rdpCount === 0) failures.push('NO rdp-* element');
      if (evidence.brandVar !== '#006663')
        failures.push(`--color-brand="${evidence.brandVar}" (expected #006663)`);
      if (consoleErrors.length > 0)
        failures.push(`console-errors: ${consoleErrors.slice(0, 2).join(' | ')}`);
      if (errs.length > 0)
        failures.push(`page-errors: ${errs.slice(0, 2).join(' | ')}`);

      const status = failures.length === 0 ? 'PASS' : 'FAIL';
      results.push({ name: `${story.name}#${v}`, status, evidence, failures });
      const firstCls = (evidence.firstInfo?.cls ?? '').split(' ')[0] || '(none)';
      console.log(
        `[${status}] ${story.name}#${v} — rdp:${evidence.rdpCount} els:${evidence.totalEls} brand:${evidence.brandVar} first:${firstCls}`
      );
      if (status === 'FAIL') {
        totalErrors++;
        for (const f of failures) console.log(`  → ${f}`);
      }
    } catch (e) {
      totalErrors++;
      console.log(`[FAIL] ${story.name}#${v} — exception: ${e.message}`);
      results.push({ name: `${story.name}#${v}`, status: 'FAIL', failures: [e.message] });
    } finally {
      page.removeListener('console', onConsole);
      page.removeListener('pageerror', onPageError);
    }
  }
}

console.log(`\n=== summary: ${results.length - totalErrors}/${results.length} pass ===`);
await browser.close();
process.exit(totalErrors > 0 ? 1 : 0);
