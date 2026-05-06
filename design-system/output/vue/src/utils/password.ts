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
