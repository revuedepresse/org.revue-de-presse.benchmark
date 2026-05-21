import { describe, expect, it } from 'vitest';
import { highlights20260501 } from './fixtures/highlights-2026-05-01.ts';
import { buildCaption } from '../src/caption.ts';

describe('buildCaption', () => {
  const caption = buildCaption(highlights20260501, '2026-05-01');

  it('starts with the localised date in dd/MM/yyyy', () => {
    expect(caption).toMatch(/^Revue de presse du 01\/05\/2026 — /);
  });

  it('lists deduplicated source display names separated by interpunct', () => {
    expect(caption).toContain('Le Monde · Mediapart · France Culture');
    expect(caption.match(/Le Monde/g)?.length).toBe(1);
    expect(caption).toContain('#LeMonde');
  });

  it('includes the website and Play Store URLs without https://', () => {
    expect(caption).toContain('🔗 revue-de-presse.org');
    expect(caption).toContain('📱 play.google.com/store/apps/details?id=org.revue_2_presse');
    expect(caption).not.toContain('https://');
  });

  it('lists derived source hashtags before static ones', () => {
    expect(caption).toMatch(/#LeMonde[\s\S]*#RevueDePresse/);
  });

  it('includes every static hashtag', () => {
    for (const tag of ['#RevueDePresse', '#Médias', '#Bluesky', '#Actu', '#Presse', '#Journalisme']) {
      expect(caption).toContain(tag);
    }
  });

  it('stays within TikTok caption hard cap (2200 chars)', () => {
    expect(caption.length).toBeLessThanOrEqual(2200);
  });

  it('emits no more than 30 hashtags', () => {
    const tags = caption.match(/#[\p{L}\p{N}_]+/gu) ?? [];
    expect(tags.length).toBeLessThanOrEqual(30);
  });

  it('all hashtags match the allowed regex', () => {
    const tags = caption.match(/#\S+/g) ?? [];
    for (const t of tags) expect(t).toMatch(/^#[\p{L}\p{N}_]+$/u);
  });

  it('throws if the highlights array is empty', () => {
    expect(() => buildCaption([], '2026-05-01')).toThrow();
  });
});
