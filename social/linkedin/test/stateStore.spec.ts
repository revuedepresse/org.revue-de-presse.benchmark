import { describe, expect, it, beforeEach } from 'vitest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readStateFile, writeStateFile, hasPostedFor, recordPost } from '../src/stateStore.ts';

let dir: string;
let path: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'rdp-linkedin-state-'));
  path = join(dir, 'state.json');
});

describe('stateStore', () => {
  it('treats a missing file as never-posted', async () => {
    expect(await hasPostedFor(path, '2026-05-20')).toBe(false);
  });

  it('returns false when lastPostedDate is a different date', async () => {
    await writeStateFile(path, { lastPostedDate: '2026-05-19', history: [] });
    expect(await hasPostedFor(path, '2026-05-20')).toBe(false);
  });

  it('returns true when lastPostedDate matches', async () => {
    await writeStateFile(path, { lastPostedDate: '2026-05-20', history: [] });
    expect(await hasPostedFor(path, '2026-05-20')).toBe(true);
  });

  it('recordPost writes lastPostedDate and prepends to history', async () => {
    await recordPost(path, '2026-05-20', 'urn:li:share:1', '2026-05-21T05:30:15Z');
    const state = await readStateFile(path);
    expect(state?.lastPostedDate).toBe('2026-05-20');
    expect(state?.history[0]).toEqual({
      date: '2026-05-20',
      postUrn: 'urn:li:share:1',
      postedAt: '2026-05-21T05:30:15Z',
    });
  });

  it('caps history at 30 entries (oldest dropped)', async () => {
    // Use synthetic date strings; the store treats them as opaque keys.
    for (let i = 0; i < 35; i += 1) {
      const tag = `d-${String(i).padStart(2, '0')}`;
      await recordPost(path, tag, `urn:li:share:${i}`, '2026-01-01T00:00:00Z');
    }
    const state = await readStateFile(path);
    expect(state?.history).toHaveLength(30);
    // Newest first: last write was i=34 → tag d-34. Oldest (i=0..4) were dropped.
    expect(state?.history[0].date).toBe('d-34');
    expect(state?.history.find((e) => e.date === 'd-00')).toBeUndefined();
    expect(state?.history.find((e) => e.date === 'd-05')).toBeDefined();
  });
});
