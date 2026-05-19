import { test, expect } from '@playwright/test';
import { appShell } from '../support/selectors';
import { PAGES } from '../fixtures/pages';

// /api/highlights is mocked at the upstream level via global-setup.ts.

// Patterns to ignore in the console-error assertion: network resource
// failures (fixture avatar URLs don't resolve in DNS — harmless), and Vue/
// Nuxt hydration warnings (they fire during legitimate SSR→CSR transitions).
const IGNORED_ERROR_PATTERNS = [
  /Failed to load resource/i,
  /ERR_NAME_NOT_RESOLVED/i,
  /Hydration completed but contains mismatches/i,
  /Hydration node mismatch/i,
];

function isSignificantError(text: string): boolean {
  return !IGNORED_ERROR_PATTERNS.some((re) => re.test(text));
}

for (const route of PAGES) {
  test(`page loads cleanly: ${route.id}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && isSignificantError(msg.text())) {
        errors.push(msg.text());
      }
    });
    // pageerror catches uncaught JS exceptions — always significant.
    page.on('pageerror', (err) => {
      errors.push(`Uncaught: ${err.message}`);
    });
    const response = await page.goto(route.path);
    expect(response?.status() ?? 200).toBeLessThan(400);
    await expect(appShell(page)).toBeVisible();
    await page.waitForLoadState('networkidle');
    expect(
      errors,
      `Console errors on ${route.id} (${route.path}):\n${errors.join('\n')}`,
    ).toEqual([]);
  });
}
