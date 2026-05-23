import { describe, it, expect } from 'vitest';
import {
  mapStatusToFeedItem,
  shrinkBlueskyAvatar,
  linkifyForFeed,
  type RawStatus,
} from './feed';

describe('mapStatusToFeedItem', () => {
  it('maps every legacy field one-to-one', () => {
    const raw: RawStatus = {
      screen_name: 'franceculture.fr',
      publication_id: 'at://did:plc:abc/post/123',
      url: 'https://bsky.app/profile/franceculture.fr/post/123',
      avatar_url: 'https://cdn.bsky.app/avatar.jpg',
      text: 'Lorem ipsum.',
      date: '2026-05-07T08:00:00Z',
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.title).toBe('franceculture.fr');
    expect(item.id).toBe('at://did:plc:abc/post/123');
    expect(item.link).toBe('https://bsky.app/profile/franceculture.fr/post/123');
    // description carries the post text (RSS 2.0 plain-text fallback).
    expect(item.description).toBe('Lorem ipsum.');
    // content carries the same text linkified for <content:encoded>.
    expect(item.content).toBe('Lorem ipsum.');
    // avatar URL becomes an <enclosure> via the `image` field.
    expect(item.image).toBe('https://cdn.bsky.app/avatar.jpg');
    expect(item.date).toBeInstanceOf(Date);
    expect(item.date.toISOString().startsWith('2026-05-07')).toBe(true);
  });

  it('flattens nested .status (upstream shape)', () => {
    const raw: RawStatus = {
      status: {
        screen_name: 'lemonde.fr',
        publication_id: 'pub-2',
        url: 'https://bsky.app/lemonde/2',
        avatar_url: 'https://cdn.example/lemonde.jpg',
        text: 'Body.',
        date: '2026-05-07T09:00:00',
      },
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.title).toBe('lemonde.fr');
    expect(item.id).toBe('pub-2');
    expect(item.description).toBe('Body.');
  });

  it('falls back to url when publication_id is missing', () => {
    const raw: RawStatus = {
      screen_name: 'x.fr',
      url: 'https://bsky.app/x/3',
      text: 'No id.',
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.id).toBe('https://bsky.app/x/3');
  });

  it('returns the current date when upstream date is missing', () => {
    const raw: RawStatus = {
      screen_name: 'x.fr',
      publication_id: 'pub-4',
      url: 'https://bsky.app/x/4',
      text: 'No date.',
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.date).toBeInstanceOf(Date);
    // Should be approximately now — within the last 5 seconds.
    expect(Date.now() - item.date.getTime()).toBeLessThan(5000);
  });

  it('flattens line feeds in description into single spaces', () => {
    const raw: RawStatus = {
      screen_name: 'x.fr',
      publication_id: 'pub-5',
      url: 'https://bsky.app/x/5',
      text: 'first line\nsecond line\r\nthird line',
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.description).not.toMatch(/[\r\n]/);
    expect(item.description).toBe('first line second line third line');
  });

  it('strips upstream encoding artefacts via the cleanText pipeline', () => {
    const raw: RawStatus = {
      screen_name: 'x.fr',
      publication_id: 'pub-6',
      url: 'https://bsky.app/x/6',
      // - leading/trailing literal `"` (step 1)
      // - literal `\n` (step 2 → \n, then flattened to space)
      // - escaped `\'` (step 3)
      // - hex escape `\xa0` (step 4 → space)
      // - stray backslash (step 8)
      text: '"L\\\'Espagne\\xa0\\fait \\nune annonce\\"',
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.description).not.toContain('\\');
    expect(item.description).not.toContain('"L\'');
    expect(item.description).toContain("L'Espagne");
    expect(item.description).toContain('fait');
    expect(item.description).toContain('une annonce');
  });

  it('preserves UTF-8 (accents, emoji) — RSS is UTF-8', () => {
    const raw: RawStatus = {
      screen_name: 'x.fr',
      publication_id: 'pub-7',
      url: 'https://bsky.app/x/7',
      text: 'café — 1er mai 🌷',
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.description).toContain('café');
    expect(item.description).toContain('1er mai');
    expect(item.description).toContain('🌷');
  });

  it('applies cleanup to title and image (avatar enclosure URL), not just description', () => {
    const raw: RawStatus = {
      screen_name: '  weird\nhandle  ',
      publication_id: 'pub-8',
      url: 'https://bsky.app/x/8',
      avatar_url: 'https://cdn/avatar.jpg\n',
      text: 'body',
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.title).toBe('weird handle');
    expect(item.image).toBe('https://cdn/avatar.jpg');
  });

  it('rewrites Bluesky CDN avatar URLs to the thumbnail variant', () => {
    const raw: RawStatus = {
      screen_name: 'x.fr',
      publication_id: 'pub-9',
      url: 'https://bsky.app/x/9',
      avatar_url:
        'https://cdn.bsky.app/img/avatar/plain/did:plc:abc/bafyreigh@jpeg',
      text: 'body',
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.image).toBe(
      'https://cdn.bsky.app/img/avatar_thumbnail/plain/did:plc:abc/bafyreigh@jpeg',
    );
  });
});

describe('shrinkBlueskyAvatar', () => {
  it('rewrites the avatar path to avatar_thumbnail on the Bluesky CDN', () => {
    expect(
      shrinkBlueskyAvatar(
        'https://cdn.bsky.app/img/avatar/plain/did:plc:abc/cid@jpeg',
      ),
    ).toBe('https://cdn.bsky.app/img/avatar_thumbnail/plain/did:plc:abc/cid@jpeg');
  });

  it('leaves non-Bluesky URLs unchanged', () => {
    expect(shrinkBlueskyAvatar('https://example.com/img/avatar/foo.jpg')).toBe(
      'https://example.com/img/avatar/foo.jpg',
    );
  });

  it('leaves already-thumbnail URLs unchanged (idempotent)', () => {
    const thumb =
      'https://cdn.bsky.app/img/avatar_thumbnail/plain/did:plc:abc/cid@jpeg';
    expect(shrinkBlueskyAvatar(thumb)).toBe(thumb);
  });

  it('leaves the empty string unchanged', () => {
    expect(shrinkBlueskyAvatar('')).toBe('');
  });
});

describe('linkifyForFeed', () => {
  it('returns plain text unchanged when no URLs or handles are present', () => {
    expect(linkifyForFeed('hello world')).toBe('hello world');
  });

  it('wraps bare https URLs in an anchor', () => {
    expect(linkifyForFeed('see https://example.org for more')).toBe(
      'see <a href="https://example.org">https://example.org</a> for more',
    );
  });

  it('wraps bare http URLs in an anchor', () => {
    expect(linkifyForFeed('http://example.org')).toBe(
      '<a href="http://example.org">http://example.org</a>',
    );
  });

  it('strips trailing sentence punctuation from the anchor target', () => {
    expect(linkifyForFeed('voir https://example.org.')).toBe(
      'voir <a href="https://example.org">https://example.org</a>.',
    );
  });

  it('wraps Bluesky handles in an anchor to bsky.app/profile', () => {
    expect(linkifyForFeed('via @franceculture.fr')).toBe(
      'via <a href="https://bsky.app/profile/franceculture.fr">@franceculture.fr</a>',
    );
  });

  it('handles multi-segment handles like @user.bsky.social', () => {
    expect(linkifyForFeed('@user.bsky.social hi')).toBe(
      '<a href="https://bsky.app/profile/user.bsky.social">@user.bsky.social</a> hi',
    );
  });

  it('linkifies both URLs and handles in the same string', () => {
    expect(linkifyForFeed('@lemonde.fr a publié https://lemonde.fr/article')).toBe(
      '<a href="https://bsky.app/profile/lemonde.fr">@lemonde.fr</a>' +
        ' a publié <a href="https://lemonde.fr/article">https://lemonde.fr/article</a>',
    );
  });

  it('HTML-escapes plain text segments', () => {
    expect(linkifyForFeed('a < b & "ok"')).toBe(
      'a &lt; b &amp; &quot;ok&quot;',
    );
  });

  it('preserves UTF-8 (accents, emoji) in plain segments', () => {
    expect(linkifyForFeed('café 🌷 @x.fr')).toBe(
      'café 🌷 <a href="https://bsky.app/profile/x.fr">@x.fr</a>',
    );
  });

  it('escapes ampersands in URL query strings', () => {
    expect(linkifyForFeed('https://example.org/p?a=1&b=2')).toBe(
      '<a href="https://example.org/p?a=1&amp;b=2">https://example.org/p?a=1&amp;b=2</a>',
    );
  });

  it('returns the empty string for empty input', () => {
    expect(linkifyForFeed('')).toBe('');
  });
});
