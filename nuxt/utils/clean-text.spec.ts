import { describe, it, expect } from 'vitest';
import { cleanText, cleanForFeed, cleanCitationText, repairMojibake } from './clean-text';

describe('cleanCitationText', () => {
  it('strips wrapping double quotes', () => {
    expect(cleanCitationText('"En France, des Premiers ministres"')).toBe(
      'En France, des Premiers ministres',
    );
  });

  it('flattens real and literal \\n into a single space (citations stay single-line)', () => {
    expect(cleanCitationText('Titre\nCorps')).toBe('Titre Corps');
    expect(cleanCitationText('Titre\\nCorps')).toBe('Titre Corps');
    expect(cleanCitationText('Titre\\n\\nCorps')).toBe('Titre Corps');
  });

  it('strips real NBSP and literal \\xa0 occurrences (rendering as a plain space)', () => {
    expect(cleanCitationText('mot nbsp')).toBe('mot nbsp');
    expect(cleanCitationText('mot\\xa0nbsp')).toBe('mot nbsp');
  });

  it('handles all four irritants at once', () => {
    expect(
      cleanCitationText('"En France\\nDéfense nationale\\xa0— suite"'),
    ).toBe('En France Défense nationale — suite');
  });

  it('inserts NBSP after « when followed by anything other than NBSP', () => {
    expect(cleanCitationText('«mot»')).toBe('« mot »');
    expect(cleanCitationText('«  mot  »')).toBe('« mot »');
  });

  it('inserts NBSP before » when preceded by anything other than NBSP', () => {
    expect(cleanCitationText('un «discours»')).toBe('un « discours »');
  });

  it('preserves existing NBSP around guillemets (no double-space)', () => {
    expect(cleanCitationText('« déjà »')).toBe('« déjà »');
  });

  it('handles French nested guillemets in a typical news headline', () => {
    expect(
      cleanCitationText('"«Collaborations»: patronat et extrême droite"'),
    ).toBe('« Collaborations »: patronat et extrême droite');
  });

  it('returns empty string for empty input', () => {
    expect(cleanCitationText('')).toBe('');
  });
});

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
    // Mixed real UTF-8 + (false positive) Ã©. We can't safely repair without
    // corrupting the emoji, so leave the string alone.
    expect(repairMojibake('🌷 CafÃ©')).toBe('🌷 CafÃ©');
  });

  it('returns empty string for falsy input', () => {
    expect(repairMojibake('')).toBe('');
  });
});

describe('cleanText (mojibake handling)', () => {
  it('repairs mojibake before stripping artefacts', () => {
    // Wrapped in legacy upstream literal quotes; mojibake'd accent inside.
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
