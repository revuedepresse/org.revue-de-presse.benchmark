import { describe, expect, it, vi, afterEach } from 'vitest';
import { validatePassword } from '../../src/utils/password';

const ORIGINAL_FETCH = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  vi.restoreAllMocks();
});

describe('validatePassword pipeline', () => {
  it('returns too-short when length below min (no MFA)', async () => {
    const r = await validatePassword('a'.repeat(14), 'no-mfa', { breach: 'skip' });
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.key).toBe('errors.password.too-short');
  });

  it('returns too-long when length above max', async () => {
    const r = await validatePassword('a'.repeat(65), 'no-mfa', { breach: 'skip' });
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.key).toBe('errors.password.too-long');
  });

  it('returns weak when zxcvbn score is below 3 (skip breach)', async () => {
    // 15 chars but a single repeated char → very weak
    const r = await validatePassword('a'.repeat(15), 'no-mfa', { breach: 'skip' });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.key === 'errors.password.weak')).toBe(true);
  }, 15_000);

  it('returns ok when length, zxcvbn ≥ 3, and breach all pass', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue({ ok: true, text: async () => '' } as Response) as unknown as typeof fetch;
    const r = await validatePassword('correct-horse-battery-staple-2026', 'no-mfa');
    expect(r.ok).toBe(true);
    expect(r.errors).toHaveLength(0);
    expect(r.score).toBeGreaterThanOrEqual(3);
  }, 15_000);
});
