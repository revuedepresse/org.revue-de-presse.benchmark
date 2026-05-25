import { describe, expect, it } from 'vitest';
import { renderPost } from '../src/renderPost.ts';
import { escapeLittleText } from '../src/littleText.ts';
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

  // Production incident 2026-05-25 05:30 Paris (post for 2026-05-24): the
  // commentary contained the unescaped parenthetical "(J'ai du mal à trouver
  // ...)". LinkedIn's LITTLE_TEXT parser sees `(...)` as the URN slot of a
  // MentionElement (`@FallbackText?(Urn)`); when the Urn fails to parse, the
  // post is created but only entry #1 renders. Per LinkedIn's LITTLE_TEXT
  // spec, all reserved characters (|){}@[]()<>#*_~\) must be backslash-escaped
  // when not used in a supported element/template.
  // https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/little-text-format
  describe('LITTLE_TEXT escaping', () => {
    const single = (text: string): Highlight[] => [
      { screenName: 'liberation.fr', publicationId: 'p', url: 'https://bsky.app/post/x', text, date: '2026-05-24' },
    ];

    it('escapes parentheses in the highlight text', () => {
      const out = renderPost(single('Lamia Ziadé (J’ai du mal à trouver le nombre exact)'), '2026-05-24', { ...OPTS, escapeText: (s) => escapeLittleText(s) });
      expect(out).toContain('Lamia Ziadé \\(J’ai du mal à trouver le nombre exact\\)');
      expect(out).not.toContain(' (J’ai du mal');
    });

    it('escapes angle brackets, braces, pipes, square brackets in the highlight text', () => {
      const out = renderPost(single('a<b>{c}|d[e]f'), '2026-05-24', { ...OPTS, escapeText: (s) => escapeLittleText(s) });
      expect(out).toContain('a\\<b\\>\\{c\\}\\|d\\[e\\]f');
    });

    it('escapes @ and bare * _ ~ in the highlight text', () => {
      const out = renderPost(single('Par @mathiasthepot.bsky.social *bold* _italic_ ~strike~'), '2026-05-24', { ...OPTS, escapeText: (s) => escapeLittleText(s) });
      expect(out).toContain(
        'Par \\@mathiasthepot.bsky.social \\*bold\\* \\_italic\\_ \\~strike\\~',
      );
    });

    it('does not escape the auto-detected #hashtag in the footer line', () => {
      const out = renderPost(SAMPLE.slice(0, 1), '2026-05-20', {
        ...OPTS,
        escapeText: escapeLittleText,
      });
      // The footer hashtag must remain literal so LinkedIn renders it as a
      // clickable HashtagElement.
      expect(out).toMatch(/\n#RevueDePresse$/);
      expect(out).not.toContain('\\#RevueDePresse');
    });

    it('does not escape characters inside URLs', () => {
      // Footer URL has underscores (https://play.google.com/.../id=org.revue_2_presse).
      // LinkedIn auto-detects URLs and re-shortens them — escaping inside the URL
      // would corrupt it.
      const out = renderPost(SAMPLE.slice(0, 1), '2026-05-20', {
        ...OPTS,
        escapeText: escapeLittleText,
      });
      expect(out).toContain('https://play.google.com/store/apps/details?id=org.revue_2_presse');
      expect(out).not.toContain('revue\\_2\\_presse');
    });

  });
});
