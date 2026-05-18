import { test, expect } from '@playwright/test';
import { mockHighlights } from '../support/mockApi';
import { appShell } from '../support/selectors';
import { PAGES } from '../fixtures/pages';

for (const route of PAGES) {
  test(`page loads cleanly: ${route.id}`, async ({ page }) => {
    await mockHighlights(page);
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
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
