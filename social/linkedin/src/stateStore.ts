import { readFile, writeFile, rename } from 'node:fs/promises';
import type { StateFile } from './types.ts';

const HISTORY_CAP = 30;

const EMPTY: StateFile = { lastPostedDate: null, history: [] };

export async function readStateFile(path: string): Promise<StateFile | null> {
  try {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw) as StateFile;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

export async function writeStateFile(path: string, state: StateFile): Promise<void> {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, JSON.stringify(state, null, 2));
  await rename(tmp, path);
}

export async function hasPostedFor(path: string, isoDate: string): Promise<boolean> {
  const state = await readStateFile(path);
  return state?.lastPostedDate === isoDate;
}

export async function recordPost(
  path: string,
  isoDate: string,
  postUrn: string,
  postedAt: string,
): Promise<void> {
  const current = (await readStateFile(path)) ?? EMPTY;
  const next: StateFile = {
    lastPostedDate: isoDate,
    history: [{ date: isoDate, postUrn, postedAt }, ...current.history].slice(0, HISTORY_CAP),
  };
  await writeStateFile(path, next);
}
