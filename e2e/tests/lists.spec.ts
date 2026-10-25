import { test, expect, type Page } from '@playwright/test';
import { appShell } from '../support/selectors';

const LABELS = ['Médias français', 'Coop Médias', 'Médias français + Coop Médias'];

const listOption = (page: Page, label: string) =>
  page.getByRole('option').filter({
    has: page.locator('.rdp-snapshots-list__item-label', { hasText: new RegExp(`^${label.replace(/\+/g, '\\+')}$`) }),
  });

test('offers both lists together and asks the API for list=fr-coop-medias', async ({ page, isMobile }) => {
  await page.goto('/2026-05-01/actualites-du-vendredi-1-mai-2026');
  await expect(appShell(page)).toBeVisible();

  const openLists = async () => {
    if (isMobile) await page.locator('.rdp-calendar-action-bar__filters').click();
  };
  await openLists();
  for (const label of LABELS) {
    await expect(listOption(page, label)).toBeVisible();
  }

  const highlights = page.waitForRequest(
    (r) => r.url().includes('/api/highlights') && r.url().includes('list=fr-coop-medias'),
  );
  await listOption(page, 'Médias français + Coop Médias').click();
  await highlights;
  await expect(page).toHaveURL(/[?&]liste=fr-coop-medias/);

  await openLists();
  await expect(listOption(page, 'Médias français + Coop Médias')).toHaveAttribute('aria-selected', 'true');
});
