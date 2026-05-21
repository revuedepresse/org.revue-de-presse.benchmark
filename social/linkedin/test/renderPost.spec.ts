import { describe, expect, it } from 'vitest';
import { renderPost } from '../src/renderPost.ts';
import type { Highlight } from '../src/types.ts';

const SAMPLE: Highlight[] = Array.from({ length: 10 }, (_, i) => ({
  screenName: `Outlet${i + 1}`,
  publicationId: `pub-${i + 1}`,
  url: `https://bsky.app/profile/outlet${i + 1}.bsky.social/post/abc${i + 1}`,
  text: `Headline ${i + 1}`,
  date: '2026-05-20',
}));

const OPTS = {
  footerUrl: 'https://play.google.com/store/apps/details?id=org.revue_2_presse',
  hashtag: '#RevueDePresse',
};

describe('renderPost', () => {
  it('renders the canonical commentary for 2026-05-20 with text before each link', () => {
    const out = renderPost(SAMPLE, '2026-05-20', OPTS);
    const entry = (i: number) =>
      `${String(i).padStart(2, ' ')}. Outlet${i}\n` +
      `    Headline ${i}\n` +
      `    https://bsky.app/profile/outlet${i}.bsky.social/post/abc${i}`;
    expect(out).toBe(
      'Top 10 des publications de presse les plus relayées sur Bluesky le 20 mai 2026 :\n' +
        '\n' +
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(entry).join('\n\n') +
        '\n' +
        '\n' +
        'Retrouvez la revue de presse complète : https://play.google.com/store/apps/details?id=org.revue_2_presse\n' +
        '\n' +
        '#RevueDePresse',
    );
  });

  it('omits the text line when text is empty', () => {
    const noText: Highlight[] = [
      { screenName: 'OutletA', publicationId: 'a', url: 'https://bsky.app/post/a', text: '', date: '2026-05-20' },
    ];
    const out = renderPost(noText, '2026-05-20', OPTS);
    expect(out).toContain(' 1. OutletA\n    https://bsky.app/post/a');
    expect(out).not.toContain('\n    \n');
  });

  it('collapses internal whitespace in the text line', () => {
    const messy: Highlight[] = [
      {
        screenName: 'OutletA',
        publicationId: 'a',
        url: 'https://bsky.app/post/a',
        text: '  line one\n\n  line two\t  with tabs  ',
        date: '2026-05-20',
      },
    ];
    const out = renderPost(messy, '2026-05-20', OPTS);
    expect(out).toContain(' 1. OutletA\n    line one line two with tabs\n    https://bsky.app/post/a');
  });

  it('renders fewer than 10 items without padding', () => {
    const three = SAMPLE.slice(0, 3);
    const out = renderPost(three, '2026-05-20', OPTS);
    expect(out).toContain(' 1. Outlet1');
    expect(out).toContain(' 3. Outlet3');
    expect(out).not.toContain(' 4.');
  });

  it('throws on empty highlights', () => {
    expect(() => renderPost([], '2026-05-20', OPTS)).toThrow(/no highlights/i);
  });

  it('mentions the footer URL exactly once when provided', () => {
    const out = renderPost(SAMPLE, '2026-05-20', OPTS);
    const matches = out.match(/play\.google\.com/g) ?? [];
    expect(matches).toHaveLength(1);
  });

  it('mentions the hashtag exactly once when provided', () => {
    const out = renderPost(SAMPLE, '2026-05-20', OPTS);
    const matches = out.match(/#RevueDePresse/g) ?? [];
    expect(matches).toHaveLength(1);
  });

  it('omits the footer line when footerUrl is empty', () => {
    const out = renderPost(SAMPLE, '2026-05-20', { hashtag: '#RevueDePresse' });
    expect(out).not.toContain('Retrouvez la revue de presse complète');
    expect(out).toContain('#RevueDePresse');
  });

  it('omits the hashtag line when hashtag is empty', () => {
    const out = renderPost(SAMPLE, '2026-05-20', { footerUrl: 'https://example.org' });
    expect(out).toContain('https://example.org');
    expect(out).not.toContain('#RevueDePresse');
  });

  it('renders only the header + entries when both opts are empty', () => {
    const out = renderPost(SAMPLE.slice(0, 1), '2026-05-20');
    expect(out).toBe(
      'Top 10 des publications de presse les plus relayées sur Bluesky le 20 mai 2026 :\n' +
        '\n' +
        ' 1. Outlet1\n' +
        '    Headline 1\n' +
        '    https://bsky.app/profile/outlet1.bsky.social/post/abc1',
    );
  });
});
