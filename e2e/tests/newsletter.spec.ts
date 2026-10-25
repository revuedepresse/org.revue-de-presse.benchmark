import { test, expect, type Page, type Request } from '@playwright/test';
import { appShell } from '../support/selectors';
import { withPreview } from '../support/preview';

// The newsletter is only offered in preview until its release.
// The sign-up form is a plain HTML POST to the API. Intercept it so the test
// reads exactly what the browser sends, without leaving the mock setup.
const SUBSCRIBE_URL = 'https://api.revue-de-presse.org/newsletter/subscribe';

async function submitAndCapture(page: Page): Promise<URLSearchParams> {
  let posted: Request | undefined;
  await page.route(SUBSCRIBE_URL, async (route) => {
    posted = route.request();
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<p>ok</p>' });
  });
  await page.locator('#newsletter-email').fill('reader@example.org');
  await page.locator('.rdp-newsletter-page__submit').click();
  await expect.poll(() => posted).toBeDefined();
  expect(posted!.method()).toBe('POST');
  return new URLSearchParams(posted!.postData() ?? '');
}

const radio = (page: Page, edition: string) =>
  page.locator(`.rdp-newsletter-page input[type="radio"][name="edition"][value="${edition}"]`);

test.describe('/lettre-quotidienne', () => {
  test('offers French media, Coop Médias, both in one letter or both letters, both letters checked', async ({ page }) => {
    await page.goto(withPreview('/lettre-quotidienne'));
    await expect(appShell(page)).toBeVisible();
    await expect(page.locator('.rdp-newsletter-page input[type="radio"][name="edition"]')).toHaveCount(4);
    await expect(radio(page, 'both')).toBeChecked();
    await expect(page.locator('.rdp-newsletter-page')).toContainText('Un seul e-mail de confirmation');
  });

  test('choosing a letter moves neither the heading, the intro nor the form', async ({ page }) => {
    await page.goto(withPreview('/lettre-quotidienne'));
    await expect(appShell(page)).toBeVisible();
    // Positions in the page, not the viewport: checking a radio may scroll it into view.
    const boxes = async () =>
      page.evaluate(() =>
        ['.rdp-newsletter-page h1', '.rdp-newsletter-page h1 + p', '#newsletter-email', '.rdp-newsletter-page__submit'].map((selector) => {
          const r = document.querySelector(selector)!.getBoundingClientRect();
          return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
        }),
      );
    const before = await boxes();
    for (const edition of ['fr', 'coop-medias', 'fr-coop-medias', 'both']) {
      await radio(page, edition).check();
      await expect(page.locator('.rdp-newsletter-page')).toHaveAttribute('data-edition', edition);
      expect(await boxes()).toEqual(before);
    }
  });

  for (const edition of ['fr', 'coop-medias', 'fr-coop-medias', 'both']) {
    test(`posts edition=${edition} when that letter is chosen`, async ({ page }) => {
      await page.goto(withPreview('/lettre-quotidienne'));
      await expect(appShell(page)).toBeVisible();
      await radio(page, edition).check();
      await expect(page.locator('.rdp-newsletter-page')).toHaveAttribute('data-edition', edition);
      const body = await submitAndCapture(page);
      expect(body.getAll('edition')).toEqual([edition]);
      expect(body.get('email')).toBe('reader@example.org');
      expect(body.get('website')).toBe('');
    });
  }
});

test('/lettre-quotidienne-coop-medias opens on the Coop Médias letter', async ({ page }) => {
  await page.goto(withPreview('/lettre-quotidienne-coop-medias'));
  await expect(appShell(page)).toBeVisible();
  await expect(radio(page, 'coop-medias')).toBeChecked();
  const body = await submitAndCapture(page);
  expect(body.getAll('edition')).toEqual(['coop-medias']);
});

test('the invitation under the Google Play badge leads to the choice of letters', async ({ page }) => {
  await page.goto(withPreview('/'));
  await expect(appShell(page)).toBeVisible();
  await page.locator('.rdp-banner-about__newsletter-link').first().click();
  // In-site navigation keeps the preview in the address.
  await expect(page).toHaveURL(/\/lettre-quotidienne\?apercu=1$/);
  await expect(radio(page, 'both')).toBeChecked();
});
