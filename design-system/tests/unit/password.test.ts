import { describe, expect, it } from 'vitest';
import {
  checkLength,
  sha1Prefix,
  MIN_LENGTH_NO_MFA,
  MAX_LENGTH,
} from '../../src/utils/password';

describe('checkLength', () => {
  it('rejects 14 chars in no-MFA mode', () => {
    expect(checkLength('a'.repeat(14), 'no-mfa')).toEqual({
      ok: false,
      code: 'too-short',
      min: 15,
      max: 64,
    });
  });

  it('accepts exactly 15 chars in no-MFA mode', () => {
    expect(checkLength('a'.repeat(15), 'no-mfa')).toEqual({ ok: true });
  });

  it('rejects 7 chars in MFA mode', () => {
    expect(checkLength('a'.repeat(7), 'mfa')).toEqual({
      ok: false,
      code: 'too-short',
      min: 8,
      max: 64,
    });
  });

  it('accepts exactly 8 chars in MFA mode', () => {
    expect(checkLength('a'.repeat(8), 'mfa')).toEqual({ ok: true });
  });

  it('rejects 65 chars in either mode', () => {
    expect(checkLength('a'.repeat(65), 'no-mfa')).toMatchObject({ ok: false, code: 'too-long' });
    expect(checkLength('a'.repeat(65), 'mfa')).toMatchObject({ ok: false, code: 'too-long' });
  });

  it('exposes MIN_LENGTH_NO_MFA = 15 and MAX_LENGTH = 64', () => {
    expect(MIN_LENGTH_NO_MFA).toBe(15);
    expect(MAX_LENGTH).toBe(64);
  });
});

describe('sha1Prefix', () => {
  it('returns the first 5 hex chars of SHA-1 in uppercase', async () => {
    // SHA-1('password') = 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8
    expect(await sha1Prefix('password')).toBe('5BAA6');
  });

  it('handles unicode input', async () => {
    const out = await sha1Prefix('café');
    expect(out).toMatch(/^[0-9A-F]{5}$/);
  });
});
