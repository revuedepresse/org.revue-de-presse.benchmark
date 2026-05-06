import { describe, expect, it } from 'vitest';
import { formatDate, formatCount } from '../../src/utils/intl';

describe('formatDate', () => {
  const d = new Date(2021, 3, 2); // 2 April 2021

  it('formats shortDay in fr-FR', () => {
    const out = formatDate(d, 'shortDay', 'fr-FR');
    expect(out).toMatch(/ven\.?\s+2\s+avr\.?\s+2021/i);
  });

  it('formats shortDay in en-GB', () => {
    const out = formatDate(d, 'shortDay', 'en-GB');
    // Node 20+ ICU emits "Fri, 2 Apr 2021"; older locales/ICU may drop the comma.
    expect(out).toMatch(/Fri,?\s+2\s+Apr\s+2021/);
  });

  it('formats longDay in fr-FR', () => {
    const out = formatDate(d, 'longDay', 'fr-FR');
    expect(out).toMatch(/vendredi\s+2\s+avril\s+2021/i);
  });

  it('formats monthYear in en-GB', () => {
    expect(formatDate(d, 'monthYear', 'en-GB')).toMatch(/April\s+2021/);
  });

  it('formats iso unambiguously', () => {
    expect(formatDate(d, 'iso', 'fr-FR')).toBe('02/04/2021');
    expect(formatDate(d, 'iso', 'en-GB')).toBe('02/04/2021');
  });
});

describe('formatCount', () => {
  it('formats compact thousands in fr-FR', () => {
    expect(formatCount(35200, 'fr-FR')).toMatch(/35[,.]?2\s*k/i);
  });

  it('formats compact thousands in en-GB', () => {
    expect(formatCount(35200, 'en-GB')).toMatch(/35\.?2K/i);
  });

  it('passes small counts through unchanged', () => {
    expect(formatCount(48, 'fr-FR')).toBe('48');
    expect(formatCount(48, 'en-GB')).toBe('48');
  });
});
