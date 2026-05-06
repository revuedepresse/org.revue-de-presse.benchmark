import { describe, expect, it } from 'vitest';
import frFR from '../../src/locales/fr-FR.json';
import enGB from '../../src/locales/en-GB.json';
import { t, type Locale } from '../../src/utils/i18n';

describe('i18n', () => {
  it('locale dictionaries have identical key sets', () => {
    const fr = Object.keys(frFR).sort();
    const en = Object.keys(enGB).sort();
    expect(fr).toEqual(en);
  });

  it('returns the key when no translation found (identity fallback)', () => {
    expect(t('does.not.exist')).toBe('does.not.exist');
  });

  it('looks up the default locale (fr-FR)', () => {
    expect(t('actions.quit.label')).toBe('Quitter');
  });

  it('respects locale override', () => {
    expect(t('actions.quit.label', undefined, 'en-GB')).toBe('Quit');
  });

  it('interpolates {var} placeholders', () => {
    expect(t('errors.password.too-short', { min: 15 })).toBe(
      'Le mot de passe doit contenir au moins 15 caractères.'
    );
    expect(t('errors.password.too-short', { min: 15 }, 'en-GB')).toBe(
      'Password must be at least 15 characters.'
    );
  });

  it('locale type matches dictionary keys', () => {
    const valid: Locale = 'fr-FR';
    const valid2: Locale = 'en-GB';
    expect(valid).toBe('fr-FR');
    expect(valid2).toBe('en-GB');
  });
});
