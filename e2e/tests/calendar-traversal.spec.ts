import { test, expect } from '@playwright/test';
import { postCards } from '../support/selectors';
import { mulberry32, pickRandomDates, ymd, yesterday } from '../support/seeded';
import { getFixture } from '../fixtures/highlights';

// /api/highlights is mocked at the upstream level via global-setup.ts.

test('curated 2026-05-01 renders the three named sources', async ({ page }) => {
  await page.goto('/2026-05-01');
  // Assert on body content (set verbatim by the fixture). Author display
  // names are derived from the handle (franceculture.fr -> "Franceculture"),
  // not from the fixture's friendly name, so we don't assert on those.
  const cards = page.locator('[data-testid="post-card"]');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toContainText('France Culture curated post');
  await expect(cards.nth(1)).toContainText('Le Monde curated post');
  await expect(cards.nth(2)).toContainText('Mediapart curated post');
});

// URL-based traversal rather than calendar-UI click-through. The design-system
// CalendarActionBar prev/next moves by day, not month — clicking through to a
// 6-month-old date would take ~180 clicks. Month-picker UI is a separate
// MonthPicker overlay (not yet wired into selectors). This test still exercises
// what matters: fixture resolves per-date, URL routing produces the right shell,
// post count matches the fixture's statuses length. A follow-up can replace
// `page.goto(dateUrl)` with real calendar clicks once MonthPicker is selectable.
test('visiting 5 seeded-random dates produces the expected post count', async ({ page }) => {
  const seed = parseInt(process.env.E2E_SEED ?? '42', 10);
  const rng = mulberry32(seed);
  const MIN = new Date(2025, 2, 4); // 4 Mar 2025
  const MAX = yesterday();
  const dates = pickRandomDates(rng, 5, MIN, MAX);
  for (const date of dates) {
    const url = `/${ymd(date)}`;
    await page.goto(url);
    await expect(page).toHaveURL(new RegExp(`/${ymd(date)}`));
    await expect(postCards(page)).toHaveCount(getFixture(ymd(date)).statuses.length);
  }
});
