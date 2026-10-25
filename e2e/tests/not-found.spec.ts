import { test, expect } from '@playwright/test';
import { appShell } from '../support/selectors';

// An address the site does not have keeps its 404 status but shows the
// site's own shell, never Nuxt's default error screen.
test('an unknown address answers 404 inside the site layout', async ({ page, request }) => {
  const response = await request.get('/apercu=1');
  expect(response.status()).toBe(404);
  // The server already renders the site's shell, not the default error screen.
  const html = await response.text();
  expect(html).toContain('Contenu introuvable — Revue de presse');
  expect(html).not.toContain('Go back home');

  await page.goto('/apercu=1');
  await expect(appShell(page)).toBeVisible();
  await expect(page.locator('body')).toContainText('Aucun contenu à cette adresse.');
  await expect(page.locator('body')).not.toContainText('Page Not Found');
  await expect(page).toHaveTitle(/Contenu introuvable/);
});
