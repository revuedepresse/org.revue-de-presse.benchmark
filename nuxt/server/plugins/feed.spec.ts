import { describe, it, expect } from 'vitest';
import { mapStatusToFeedItem, type RawStatus } from './feed';

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
    // Legacy parity: description carries avatar_url, NOT the post text.
    expect(item.description).toBe('https://cdn.bsky.app/avatar.jpg');
    expect(item.content).toBe('Lorem ipsum.');
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
    expect(item.content).toBe('Body.');
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

  it('flattens line feeds in content into single spaces', () => {
    const raw: RawStatus = {
      screen_name: 'x.fr',
      publication_id: 'pub-5',
      url: 'https://bsky.app/x/5',
      text: 'first line\nsecond line\r\nthird line',
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.content).not.toMatch(/[\r\n]/);
    expect(item.content).toBe('first line second line third line');
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

    expect(item.content).not.toContain('\\');
    expect(item.content).not.toContain('"L\'');
    expect(item.content).toContain("L'Espagne");
    expect(item.content).toContain('fait');
    expect(item.content).toContain('une annonce');
  });

  it('preserves UTF-8 (accents, emoji) — RSS is UTF-8', () => {
    const raw: RawStatus = {
      screen_name: 'x.fr',
      publication_id: 'pub-7',
      url: 'https://bsky.app/x/7',
      text: 'café — 1er mai 🌷',
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.content).toContain('café');
    expect(item.content).toContain('1er mai');
    expect(item.content).toContain('🌷');
  });

  it('applies cleanup to title and description, not just content', () => {
    const raw: RawStatus = {
      screen_name: '  weird\nhandle  ',
      publication_id: 'pub-8',
      url: 'https://bsky.app/x/8',
      avatar_url: 'https://cdn/avatar.jpg\n',
      text: 'body',
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.title).toBe('weird handle');
    expect(item.description).toBe('https://cdn/avatar.jpg');
  });
});
