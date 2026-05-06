export const MIN_LENGTH_MFA = 8;
export const MIN_LENGTH_NO_MFA = 15;
export const MAX_LENGTH = 64;

export type Mode = 'mfa' | 'no-mfa';

export type LengthResult =
  | { ok: true }
  | { ok: false; code: 'too-short' | 'too-long'; min: number; max: number };

export function checkLength(value: string, mode: Mode): LengthResult {
  const min = mode === 'mfa' ? MIN_LENGTH_MFA : MIN_LENGTH_NO_MFA;
  if (value.length < min) return { ok: false, code: 'too-short', min, max: MAX_LENGTH };
  if (value.length > MAX_LENGTH) return { ok: false, code: 'too-long', min, max: MAX_LENGTH };
  return { ok: true };
}

export async function sha1Prefix(value: string): Promise<string> {
  // Pwned Passwords API requires the first 5 hex chars of SHA-1, uppercase.
  const enc = new TextEncoder().encode(value);
  const buf = await crypto.subtle.digest('SHA-1', enc);
  const hex = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hex.slice(0, 5).toUpperCase();
}

import type { ErrorMessage } from '../types';
import { isBreached } from './pwned-passwords';

export type ValidationResult = {
  ok: boolean;
  score?: number;
  errors: ErrorMessage[];
};

export type ValidateOptions = {
  breach?: 'check' | 'skip';
};

let zxcvbnCached: ((value: string) => Promise<{ score: number }>) | null = null;

async function loadZxcvbn(): Promise<(value: string) => Promise<{ score: number }>> {
  if (zxcvbnCached) return zxcvbnCached;
  const { zxcvbnAsync, zxcvbnOptions } = await import('@zxcvbn-ts/core');
  const langCommon = await import('@zxcvbn-ts/language-common');
  const langFr = await import('@zxcvbn-ts/language-fr');
  const langEn = await import('@zxcvbn-ts/language-en');
  zxcvbnOptions.setOptions({
    translations: langEn.translations,
    dictionary: { ...langCommon.dictionary, ...langFr.dictionary, ...langEn.dictionary },
    graphs: langCommon.adjacencyGraphs,
  });
  zxcvbnCached = (value) => zxcvbnAsync(value).then((r) => ({ score: r.score }));
  return zxcvbnCached;
}

export async function validatePassword(
  value: string,
  mode: Mode,
  opts: ValidateOptions = {}
): Promise<ValidationResult> {
  const errors: ErrorMessage[] = [];

  // 1. Length
  const lengthResult = checkLength(value, mode);
  if (!lengthResult.ok) {
    if (lengthResult.code === 'too-short') {
      errors.push({ key: 'errors.password.too-short', vars: { min: lengthResult.min } });
    } else {
      errors.push({ key: 'errors.password.too-long', vars: { max: lengthResult.max } });
    }
    return { ok: false, errors };
  }

  // 2. zxcvbn (lazy import — keeps M1 atoms light)
  const zxcvbn = await loadZxcvbn();
  const z = await zxcvbn(value);
  if (z.score < 3) {
    errors.push({ key: 'errors.password.weak', vars: { score: z.score } });
  }

  if (errors.length > 0) return { ok: false, score: z.score, errors };

  // 3. Pwned Passwords
  if (opts.breach !== 'skip') {
    const breach = await isBreached(value);
    if ('breached' in breach && breach.breached) {
      errors.push({ key: 'errors.password.breached' });
      return { ok: false, score: z.score, errors };
    }
  }

  return { ok: true, score: z.score, errors: [] };
}
