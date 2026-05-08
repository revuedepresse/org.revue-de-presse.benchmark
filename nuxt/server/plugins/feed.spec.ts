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
      date: '2026-05-07T08:00:00',
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.title).toBe('franceculture.fr');
    expect(item.id).toBe('at://did:plc:abc/post/123');
    expect(item.link).toBe('https://bsky.app/profile/franceculture.fr/post/123');
    // Legacy parity: description carries avatar_url, NOT the post text.
    expect(item.description).toBe('https://cdn.bsky.app/avatar.jpg');
    expect(item.content).toBe('Lorem ipsum.');
    expect(item.date).toBeInstanceOf(Date);
    expect(item.date?.toISOString().startsWith('2026-05-07')).toBe(true);
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

  it('returns date=undefined when upstream date is missing', () => {
    const raw: RawStatus = {
      screen_name: 'x.fr',
      publication_id: 'pub-4',
      url: 'https://bsky.app/x/4',
      text: 'No date.',
    };

    const item = mapStatusToFeedItem(raw);

    expect(item.date).toBeUndefined();
  });
});
