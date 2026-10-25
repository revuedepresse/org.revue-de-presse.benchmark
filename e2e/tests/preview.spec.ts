import { test, expect, type Page } from '@playwright/test';
import { appShell, postCards } from '../support/selectors';
import { PREVIEW_COOKIE } from '../support/preview';

// Until their release, the Coop Médias lists and the newsletter are only
// shown in preview: ?apercu=1 turns it on for the browsing session (cookie),
// ?apercu=0 turns it off. The public site shows the French media, with the
// choice of ranking.

const DAY = '/2026-05-01/actualites-du-vendredi-1-mai-2026';
const LISTS = ['Médias français', 'Coop Médias', 'Médias français + Coop Médias'];
const RANKINGS = ['Fin de journée', 'Première mesure'];

const option = (page: Page, label: string) =>
  page.getByRole('option').filter({
    has: page.locator('.rdp-snapshots-list__item-label', { hasText: new RegExp(`^${label.replace(/\+/g, '\\+')}$`) }),
  });
const optionLabels = (page: Page) => page.locator('[role="option"] .rdp-snapshots-list__item-label');
const newsletterLink = (page: Page) => page.locator('.rdp-banner-about__newsletter-link');

async function openFilters(page: Page, isMobile: boolean) {
  if (isMobile) await page.locator('.rdp-calendar-action-bar__filters').click();
}

const previewCookie = async (page: Page) =>
  (await page.context().cookies()).find((c) => c.name === PREVIEW_COOKIE);

test.describe('without the preview', () => {
  test('no list picker and no newsletter invitation, the ranking picker with both rankings', async ({ page, isMobile }) => {
    await page.goto(DAY);
    await expect(appShell(page)).toBeVisible();
    await expect(newsletterLink(page)).toHaveCount(0);
    await expect(page.locator('a[href^="/lettre-quotidienne"]')).toHaveCount(0);

    await openFilters(page, isMobile);
    await expect(optionLabels(page)).toHaveText(RANKINGS);
    await expect(option(page, 'Fin de journée')).toHaveAttribute('aria-selected', 'true');

    const firstSighting = page.waitForRequest(
      (r) => r.url().includes('/api/highlights') && r.url().includes('ranking=first-sighting'),
    );
    await option(page, 'Première mesure').click();
    const request = await firstSighting;
    expect(request.url()).not.toContain('list=');
    await expect(page).toHaveURL(/[?&]classement=premiere-mesure/);

    await openFilters(page, isMobile);
    await expect(option(page, 'Première mesure')).toHaveAttribute('aria-selected', 'true');
    await option(page, 'Fin de journée').click();
    await expect(page).not.toHaveURL(/classement=/);
  });

  test('the server already renders no list picker nor newsletter invitation', async ({ request, isMobile }) => {
    const html = await (await request.get(DAY)).text();
    // On a phone, the pickers wait in the closed filters sheet.
    if (!isMobile) expect(html).toContain('Première mesure');
    expect(html).not.toContain('Coop Médias');
    expect(html).not.toContain('class="rdp-banner-about__newsletter');
  });

  test('?liste= is ignored: French media only, and the API is not asked for another list', async ({ page }) => {
    const listRequests: string[] = [];
    page.on('request', (r) => {
      if (r.url().includes('/api/highlights') && r.url().includes('list=')) listRequests.push(r.url());
    });
    await page.goto(`${DAY}?liste=coop-medias`);
    await expect(appShell(page)).toBeVisible();
    await expect(postCards(page).first()).toBeVisible();
    await expect(page.locator('body')).not.toContainText('[liste ');
    expect(listRequests).toEqual([]);
  });

  test('the highlights proxy does not ask the API for another list without the preview cookie', async ({ request }) => {
    const body = await (await request.get('/api/highlights?startDate=2026-05-01&endDate=2026-05-01&list=coop-medias')).json();
    expect(body.statuses.length).toBeGreaterThan(0);
    for (const status of body.statuses) expect(status.text).not.toContain('[liste ');
  });

  test('the newsletter pages redirect to the home page', async ({ page, request }) => {
    for (const path of ['/lettre-quotidienne', '/lettre-quotidienne-coop-medias']) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status()).toBe(302);
      expect(response.headers().location).toBe('/');

      await page.goto(path);
      await expect(page).toHaveURL(/\/$/);
      await expect(appShell(page)).toBeVisible();
    }
  });

  test('the sitemap lists no newsletter page', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('/sources');
    expect(sitemap).not.toContain('lettre-quotidienne');
  });
});

test.describe('with ?apercu=1', () => {
  test('shows the three lists and the newsletter invitation, and keeps the preview from page to page', async ({ page, isMobile }) => {
    await page.goto(`${DAY}?apercu=1`);
    await expect(appShell(page)).toBeVisible();
    expect((await previewCookie(page))?.value).toBe('1');
    await expect(newsletterLink(page).first()).toBeAttached();

    await openFilters(page, isMobile);
    await expect(optionLabels(page)).toHaveText([...LISTS, ...RANKINGS]);

    const coop = page.waitForRequest(
      (r) => r.url().includes('/api/highlights') && r.url().includes('list=coop-medias'),
    );
    await option(page, 'Coop Médias').click();
    await coop;
    await expect(page).toHaveURL(/[?&]liste=coop-medias/);
    await expect(postCards(page).first()).toContainText('[liste coop-medias]');

    // A new page load without ?apercu=1 keeps the preview through the cookie.
    await page.goto('/sources');
    await expect(appShell(page)).toBeVisible();
    await expect(newsletterLink(page).first()).toBeAttached();
    await page.goto('/lettre-quotidienne');
    await expect(page).toHaveURL(/\/lettre-quotidienne$/);
    await expect(page.locator('.rdp-newsletter-page')).toBeVisible();

    // ?apercu=0 turns it off.
    await page.goto('/?apercu=0');
    await expect(appShell(page)).toBeVisible();
    expect(await previewCookie(page)).toBeUndefined();
    await expect(newsletterLink(page)).toHaveCount(0);
    await page.goto('/lettre-quotidienne');
    await expect(page).toHaveURL(/\/$/);
  });

  test('the server renders the chosen list on the very first visit', async ({ request }) => {
    const response = await request.get(`${DAY}?apercu=1&liste=coop-medias`);
    expect(response.headers()['set-cookie']).toMatch(/rdp_apercu=1; Path=\//);
    const html = await response.text();
    expect(html).toContain('[liste coop-medias]');
    expect(html).toContain('Coop Médias');
    expect(html).toContain('class="rdp-banner-about__newsletter-link');
  });
});
