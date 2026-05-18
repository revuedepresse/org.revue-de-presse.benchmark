import { test, expect } from '@playwright/test';
import { appShell, postCards } from '../support/selectors';

// /api/highlights is mocked at the upstream level via global-setup.ts so
// both SSR (Nuxt) and CSR (Next) fetches see the same fixture data.

test('home renders shell with a synth-fixture-shaped post list', async ({ page }) => {
  await page.goto('/');
  await expect(appShell(page)).toBeVisible();
  // The homepage fetches "yesterday" relative to host time. We don't pin Date
  // because the synth fixture guarantees 3-7 statuses for any date — assert
  // the contract, not specific names. Curated-content assertions live in
  // calendar-traversal.spec.ts where we visit a known date.
  const cards = postCards(page);
  await expect(cards.first()).toBeVisible();
  const count = await cards.count();
  expect(count).toBeGreaterThanOrEqual(3);
  expect(count).toBeLessThanOrEqual(7);
});
