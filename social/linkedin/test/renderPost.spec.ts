import { describe, expect, it } from 'vitest';
import { renderPost } from '../src/renderPost.ts';
import type { Highlight } from '../src/types.ts';

const SAMPLE: Highlight[] = Array.from({ length: 10 }, (_, i) => ({
  screenName: `Outlet${i + 1}`,
  publicationId: `pub-${i + 1}`,
  url: `https://bsky.app/profile/outlet${i + 1}.bsky.social/post/abc${i + 1}`,
  text: '',
  date: '2026-05-20',
}));

describe('renderPost', () => {
  it('renders the canonical 10-line commentary for 2026-05-20', () => {
    const out = renderPost(SAMPLE, '2026-05-20');
    expect(out).toBe(
      'Top 10 des publications de presse les plus relayées sur Bluesky le 20 mai 2026 :\n' +
        '\n' +
        ' 1. Outlet1 — https://bsky.app/profile/outlet1.bsky.social/post/abc1\n' +
        ' 2. Outlet2 — https://bsky.app/profile/outlet2.bsky.social/post/abc2\n' +
        ' 3. Outlet3 — https://bsky.app/profile/outlet3.bsky.social/post/abc3\n' +
        ' 4. Outlet4 — https://bsky.app/profile/outlet4.bsky.social/post/abc4\n' +
        ' 5. Outlet5 — https://bsky.app/profile/outlet5.bsky.social/post/abc5\n' +
        ' 6. Outlet6 — https://bsky.app/profile/outlet6.bsky.social/post/abc6\n' +
        ' 7. Outlet7 — https://bsky.app/profile/outlet7.bsky.social/post/abc7\n' +
        ' 8. Outlet8 — https://bsky.app/profile/outlet8.bsky.social/post/abc8\n' +
        ' 9. Outlet9 — https://bsky.app/profile/outlet9.bsky.social/post/abc9\n' +
        '10. Outlet10 — https://bsky.app/profile/outlet10.bsky.social/post/abc10\n' +
        '\n' +
        'Retrouvez la revue de presse complète : https://play.google.com/store/apps/details?id=org.revue_2_presse\n' +
        '\n' +
        '#RevueDePresse',
    );
  });

  it('renders fewer than 10 items without padding', () => {
    const three = SAMPLE.slice(0, 3);
    const out = renderPost(three, '2026-05-20');
    expect(out).toContain(' 1. Outlet1');
    expect(out).toContain(' 3. Outlet3');
    expect(out).not.toContain(' 4.');
  });

  it('throws on empty highlights', () => {
    expect(() => renderPost([], '2026-05-20')).toThrow(/no highlights/i);
  });

  it('mentions the Play Store URL exactly once', () => {
    const out = renderPost(SAMPLE, '2026-05-20');
    const matches = out.match(/play\.google\.com/g) ?? [];
    expect(matches).toHaveLength(1);
  });

  it('mentions the #RevueDePresse hashtag exactly once', () => {
    const out = renderPost(SAMPLE, '2026-05-20');
    const matches = out.match(/#RevueDePresse/g) ?? [];
    expect(matches).toHaveLength(1);
  });
});
