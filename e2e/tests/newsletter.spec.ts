import { test, expect, type Page, type Request } from '@playwright/test';
import { appShell } from '../support/selectors';

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
  test('offers French media, Coop Médias or both, both checked', async ({ page }) => {
    await page.goto('/lettre-quotidienne');
    await expect(appShell(page)).toBeVisible();
    await expect(page.locator('.rdp-newsletter-page input[type="radio"][name="edition"]')).toHaveCount(3);
    await expect(radio(page, 'both')).toBeChecked();
    await expect(page.locator('.rdp-newsletter-page')).toContainText('Un seul e-mail de confirmation');
  });

  for (const edition of ['fr', 'coop-medias', 'both']) {
    test(`posts edition=${edition} when that letter is chosen`, async ({ page }) => {
      await page.goto('/lettre-quotidienne');
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
  await page.goto('/lettre-quotidienne-coop-medias');
  await expect(appShell(page)).toBeVisible();
  await expect(radio(page, 'coop-medias')).toBeChecked();
  const body = await submitAndCapture(page);
  expect(body.getAll('edition')).toEqual(['coop-medias']);
});

test('the invitation under the Google Play badge leads to the choice of letters', async ({ page }) => {
  await page.goto('/');
  await expect(appShell(page)).toBeVisible();
  await page.locator('.rdp-banner-about__newsletter-link').first().click();
  await expect(page).toHaveURL(/\/lettre-quotidienne$/);
  await expect(radio(page, 'both')).toBeChecked();
});
