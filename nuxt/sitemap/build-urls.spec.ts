import { describe, it, expect } from 'vitest';
import {
  formatDate,
  localizeDate,
  days,
  buildLegacySitemapUrls,
  HIGHLIGHTS_PATH_PREFIX,
  SITEMAP_MIN_DATE,
} from './build-urls';

describe('formatDate', () => {
  it('zero-pads month and day', () => {
    expect(formatDate(new Date(2025, 0, 5))).toBe('2025-01-05');
  });

  it('renders December correctly', () => {
    expect(formatDate(new Date(2026, 11, 31))).toBe('2026-12-31');
  });
});

describe('localizeDate', () => {
  it('produces a kebab-case French long date', () => {
    // "1 mai 2026" → "jeudi-1-mai-2026" (or similar; depends on system tz).
    const out = localizeDate('2026-05-01');
    expect(out).toMatch(/^[a-z]+-\d{1,2}-[a-z]+-\d{4}$/);
  });

  it('strips diacritics (e.g. "février" → "fevrier")', () => {
    const out = localizeDate('2026-02-15');
    expect(out).not.toMatch(/[éèàâîôûç]/);
    expect(out).toContain('fevrier');
  });
});

describe('HIGHLIGHTS_PATH_PREFIX', () => {
  it('matches the legacy literal', () => {
    expect(HIGHLIGHTS_PATH_PREFIX).toBe('/actualites-du-');
  });
});

describe('SITEMAP_MIN_DATE', () => {
  it('matches the legacy literal', () => {
    expect(SITEMAP_MIN_DATE).toBe('04 Mar 2025 00:00:00 GMT');
  });
});

describe('days', () => {
  it('returns at least one entry when until equals min date', () => {
    const until = new Date(Date.parse(SITEMAP_MIN_DATE));
    const result = days(until);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result[0]).toBe('/2025-03-04');
  });

  it('produces leading-slash YYYY-MM-DD strings', () => {
    const until = new Date(Date.parse('10 Mar 2025 00:00:00 GMT'));
    const result = days(until);
    expect(result.every((d) => /^\/\d{4}-\d{2}-\d{2}$/.test(d))).toBe(true);
  });

  it('covers the whole inclusive range from min to until', () => {
    const until = new Date(Date.parse('06 Mar 2025 00:00:00 GMT'));
    const result = days(until);
    expect(result).toContain('/2025-03-04');
    expect(result).toContain('/2025-03-05');
    expect(result).toContain('/2025-03-06');
  });
});

describe('buildLegacySitemapUrls', () => {
  it('emits the homepage first with daily changefreq', async () => {
    const urls = await buildLegacySitemapUrls();
    expect(urls[0].loc).toBe('/');
    expect(urls[0].changefreq).toBe('daily');
    expect(urls[0].lastmod).toBeDefined();
  });

  it('includes the four fixed pages with their legacy lastmods', async () => {
    const urls = await buildLegacySitemapUrls();
    const byLoc = new Map(urls.map((u) => [u.loc, u]));
    expect(byLoc.get('/mentions-legales')?.lastmod).toBe(
      new Date('2023-01-23').toISOString(),
    );
    expect(byLoc.get('/nous-contacter')?.lastmod).toBe(
      new Date('2023-03-02').toISOString(),
    );
    expect(byLoc.get('/nous-soutenir')?.lastmod).toBe(
      new Date('2023-03-07').toISOString(),
    );
    expect(byLoc.get('/sources')?.lastmod).toBe(
      new Date('2025-03-08').toISOString(),
    );
  });

  it('emits a yesterday-highlight entry with daily changefreq', async () => {
    const urls = await buildLegacySitemapUrls();
    const dailies = urls.filter((u) => u.changefreq === 'daily');
    // Homepage + yesterday-highlight = 2.
    expect(dailies.length).toBe(2);
  });

  it('uses `loc` (not `url`) per @nuxtjs/sitemap v8 schema', async () => {
    const urls = await buildLegacySitemapUrls();
    expect(urls.every((u) => typeof u.loc === 'string')).toBe(true);
    expect(urls.every((u) => !('url' in u))).toBe(true);
  });

  it('does not include yesterday twice (filtered from days())', async () => {
    const urls = await buildLegacySitemapUrls();
    const yesterdayIso = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    })();
    const matchingYesterday = urls.filter((u) =>
      u.loc.startsWith(`/${yesterdayIso}/actualites-du-`),
    );
    expect(matchingYesterday.length).toBe(1);
  });

  it("does not include today (today's content is not yet published)", async () => {
    const urls = await buildLegacySitemapUrls();
    const todayIso = (() => {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    })();
    const matchingToday = urls.filter((u) => u.loc.startsWith(`/${todayIso}/`));
    expect(matchingToday.length).toBe(0);
  });
});
