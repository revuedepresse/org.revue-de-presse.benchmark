import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PUBLISHER_LISTS } from './publisher-lists';

const read = (path: string) =>
  JSON.parse(readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8'));

const webManifest = read('../public/manifest.webmanifest');
const twaManifest = read('../twa-manifest.json');

const ORIGIN = 'https://revue-de-presse.org';
const listUrl = (id: string) => (id === 'fr' ? '/' : `/?liste=${id}`);

describe('launcher shortcuts', () => {
  it('open each publisher list from the installed web app', () => {
    expect(webManifest.shortcuts.map((s: { url: string }) => s.url)).toEqual(
      PUBLISHER_LISTS.map((l) => listUrl(l.id)),
    );
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
  it('moves to 24 for the release adding the shortcuts', () => {
    expect(twaManifest.appVersionCode).toBe(24);
    expect(twaManifest.appVersionName).toBe('24');
    expect(twaManifest.appVersion).toBe('24');
  });
});
