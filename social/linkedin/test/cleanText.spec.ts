import { describe, expect, it } from 'vitest';
import { cleanText } from '../src/cleanText.ts';

describe('cleanText', () => {
  it('returns empty string for empty input', () => {
    expect(cleanText('')).toBe('');
  });

  it('strips wrapping straight quotes', () => {
    expect(cleanText('"Hello"')).toBe('Hello');
  });

  it('converts literal \\n into real line feeds', () => {
    expect(cleanText('line one\\nline two')).toBe('line one\nline two');
  });

  it('decodes escaped quotes inside the body', () => {
    expect(cleanText("L\\'Espagne et l\\'Italie")).toBe("L'Espagne et l'Italie");
  });

  it('decodes \\xa0\\ as a regular space and collapses runs', () => {
    expect(cleanText('1er\\xa0\\mai')).toBe('1er mai');
  });

  it('decodes 4-hex-digit \\x202f\\ (NNBSP) as a regular space', () => {
    expect(cleanText('connue\\x202f\\: attaquer')).toBe('connue : attaquer');
  });

  it('decodes 4-hex-digit \\x2026 (HORIZONTAL ELLIPSIS) to its Unicode char', () => {
    expect(cleanText('voir aussi\\x2026')).toBe('voir aussi…');
  });

  it('decodes CSS-style \\2f\\ hex escapes to printable ASCII', () => {
    expect(cleanText('A\\2f\\B')).toBe('A/B');
  });

  it('strips bare backslashes left after other transforms', () => {
    // Use a non-hex follow char so the hex-escape regexes do not consume it.
    expect(cleanText('foo\\!bar')).toBe('foo!bar');
  });

  it('trims surrounding whitespace', () => {
    expect(cleanText('   hello   ')).toBe('hello');
  });
});
