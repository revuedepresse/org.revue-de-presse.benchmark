import type { Page } from '@playwright/test';
import { getFixture } from '../fixtures/highlights';

// Intercepts /api/highlights at the browser level so neither app reaches
// upstream. Both apps expose the same proxy URL with the same response shape.
export async function mockHighlights(page: Page): Promise<void> {
  await page.route('**/api/highlights*', async (route) => {
    const url = new URL(route.request().url());
    const startDate = url.searchParams.get('startDate') ?? '2026-05-01';
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(getFixture(startDate)),
    });
  });
}
