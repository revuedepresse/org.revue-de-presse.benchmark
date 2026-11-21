import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  JSON.parse(readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8'));

const webManifest = read('../public/manifest.webmanifest');
const twaManifest = read('../twa-manifest.json');

const ORIGIN = 'https://revue-de-presse.org';
describe('launcher shortcuts', () => {
  // The launcher offers the French media top 10 alone; a shortcut per list
  // would need its own label and icon, so the lists are picked in the app.
  it('open the French media top 10 from the installed web app, and name no list', () => {
    expect(webManifest.shortcuts.map((s: { url: string }) => s.url)).toEqual(['/']);
    expect(JSON.stringify(webManifest)).not.toContain('liste=');
    expect(JSON.stringify(twaManifest)).not.toContain('liste=');
    for (const shortcut of webManifest.shortcuts) {
      // Android launcher limits: long label up to 25 characters, short label up to 10.
      expect(shortcut.name.length).toBeLessThanOrEqual(25);
      expect(shortcut.short_name.length).toBeLessThanOrEqual(10);
      expect(shortcut.icons[0]).toMatchObject({ sizes: '96x96', type: 'image/png' });
    }
  });

  it('are the same in the Android app as in the web manifest', () => {
    expect(
      twaManifest.shortcuts.map((s: { name: string; shortName: string; url: string; chosenIconUrl: string }) => ({
        name: s.name,
        short_name: s.shortName,
        url: s.url,
        icon: s.chosenIconUrl,
      })),
    ).toEqual(
      webManifest.shortcuts.map((s: { name: string; short_name: string; url: string; icons: { src: string }[] }) => ({
        name: s.name,
        short_name: s.short_name,
        url: ORIGIN + s.url,
        icon: ORIGIN + s.icons[0].src,
      })),
    );
  });
});

describe('Android app version', () => {
  it('moves to 27, the version of the bundle built for Play', () => {
    expect(twaManifest.appVersionCode).toBe(27);
    expect(twaManifest.appVersionName).toBe('27');
    expect(twaManifest.appVersion).toBe('27');
  });

  // Play's automatic protection (the integrity check it adds to the uploaded
  // bundle) refuses anything below 24, so the floor is Android 7.0 Nougat.
  it('keeps the minimum SDK at the floor Play automatic protection requires', () => {
    expect(twaManifest.minSdkVersion).toBeGreaterThanOrEqual(24);
  });
});
