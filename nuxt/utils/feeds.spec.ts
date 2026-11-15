import { describe, it, expect } from 'vitest';
import { FEED_ORIGIN, FEED_SOURCES, feedLink, feedSourceByPath } from './feeds';
import { PUBLISHER_LISTS } from './publisher-lists';

describe('FEED_SOURCES', () => {
  it('publishes one feed per publisher list, in the order the site offers them', () => {
    expect(FEED_SOURCES.map((source) => source.list)).toEqual(
      PUBLISHER_LISTS.map((list) => list.id),
    );
  });

  it('gives each feed its own path', () => {
    const paths = FEED_SOURCES.map((source) => source.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of paths) {
      expect(path).toMatch(/^\/[a-z0-9-]+\.xml$/);
    }
  });

  // A feed reader shows the channel title and description as the name of the
  // subscription, and /feed.xml has been subscribed to under these for years.
  it('leaves the French media feed exactly where and what it was', () => {
    const [fr] = FEED_SOURCES;
    expect(fr.path).toBe('/feed.xml');
    expect(fr.list).toBe('fr');
    expect(fr.title).toBe('Revue de presse');
    expect(fr.description).toBe(
      'Retrouver chaque jour les 10 publications médias ayant été les plus relayés la veille.',
    );
  });

  it('names its list in every other feed, title and description alike', () => {
    for (const source of FEED_SOURCES.slice(1)) {
      const label = PUBLISHER_LISTS.find((list) => list.id === source.list)!.label;
      expect(source.title).toBe(`Revue de presse — ${label}`);
      expect(source.description.length).toBeGreaterThan(0);
      expect(source.description).not.toBe(FEED_SOURCES[0].description);
    }
  });
});

describe('feedLink', () => {
  it('points the French media feed at the home page, and each other at its list', () => {
    expect(feedLink(FEED_SOURCES[0])).toBe(FEED_ORIGIN);
    expect(feedLink(FEED_SOURCES[1])).toBe(`${FEED_ORIGIN}/?liste=coop-medias`);
    expect(feedLink(FEED_SOURCES[2])).toBe(`${FEED_ORIGIN}/?liste=fr-coop-medias`);
  });
});

describe('feedSourceByPath', () => {
  it('finds the feed a request is for', () => {
    expect(feedSourceByPath('/feed-coop-medias.xml')?.list).toBe('coop-medias');
  });

  it('answers nothing for a path that is not a feed, so the plugin stays out of it', () => {
    expect(feedSourceByPath('/sitemap.xml')).toBeUndefined();
    expect(feedSourceByPath(undefined)).toBeUndefined();
  });
});
