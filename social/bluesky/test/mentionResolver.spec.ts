import { describe, expect, it, vi } from 'vitest';
import { createMentionResolver } from '../src/mentionResolver.ts';

describe('createMentionResolver', () => {
  it('returns the DID on success', async () => {
    const resolveHandle = vi.fn().mockResolvedValue({ data: { did: 'did:plc:abc' } });
    const r = createMentionResolver({ resolveHandle } as never);
    expect(await r.resolve('lemonde.fr')).toBe('did:plc:abc');
    expect(resolveHandle).toHaveBeenCalledWith({ handle: 'lemonde.fr' });
  });

  it('caches a DID lookup within the same resolver instance', async () => {
    const resolveHandle = vi.fn().mockResolvedValue({ data: { did: 'did:plc:abc' } });
    const r = createMentionResolver({ resolveHandle } as never);
    await r.resolve('lemonde.fr');
    await r.resolve('lemonde.fr');
    expect(resolveHandle).toHaveBeenCalledTimes(1);
  });

  it('returns null when resolveHandle throws (graceful degradation)', async () => {
    const resolveHandle = vi.fn().mockRejectedValue(new Error('not found'));
    const r = createMentionResolver({ resolveHandle } as never);
    expect(await r.resolve('not-real.invalid')).toBeNull();
  });

  it('returns null when response has no did', async () => {
    const resolveHandle = vi.fn().mockResolvedValue({ data: {} });
    const r = createMentionResolver({ resolveHandle } as never);
    expect(await r.resolve('weird.bsky.social')).toBeNull();
  });
});
