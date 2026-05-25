import { describe, expect, it } from 'vitest';
import { escapeLittleText } from '../src/littleText.ts';

// LinkedIn LITTLE_TEXT spec:
// https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/little-text-format
//
// Reserved characters that must be backslash-escaped to be treated as plain
// text: | { } @ [ ] ( ) < > * _ ~ \   (we deliberately do NOT escape `#` so
// LinkedIn's auto-detected HashtagElement keeps rendering as a clickable tag).

describe('escapeLittleText', () => {
  it('escapes parentheses (the production incident on 2026-05-25)', () => {
    expect(escapeLittleText('(re)voir')).toBe('\\(re\\)voir');
  });

  it('escapes every LTF reserved character', () => {
    expect(escapeLittleText('|{}@[]()<>*_~')).toBe(
      '\\|\\{\\}\\@\\[\\]\\(\\)\\<\\>\\*\\_\\~',
    );
  });

  it('escapes backslash as \\\\', () => {
    expect(escapeLittleText('a\\b')).toBe('a\\\\b');
  });

  it('does NOT escape #', () => {
    // Leaving `#` literal preserves LinkedIn's HashtagElement auto-detection.
    expect(escapeLittleText('#Cannes2026 et #RevueDePresse')).toBe(
      '#Cannes2026 et #RevueDePresse',
    );
  });

  it('passes plain Unicode/punctuation through unchanged', () => {
    expect(escapeLittleText('Pédro Almodóvar — «monstres» 🚀 →')).toBe(
      'Pédro Almodóvar — «monstres» 🚀 →',
    );
  });

  it('escapes a backslash that precedes another reserved char only once', () => {
    // The escape pass runs left-to-right and each reserved char gets exactly
    // one leading backslash. We must NOT double-escape the inserted backslash.
    expect(escapeLittleText('(a)')).toBe('\\(a\\)');
  });
});
