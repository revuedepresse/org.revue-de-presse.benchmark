import { describe, it, expect } from 'vitest';
import { cleanText, cleanForFeed, repairMojibake } from './cleanText';

describe('repairMojibake', () => {
  it('repairs Ã© -> é', () => {
    expect(repairMojibake('CafÃ©')).toBe('Café');
  });

  it('repairs Ã¨ -> è', () => {
    expect(repairMojibake('IsraÃ«l')).toBe('Israël');
  });

  it('repairs multiple mojibake sequences in one string', () => {
    expect(repairMojibake("L'HumanitÃ© attaquÃ©e")).toBe("L'Humanité attaquée");
  });

  it('leaves valid UTF-8 strings untouched', () => {
    expect(repairMojibake('Café déjà-vu — émoji 🌷')).toBe('Café déjà-vu — émoji 🌷');
  });

  it('leaves plain ASCII untouched', () => {
    expect(repairMojibake('hello world')).toBe('hello world');
  });

  it('refuses to roundtrip a string containing chars beyond Latin-1', () => {
    expect(repairMojibake('🌷 CafÃ©')).toBe('🌷 CafÃ©');
  });

  it('returns empty string for falsy input', () => {
    expect(repairMojibake('')).toBe('');
  });
});

describe('cleanText (mojibake handling)', () => {
  it('repairs mojibake before stripping artefacts', () => {
    expect(cleanText('"CafÃ©"')).toBe('Café');
  });
});

describe('cleanText (4-hex-digit escapes)', () => {
  it('decodes \\x202f\\ (NNBSP) to a regular space', () => {
    expect(cleanText('connue\\x202f\\: attaquer')).toBe('connue : attaquer');
  });

  it('decodes \\x2026 (HORIZONTAL ELLIPSIS) to its Unicode char', () => {
    expect(cleanText('voir aussi\\x2026')).toBe('voir aussi…');
  });

  it('does not confuse \\xa0\\ (2-digit NBSP) with the 4-digit form', () => {
    expect(cleanText('1er\\xa0\\mai')).toBe('1er mai');
  });
});

describe('cleanForFeed', () => {
  it('repairs mojibake AND flattens line feeds', () => {
    expect(cleanForFeed("L'HumanitÃ©\nest\rdebout")).toBe("L'Humanité est debout");
  });
});
