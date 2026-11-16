import { test, expect, type APIResponse } from '@playwright/test';

// One RSS feed per publisher list (nuxt/utils/feeds.ts). The mock upstream
// prefixes the text of a post with `[liste <id>]` whenever the request named a
// list, so the body of a feed says which list the server asked the API for —
// the only place that choice is visible from outside.
const FEEDS = [
  { path: '/feed.xml', title: 'Revue de presse', tag: null },
  { path: '/feed-coop-medias.xml', title: 'Revue de presse — Coop-médias', tag: '[liste coop-medias]' },
  {
    path: '/feed-fr-coop-medias.xml',
    title: 'Revue de presse — Médias français + Coop-médias',
    tag: '[liste fr-coop-medias]',
  },
] as const;

const channelTitle = (xml: string): string | undefined =>
  xml.split('<item>')[0].match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1];

const okFeed = async (res: APIResponse): Promise<string> => {
  expect(res.status()).toBe(200);
  // Without the charset some readers fall back to Latin-1 and mojibake every accent.
  expect(res.headers()['content-type']).toBe('application/rss+xml; charset=utf-8');
  return res.text();
};

for (const feed of FEEDS) {
  test(`${feed.path} is an RSS feed of the day's top 10`, async ({ request }) => {
    const xml = await okFeed(await request.get(feed.path));

    expect(channelTitle(xml)).toBe(feed.title);
    expect(xml.split('<item>').length - 1).toBeGreaterThan(0);
    // The accents survive the round trip, so the charset is doing its work.
    expect(xml).toContain('Retrouver chaque jour');
  });
}

test('the pages advertise every feed, so a reader handed the address finds them', async ({ request }) => {
  const html = await (await request.get('/')).text();

  for (const feed of FEEDS) {
    expect(html).toContain(`href="${feed.path}"`);
    expect(html).toMatch(
      new RegExp(`<link rel="alternate" type="application/rss\\+xml"[^>]*href="${feed.path}"`),
    );
  }
});

test('each feed carries the posts of its own list', async ({ request }) => {
  const bodies = new Map<string, string>();
  for (const feed of FEEDS) {
    bodies.set(feed.path, await okFeed(await request.get(feed.path)));
  }

  for (const feed of FEEDS) {
    const xml = bodies.get(feed.path)!;
    if (feed.tag === null) {
      // The API ranks the French media without being asked: that feed names no list.
      expect(xml).not.toContain('[liste ');
    } else {
      expect(xml).toContain(feed.tag);
    }
  }
});
