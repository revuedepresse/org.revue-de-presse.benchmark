import { test, expect } from '@playwright/test';
import { postCards, openCalendar, clickDate } from '../support/selectors';
import { mulberry32, pickRandomDates, ymd, yesterday } from '../support/seeded';
import { getFixture } from '../fixtures/highlights';

// /api/highlights is mocked at the upstream level via global-setup.ts.

test('curated 2026-05-01 renders the three named sources', async ({ page }) => {
  await page.goto('/2026-05-01');
  await expect(page.getByText('France Culture')).toBeVisible();
  await expect(page.getByText('Le Monde')).toBeVisible();
  await expect(page.getByText('Mediapart')).toBeVisible();
});

test('clicking 5 seeded-random dates updates URL and post count', async ({ page }) => {
  await page.goto('/');
  const seed = parseInt(process.env.E2E_SEED ?? '42', 10);
  const rng = mulberry32(seed);
  const MIN = new Date(2025, 2, 4); // 4 Mar 2025
  const MAX = yesterday();
  const dates = pickRandomDates(rng, 5, MIN, MAX);
  for (const date of dates) {
    await openCalendar(page);
    await clickDate(page, date);
    await expect(page).toHaveURL(new RegExp(`/${ymd(date)}/actualites-du-`));
    await expect(postCards(page)).toHaveCount(getFixture(ymd(date)).statuses.length);
  }
});
