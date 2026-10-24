import { describe, expect, it } from 'vitest';
import { sourcesOf } from '../../src/utils/sources';

describe('sources of each publisher list', () => {
  it('lists the French media by default', () => {
    const fr = sourcesOf(undefined);
    expect(fr.list).toBe('fr');
    expect(fr.roster.map((r) => r.handle)).toContain('lemonde.fr');
    expect(fr.roster).toHaveLength(26);
  });

  it('lists the Coop Médias members for coop-medias', () => {
    const coop = sourcesOf('coop-medias');
    expect(coop.list).toBe('coop-medias');
    expect(coop.roster).toHaveLength(48);
    expect(coop.roster.map((r) => r.handle)).toEqual(expect.arrayContaining(['reporterre.net', 'bonpote.com', 'blast-info.fr']));
    expect(coop.roster.map((r) => r.handle)).not.toContain('lemonde.fr');
  });

  it('falls back to French media for an unknown list', () => {
    expect(sourcesOf('unknown').list).toBe('fr');
  });

  it('sorts each roster by name, in French', () => {
    for (const list of ['fr', 'coop-medias']) {
      const names = sourcesOf(list).roster.map((r) => r.displayName);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' })));
    }
  });

  it('gives every source a Bluesky avatar and a curated name', () => {
    for (const list of ['fr', 'coop-medias']) {
      for (const row of sourcesOf(list).roster) {
        expect(row.avatar).toMatch(/^https:\/\/cdn\.bsky\.app\/img\/avatar\//);
        expect(row.displayName).not.toMatch(/\.bsky\.social$/);
      }
    }
  });

  it('describes where each roster comes from', () => {
    expect(sourcesOf('fr').origin).toBe('de médias Français');
    expect(sourcesOf('coop-medias').origin).toBe('de');
    expect(sourcesOf('coop-medias').originLink).toEqual({
      href: 'https://www.coop-medias.org/',
      label: 'https://www.coop-medias.org/',
    });
    expect(sourcesOf('fr').originLink).toBeUndefined();
  });
});
