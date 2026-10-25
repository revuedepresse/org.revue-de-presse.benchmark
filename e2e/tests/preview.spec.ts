import { test, expect, type Page } from '@playwright/test';
import { appShell, postCards } from '../support/selectors';
import { PREVIEW_COOKIE } from '../support/preview';

// Until their release, the Coop Médias lists and the newsletter are only
// shown while the address carries ?apercu=1, which in-site navigation keeps;
// nothing remembers it. The public site shows the French media, with the
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

  test('the highlights proxy does not ask the API for another list without apercu=1', async ({ request }) => {
    const body = await (await request.get('/api/highlights?startDate=2026-05-01&endDate=2026-05-01&list=coop-medias')).json();
    expect(body.statuses.length).toBeGreaterThan(0);
    for (const status of body.statuses) expect(status.text).not.toContain('[liste ');
  });

  test('the French media letter can be signed up to, alone, without naming any other list', async ({ page, request }) => {
    const response = await request.get('/lettre-quotidienne', { maxRedirects: 0 });
    expect(response.status()).toBe(200);

    await page.goto('/lettre-quotidienne');
    await expect(appShell(page)).toBeVisible();
    const newsletter = page.locator('.rdp-newsletter-page');
    await expect(newsletter.locator('h1')).toHaveText("La lettre d'information des médias français");
    await expect(newsletter.locator('input[type="radio"]')).toHaveCount(0);
    await expect(newsletter.locator('input[type="hidden"][name="edition"]')).toHaveValue('fr');
    await expect(newsletter).not.toContainText('Coop');
    await expect(page.locator('body')).not.toContainText('Coop Médias');
  });

  test('the Coop Médias newsletter page redirects to the home page', async ({ page, request }) => {
    for (const path of ['/lettre-quotidienne-coop-medias']) {
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
  test('shows the three lists and the newsletter invitation while the address carries it', async ({ page, isMobile }) => {
    await page.goto(`${DAY}?apercu=1`);
    await expect(appShell(page)).toBeVisible();
    expect(await previewCookie(page)).toBeUndefined();
    await expect(newsletterLink(page).first()).toBeAttached();

    await openFilters(page, isMobile);
    await expect(optionLabels(page)).toHaveText([...LISTS, ...RANKINGS]);

    const coop = page.waitForRequest(
      (r) => r.url().includes('/api/highlights') && r.url().includes('list=coop-medias'),
    );
    await option(page, 'Coop Médias').click();
    await coop;
    await expect(page).toHaveURL(/[?&]liste=coop-medias/);
    await expect(page).toHaveURL(/[?&]apercu=1/);
    await expect(postCards(page).first()).toContainText('[liste coop-medias]');

    // Following a link within the site keeps the preview in the address.
    await newsletterLink(page).first().click();
    await expect(page).toHaveURL(/\/lettre-quotidienne\?apercu=1$/);
    await expect(page.locator('.rdp-newsletter-page input[type="radio"]')).toHaveCount(4);
  });

  test('an address without it is the public site again, right after a preview', async ({ page, isMobile }) => {
    await page.goto(`${DAY}?apercu=1`);
    await expect(newsletterLink(page).first()).toBeAttached();

    await page.goto('/');
    await expect(appShell(page)).toBeVisible();
    await expect(newsletterLink(page)).toHaveCount(0);
    await openFilters(page, isMobile);
    await expect(optionLabels(page)).toHaveText(RANKINGS);
    await page.goto('/lettre-quotidienne-coop-medias');
    await expect(page).toHaveURL(/\/$/);
  });

  test('the cookie an earlier version set no longer turns the preview on, and is cleared', async ({ page, context, baseURL, isMobile }) => {
    await context.addCookies([{ name: PREVIEW_COOKIE, value: '1', url: baseURL ?? 'http://localhost:3001' }]);
    await page.goto('/');
    await expect(appShell(page)).toBeVisible();
    await expect(newsletterLink(page)).toHaveCount(0);
    await openFilters(page, isMobile);
    await expect(optionLabels(page)).toHaveText(RANKINGS);
    expect(await previewCookie(page)).toBeUndefined();
  });

  test('the server renders the chosen list on the very first visit, without setting a cookie', async ({ request }) => {
    const response = await request.get(`${DAY}?apercu=1&liste=coop-medias`);
    expect(response.headers()['set-cookie'] ?? '').not.toContain('rdp_apercu=1');
    const html = await response.text();
    expect(html).toContain('[liste coop-medias]');
    expect(html).toContain('Coop Médias');
    expect(html).toContain('class="rdp-banner-about__newsletter-link');
  });
});
