import { describe, expect, it } from 'vitest';
import { sourcesOf } from '../../src/utils/sources';

describe('sources of each publisher list', () => {
  it('lists the French media by default', () => {
    const fr = sourcesOf(undefined);
    expect(fr.list).toBe('fr');
    expect(fr.roster.map((r) => r.handle)).toContain('lemonde.fr');
    expect(fr.roster).toHaveLength(35);
  });

  it('lists the Coop Médias members the French media list ranks too', () => {
    const fr = sourcesOf('fr').roster.map((r) => r.handle);
    expect(fr).toEqual(expect.arrayContaining(['reporterre.net', 'arretsurimages.net', 'vert.eco', 'rue89strasbourg.com']));
    expect(fr).not.toContain('bonpote.com');
    expect(new Set(fr).size).toBe(fr.length);
  });

  it('lists the Coop Médias members for coop-medias', () => {
    const coop = sourcesOf('coop-medias');
    expect(coop.list).toBe('coop-medias');
    expect(coop.roster).toHaveLength(48);
    expect(coop.roster.map((r) => r.handle)).toEqual(expect.arrayContaining(['reporterre.net', 'bonpote.com', 'blast-info.fr']));
    expect(coop.roster.map((r) => r.handle)).not.toContain('lemonde.fr');
  });

  it('lists the members of both lists for fr-coop-medias, each account once', () => {
    const both = sourcesOf('fr-coop-medias');
    expect(both.list).toBe('fr-coop-medias');
    const handles = both.roster.map((r) => r.handle);
    expect(handles).toEqual(expect.arrayContaining(['lemonde.fr', 'reporterre.net', 'blast-info.fr', 'lesjours.fr']));
    expect(new Set(handles).size).toBe(handles.length);
    const fr = sourcesOf('fr').roster.map((r) => r.handle);
    const coop = sourcesOf('coop-medias').roster.map((r) => r.handle);
    expect(handles).toHaveLength(new Set([...fr, ...coop]).size);
    expect(both.origin).toBe('de médias français et de');
    expect(both.originLink?.href).toBe('https://www.coop-medias.org/');
  });

  it('falls back to French media for an unknown list', () => {
    expect(sourcesOf('unknown').list).toBe('fr');
  });

  it('sorts each roster by name, in French', () => {
    for (const list of ['fr', 'coop-medias', 'fr-coop-medias']) {
      const names = sourcesOf(list).roster.map((r) => r.displayName);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' })));
    }
  });

  it('gives every source a Bluesky avatar and a curated name', () => {
    for (const list of ['fr', 'coop-medias', 'fr-coop-medias']) {
      for (const row of sourcesOf(list).roster) {
        expect(row.avatar).toMatch(/^https:\/\/cdn\.bsky\.app\/img\/avatar\//);
        expect(row.displayName).not.toMatch(/\.bsky\.social$/);
      }
    }
  });

  it('describes where each roster comes from', () => {
    expect(sourcesOf('fr').origin).toBe('de médias français');
    expect(sourcesOf('coop-medias').origin).toBe('de');
    expect(sourcesOf('coop-medias').originLink).toEqual({
      href: 'https://www.coop-medias.org/',
      label: 'https://www.coop-medias.org/',
    });
    expect(sourcesOf('fr').originLink).toBeUndefined();
  });
});
