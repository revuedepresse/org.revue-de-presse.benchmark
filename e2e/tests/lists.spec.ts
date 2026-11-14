import { test, expect, type Page } from '@playwright/test';
import { appShell, postCards } from '../support/selectors';

// All three lists are offered on any address: the French media show without
// ?liste=, and ?liste= picks one of the others.
const DAY = '/2026-05-01/actualites-du-vendredi-1-mai-2026';
const LABELS = ['Médias français', 'Coop Médias', 'Médias français + Coop Médias'];

const listOption = (page: Page, label: string) =>
  page.getByRole('option').filter({
    has: page.locator('.rdp-snapshots-list__item-label', { hasText: new RegExp(`^${label.replace(/\+/g, '\\+')}$`) }),
  });

test('offers both lists together and asks the API for list=fr-coop-medias', async ({ page, isMobile }) => {
  await page.goto(DAY);
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

test('the server renders the list ?liste= asks for, on the very first visit', async ({ request }) => {
  const html = await (await request.get(`${DAY}?liste=coop-medias`)).text();
  expect(html).toContain('[liste coop-medias]');
  expect(html).toContain('Coop Médias');
});

test('the highlights proxy forwards a list other than the French media', async ({ request }) => {
  const body = await (await request.get('/api/highlights?startDate=2026-05-01&endDate=2026-05-01&list=coop-medias')).json();
  expect(body.statuses.length).toBeGreaterThan(0);
  for (const status of body.statuses) expect(status.text).toContain('[liste coop-medias]');
});

test('the French media need no list: the proxy names none', async ({ request }) => {
  const body = await (await request.get('/api/highlights?startDate=2026-05-01&endDate=2026-05-01')).json();
  expect(body.statuses.length).toBeGreaterThan(0);
  for (const status of body.statuses) expect(status.text).not.toContain('[liste ');
});

test('the posts and their sources follow the selected list', async ({ page, isMobile }) => {
  await page.goto(`${DAY}?liste=coop-medias`);
  await expect(appShell(page)).toBeVisible();
  await expect(postCards(page).first()).toContainText('[liste coop-medias]');
  if (isMobile) await page.locator('.rdp-calendar-action-bar__filters').click();
  await expect(listOption(page, 'Coop Médias')).toHaveAttribute('aria-selected', 'true');
});
