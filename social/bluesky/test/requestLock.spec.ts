import { mkdtemp, readdir, writeFile, utimes } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRequestLock, lockFileName, LockTimeoutError } from '../src/requestLock.ts';

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'rdp-lock-'));
});
afterEach(async () => {
  // The lock is advisory and self-cleaning; a leftover file is itself a failure
  // signal, so assert emptiness rather than force-removing.
  expect(await readdir(dir)).toEqual([]);
});

describe('lockFileName', () => {
  it('flattens the library lock name into a safe filename', () => {
    expect(lockFileName('@atproto-oauth-client-did:plc:abc123')).toBe(
      '.lock-_atproto-oauth-client-did_plc_abc123',
    );
  });
});

describe('createRequestLock', () => {
  it('returns the callback result and releases the lock', async () => {
    const lock = createRequestLock({ dir });
    await expect(lock('s', () => 'value')).resolves.toBe('value');
    expect(await readdir(dir)).toEqual([]);
  });

  it('releases the lock when the callback throws', async () => {
    const lock = createRequestLock({ dir });
    await expect(lock('s', () => { throw new Error('boom'); })).rejects.toThrow('boom');
    expect(await readdir(dir)).toEqual([]);
  });

  it('serialises concurrent holders of the same name', async () => {
    // This is the property that matters: atproto refresh tokens are single-use,
    // so two overlapping refreshes retire each other's token.
    const lock = createRequestLock({ dir, pollMs: 5 });
    const events: string[] = [];
    const task = (id: string) =>
      lock('same', async () => {
        events.push(`enter-${id}`);
        await new Promise((r) => setTimeout(r, 20));
        events.push(`exit-${id}`);
      });

    await Promise.all([task('a'), task('b')]);

    // Whatever the order, one must fully finish before the other starts.
    expect(events).toHaveLength(4);
    expect(events[1]).toBe(`exit-${events[0].slice('enter-'.length)}`);
  });

  it('does not serialise different names', async () => {
    const lock = createRequestLock({ dir, pollMs: 5 });
    let concurrent = 0;
    let peak = 0;
    const task = (name: string) =>
      lock(name, async () => {
        peak = Math.max(peak, (concurrent += 1));
        await new Promise((r) => setTimeout(r, 20));
        concurrent -= 1;
      });

    await Promise.all([task('one'), task('two')]);
    expect(peak).toBe(2);
  });

  it('reclaims a lock abandoned by a crashed process', async () => {
    const path = join(dir, lockFileName('stale'));
    await writeFile(path, '999999\n');
    const old = new Date(Date.now() - 120_000);
    await utimes(path, old, old);

    const lock = createRequestLock({ dir, staleMs: 60_000, pollMs: 5 });
    await expect(lock('stale', () => 'recovered')).resolves.toBe('recovered');
  });

  it('times out rather than waiting forever on a live lock', async () => {
    const path = join(dir, lockFileName('held'));
    await writeFile(path, '1\n');

    const lock = createRequestLock({ dir, timeoutMs: 50, staleMs: 60_000, pollMs: 5 });
    await expect(lock('held', () => 'never')).rejects.toThrow(LockTimeoutError);

    // Clean up the deliberately-held lock so the afterEach invariant holds.
    const { unlink } = await import('node:fs/promises');
    await unlink(path);
  });
});
