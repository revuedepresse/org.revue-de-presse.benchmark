import { test, expect } from '@playwright/test';
import { appShell } from '../support/selectors';

// Canonical roster mirrored from
//   design-system/src/components/SourcesPage.lite.tsx
// which is the source of truth for the visible list; this test guards against
// drift. If a handle, displayName, or external URL changes there, the failure
// here points the reader at the right file to update.
const ROSTER: { handle: string; displayName: string }[] = [
  { handle: 'afp.com',                     displayName: 'Agence France-Presse' },
  { handle: 'bfmtv.com',                   displayName: 'BFMTV' },
  { handle: 'blast-info.fr',               displayName: 'Blast le souffle de l’info' },
  { handle: 'challengesfr.bsky.social',    displayName: 'Challenges' },
  { handle: 'charliehebdo.fr',             displayName: 'Charlie Hebdo' },
  { handle: 'courrierinter.bsky.social',   displayName: 'Courrier international' },
  { handle: 'franceculture.fr',            displayName: 'France Culture' },
  { handle: 'france24.com',                displayName: 'FRANCE 24' },
  { handle: 'humanite.fr',                 displayName: "l'Humanité" },
  { handle: 'la-croix.com',                displayName: 'La Croix' },
  { handle: 'lavoixdunord.fr',             displayName: 'La Voix du Nord' },
  { handle: 'lefigaro.fr',                 displayName: 'Le Figaro' },
  { handle: 'lecanardenchaine.fr',         displayName: 'Le Canard enchaîné' },
  { handle: 'lemonde.fr',                  displayName: 'Le Monde' },
  { handle: 'afrique.lemonde.fr',          displayName: 'Le Monde Afrique' },
  { handle: 'lepoint.fr',                  displayName: 'Le Point' },
  { handle: 'lesechosfr.bsky.social',      displayName: 'Les Echos' },
  { handle: 'lesjours.fr',                 displayName: 'Les Jours' },
  { handle: 'liberation.fr',               displayName: 'Libération' },
  { handle: 'mediapart.fr',                displayName: 'Mediapart' },
  { handle: 'monde-diplomatique.fr',       displayName: 'Le Monde diplomatique' },
  { handle: 'nouvelobs.com',               displayName: 'Le Nouvel Obs' },
  { handle: 'ouest-france.fr',             displayName: 'Ouest-France' },
  { handle: 'pixelsfr.bsky.social',        displayName: 'Pixels | Le Monde' },
  { handle: 'rfi.fr',                      displayName: 'RFI' },
  { handle: 'telerama.bsky.social',        displayName: 'Télérama' },
];

const ROSTER_BY_DISPLAY_NAME = [...ROSTER].sort((a, b) =>
  a.displayName.localeCompare(b.displayName, 'fr', { sensitivity: 'base' }),
);

test.describe('/sources', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sources');
    await expect(appShell(page)).toBeVisible();
    // SourcesPage list renders client-side after AppShell mounts; wait for the
    // first row so reads like .allTextContents() never race the hydration.
    await page.locator('.rdp-sources-page__row').first().waitFor();
  });

  test('renders the article shell with title + intro + footnote', async ({ page }) => {
    const article = page.locator('.rdp-sources-page');
    await expect(article).toBeVisible();
    await expect(article.locator('h1')).toHaveText('Sources des brèves');
    await expect(article.locator('p').first()).toContainText(
      'Les sources des brèves de publications',
    );
    await expect(article.locator('p').first()).toContainText(
      'proviennent des comptes Bluesky de médias Français',
    );
    await expect(article.locator('#rdp-sources-page-footnote')).toContainText(
      'La popularité est déduite des partages des publications depuis Bluesky.',
    );
  });

  test('lists exactly the 26 canonical media accounts', async ({ page }) => {
    const rows = page.locator('.rdp-sources-page__row');
    await expect(rows).toHaveCount(ROSTER.length);
  });

  test('each row carries an avatar, a display name, and the @handle', async ({ page }) => {
    for (const { handle, displayName } of ROSTER) {
      const row = page.locator(
        `.rdp-sources-page__row[href="https://bsky.app/profile/${handle}"]`,
      );
      await expect(row, `row for ${handle} present`).toBeVisible();
      await expect(row.locator('.rdp-sources-page__name')).toHaveText(displayName);
      await expect(row.locator('.rdp-sources-page__handle')).toHaveText(`@${handle}`);
      const avatar = row.locator('img.rdp-sources-page__avatar');
      await expect(avatar).toBeVisible();
      await expect(avatar).toHaveAttribute('width', '48');
      await expect(avatar).toHaveAttribute('height', '48');
      const src = await avatar.getAttribute('src');
      expect(src ?? '').toMatch(/^https:\/\/cdn\.bsky\.app\/img\/avatar\/plain\/did:plc:/);
    }
  });

  test('rows are sorted alphabetically (French collation, case-insensitive)', async ({ page }) => {
    const rendered = await page
      .locator('.rdp-sources-page__name')
      .allTextContents();
    const expected = ROSTER_BY_DISPLAY_NAME.map((r) => r.displayName);
    expect(rendered).toEqual(expected);
  });

  test('each row opens the matching Bluesky profile in a new tab', async ({ page }) => {
    const rows = page.locator('.rdp-sources-page__row');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      await expect(row).toHaveAttribute('target', '_blank');
      const rel = (await row.getAttribute('rel')) ?? '';
      // noopener + noreferrer are required for safe target=_blank navigation.
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
      const href = (await row.getAttribute('href')) ?? '';
      expect(href).toMatch(/^https:\/\/bsky\.app\/profile\/[A-Za-z0-9.-]+$/);
    }
  });

  test('"triées par popularité" anchor jumps to the footnote', async ({ page }) => {
    const anchor = page.locator('.rdp-sources-page__internal-link');
    await expect(anchor).toHaveAttribute('href', '#rdp-sources-page-footnote');
    await expect(anchor).toHaveText('triées par popularité');
  });
});
