import { describe, it, expect } from 'vitest';
import { cleanText, cleanForFeed, repairMojibake } from './clean-text';

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

describe('cleanForFeed', () => {
  it('repairs mojibake AND flattens line feeds', () => {
    expect(cleanForFeed("L'HumanitÃ©\nest\rdebout")).toBe("L'Humanité est debout");
  });
});
