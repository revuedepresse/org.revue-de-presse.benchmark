import { describe, expect, it } from 'vitest';
import { renderThread, graphemeLength, truncateGraphemes } from '../src/renderThread.ts';
import type { Highlight } from '../src/types.ts';

const H = (i: number, screen = `outlet${i}.bsky.social`, text = `Headline ${i}`): Highlight => ({
  screenName: screen,
  publicationId: `pub-${i}`,
  url: `https://example.org/article/${i}`,
  text,
  date: '2026-05-22',
});

const SAMPLE = [H(1), H(2), H(3)];
const OPTS = { footerUrl: 'https://play.google.com/store/apps/details?id=org.revue_2_presse', hashtag: '#RevueDePresse' };

describe('renderThread', () => {
  it('throws when given !=3 highlights', () => {
    expect(() => renderThread([], '2026-05-22', OPTS)).toThrow(/exactly 3/i);
    expect(() => renderThread([H(1), H(2)], '2026-05-22', OPTS)).toThrow(/exactly 3/i);
    expect(() => renderThread([H(1), H(2), H(3), H(4) as Highlight], '2026-05-22', OPTS)).toThrow(/exactly 3/i);
  });

  it('lead post contains the French header with the formatted date', () => {
    const d = renderThread(SAMPLE, '2026-05-22', OPTS);
    expect(d.lead.text).toContain('Top 3 des publications de presse parmi les plus relayées sur Bluesky le 22 mai 2026 :');
    expect(d.lead.text).toContain('Retrouvez la revue de presse complète : https://play.google.com/store/apps/details?id=org.revue_2_presse');
    expect(d.lead.text).toContain('#RevueDePresse');
  });

  it('drops the hashtag then the footer if the lead overflows 300 graphemes', () => {
    const longFooter = 'https://example.org/' + 'x'.repeat(300);
    const d = renderThread(SAMPLE, '2026-05-22', { footerUrl: longFooter, hashtag: '#RevueDePresse' });
    expect(graphemeLength(d.lead.text)).toBeLessThanOrEqual(300);
    expect(d.lead.text).toContain('Top 3');
  });

  it('renders 3 replies with rank + @handle + snippet', () => {
    const d = renderThread(SAMPLE, '2026-05-22', OPTS);
    expect(d.replies).toHaveLength(3);
    expect(d.replies[0].text.startsWith('1. @outlet1.bsky.social — ')).toBe(true);
    expect(d.replies[1].text.startsWith('2. @outlet2.bsky.social — ')).toBe(true);
    expect(d.replies[2].text.startsWith('3. @outlet3.bsky.social — ')).toBe(true);
  });

  it('does NOT include the URL in the reply text', () => {
    const d = renderThread(SAMPLE, '2026-05-22', OPTS);
    for (const r of d.replies) expect(r.text).not.toContain('https://');
  });

  it('exposes the raw handle, embedUri, and mention byte-range per reply', () => {
    const d = renderThread([H(1, 'lemonde.fr'), H(2), H(3)], '2026-05-22', OPTS);
    expect(d.replies[0].handle).toBe('lemonde.fr');
    expect(d.replies[0].embedUri).toBe('https://example.org/article/1');
    const text = d.replies[0].text;
    const buf = Buffer.from(text, 'utf8');
    const slice = buf.slice(d.replies[0].mentionRange.byteStart, d.replies[0].mentionRange.byteEnd).toString('utf8');
    expect(slice).toBe('@lemonde.fr');
  });

  it('computes mentionRange in UTF-8 BYTES, not UTF-16 code units', () => {
    const d = renderThread([H(1, 'lemonde.fr', 'élu président'), H(2), H(3)], '2026-05-22', OPTS);
    const { byteStart, byteEnd } = d.replies[0].mentionRange;
    expect(byteStart).toBe(3);                                   // "1. " is 3 ASCII bytes
    expect(byteEnd - byteStart).toBe('@lemonde.fr'.length);      // 11 ASCII bytes
  });

  it('truncates the snippet to keep every reply ≤300 graphemes', () => {
    const big = 'mot '.repeat(200);
    const d = renderThread([H(1, 'x.bsky.social', big), H(2), H(3)], '2026-05-22', OPTS);
    for (const r of d.replies) expect(graphemeLength(r.text)).toBeLessThanOrEqual(300);
    expect(d.replies[0].text.endsWith('…')).toBe(true);
  });

  it('renders the reply without snippet when text is empty', () => {
    const d = renderThread([H(1, 'x.bsky.social', ''), H(2), H(3)], '2026-05-22', OPTS);
    expect(d.replies[0].text).toBe('1. @x.bsky.social');
  });

  it('exposes lead.linkRange covering the footer URL when the footer survives the budget', () => {
    const d = renderThread(SAMPLE, '2026-05-22', OPTS);
    expect(d.lead.linkRange).toBeDefined();
    const { byteStart, byteEnd, uri } = d.lead.linkRange!;
    expect(uri).toBe('https://play.google.com/store/apps/details?id=org.revue_2_presse');
    const buf = Buffer.from(d.lead.text, 'utf8');
    expect(buf.slice(byteStart, byteEnd).toString('utf8')).toBe(uri);
  });

  it('computes lead.linkRange in UTF-8 BYTES (header includes non-ASCII "relayées")', () => {
    const d = renderThread(SAMPLE, '2026-05-22', OPTS);
    const { byteStart, byteEnd, uri } = d.lead.linkRange!;
    // Sanity: the URL sits past the multi-byte header chars, so byteStart MUST exceed the UTF-16 index.
    expect(byteStart).toBeGreaterThan(d.lead.text.indexOf(uri));
    expect(byteEnd - byteStart).toBe(Buffer.byteLength(uri, 'utf8'));
  });

  it('omits lead.linkRange when no footerUrl is provided', () => {
    const d = renderThread(SAMPLE, '2026-05-22', { hashtag: '#RevueDePresse' });
    expect(d.lead.linkRange).toBeUndefined();
  });

  it('omits lead.linkRange when the footer is dropped by the 300-grapheme budget', () => {
    const longFooter = 'https://example.org/' + 'x'.repeat(300);
    const d = renderThread(SAMPLE, '2026-05-22', { footerUrl: longFooter, hashtag: '#RevueDePresse' });
    expect(d.lead.linkRange).toBeUndefined();
    expect(d.lead.text).not.toContain(longFooter);
  });
});

describe('graphemeLength', () => {
  it('counts ASCII chars correctly', () => {
    expect(graphemeLength('hello')).toBe(5);
  });
  it('counts an emoji as 1 grapheme even though it is multi-codepoint', () => {
    expect(graphemeLength('👨‍👩‍👧')).toBe(1);
  });
});

describe('truncateGraphemes (URL-append degradation budget)', () => {
  it('truncates a near-budget reply so a URL suffix still fits in 300 graphemes', () => {
    // Simulate the cron-CLI degradation path: a 297g reply text plus a "\n<url>" suffix.
    const reply = '1. @lemonde.fr — ' + 'mot '.repeat(70).trim(); // ~297g
    const url = 'https://www.lemonde.fr/economie/article/2026/05/22/un-titre-tres-long-here?ref=rss';
    const suffix = `\n${url}`;
    const maxTextLen = 300 - graphemeLength(suffix);
    const truncated = truncateGraphemes(reply, maxTextLen);
    const final = `${truncated}${suffix}`;
    expect(graphemeLength(final)).toBeLessThanOrEqual(300);
    expect(final.endsWith(url)).toBe(true);
    expect(truncated.endsWith('…')).toBe(true);
    // Mention range start (`@lemonde.fr` at byte offset 3) is still intact.
    expect(truncated.startsWith('1. @lemonde.fr')).toBe(true);
  });

  it('returns the input unchanged when it already fits the budget', () => {
    expect(truncateGraphemes('short', 100)).toBe('short');
  });
});
