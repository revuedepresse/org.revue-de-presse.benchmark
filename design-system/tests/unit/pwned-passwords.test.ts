import { describe, expect, it, vi, afterEach } from 'vitest';
import { isBreached } from '../../src/utils/pwned-passwords';

const ORIGINAL_FETCH = globalThis.fetch;

describe('isBreached', () => {
  afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
    vi.restoreAllMocks();
  });

  it('returns breached:true with count when the SHA-1 suffix is in the response', async () => {
    // SHA-1('password') = 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8
    // → prefix 5BAA6, suffix 1E4C9B93F3F0682250B6CF8331B7EE68FD8
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        '003D68EB55068C33ACE09247EE4C639306B:5\r\n1E4C9B93F3F0682250B6CF8331B7EE68FD8:1234\r\nFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF:1',
    } as Response) as unknown as typeof fetch;
    expect(await isBreached('password')).toEqual({ breached: true, count: 1234 });
  });

  it('returns breached:false when the suffix is absent', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:1\r\nBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB:2',
    } as Response) as unknown as typeof fetch;
    expect(await isBreached('a-novel-passphrase-of-substantial-length')).toEqual({
      breached: false,
    });
  });

  it('returns error:fetch-failed when the network errors', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('network')) as unknown as typeof fetch;
    expect(await isBreached('whatever')).toEqual({ error: 'fetch-failed' });
  });

  it('uses the k-anonymity endpoint with first 5 hex chars', async () => {
    const spy = vi.fn().mockResolvedValue({ ok: true, text: async () => '' } as Response);
    globalThis.fetch = spy as unknown as typeof fetch;
    await isBreached('password');
    expect(spy).toHaveBeenCalledWith(
      'https://api.pwnedpasswords.com/range/5BAA6',
      expect.any(Object)
    );
  });
});
