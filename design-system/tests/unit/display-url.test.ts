import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { URL_DISPLAY_MAX, displayUrl } from '../../src/utils/display-url';

describe('displayUrl', () => {
  it('shows a short address whole, without scheme or www', () => {
    expect(displayUrl('https://www.vert.eco/articles/le-sujet')).toBe('vert.eco/articles/le-sujet');
    expect(displayUrl('http://reporterre.net/Le-carburant')).toBe('reporterre.net/Le-carburant');
  });

  it('drops a trailing slash rather than spending a character on it', () => {
    expect(displayUrl('https://www.coop-medias.org/')).toBe('coop-medias.org');
  });

  // The address of an article carries its whole title: this one is 151
  // characters, three times what a card column can hold.
  it('cuts a permalink at the card width and marks the cut', () => {
    const shown = displayUrl(
      'https://www.humanite.fr/medias/algerie/jean-michel-aphatie-mis-en-retrait-de-rtl-apres-avoir-dit-la-verite-historique-sur-la-colonisation-de-lalgerie',
    );

    expect(shown).toBe('humanite.fr/medias/algerie/jean-michel-aphatie-…');
    expect(shown.length).toBe(URL_DISPLAY_MAX);
    expect(shown.endsWith('…')).toBe(true);
  });

  it('leaves an address exactly at the limit alone', () => {
    const exact = `example.org/${'a'.repeat(URL_DISPLAY_MAX - 'example.org/'.length)}`;
    expect(exact.length).toBe(URL_DISPLAY_MAX);
    expect(displayUrl(`https://${exact}`)).toBe(exact);
    expect(displayUrl(`https://${exact}`).endsWith('…')).toBe(false);
  });

  it('is what the card renders, in both targets', () => {
    const lite = readFileSync(
      fileURLToPath(new URL('../../src/components/BlueskyPostCard.lite.tsx', import.meta.url)),
      'utf8',
    );
    const vue = readFileSync(
      fileURLToPath(new URL('../../output/vue/src/components/BlueskyPostCard.vue', import.meta.url)),
      'utf8',
    );

    for (const source of [lite, vue]) {
      expect(source).toContain('displayUrl(trimmed)');
      // The link still points at the address itself, not at the shown form.
      expect(source).toContain('href: trimmed');
    }

    // The emitted Vue carries no styles of its own: the card's rules ship in
    // the stylesheet the site loads, which is where the guard has to be.
    const css = readFileSync(
      fileURLToPath(new URL('../../output/components.css', import.meta.url)),
      'utf8',
    );
    expect(css).toMatch(/rdp-bsky-post__body \{[^}]*overflow-wrap:\s*anywhere/);
    expect(lite).toMatch(/overflow-wrap:\s*anywhere/);
  });
});
