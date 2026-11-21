import { readFile, writeFile, rename } from 'node:fs/promises';
import type { PublisherList, StateFile } from './types.ts';

// A month of posts, for each list.
const HISTORY_CAP = 60;

const EMPTY: StateFile = { lastPostedDate: null, history: [] };

export class StateFileError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'StateFileError';
  }
}

export async function readStateFile(path: string): Promise<StateFile | null> {
  let raw: string;
  try {
    raw = await readFile(path, 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw new StateFileError(`Cannot read ${path}`, err);
  }
  try {
    return JSON.parse(raw) as StateFile;
  } catch (err) {
    throw new StateFileError(`Malformed JSON in ${path}`, err);
  }
}

export async function writeStateFile(path: string, state: StateFile): Promise<void> {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, JSON.stringify(state, null, 2));
  await rename(tmp, path);
}

export async function hasPostedFor(
  path: string,
  isoDate: string,
  list: PublisherList = 'fr',
): Promise<boolean> {
  const state = await readStateFile(path);
  if (!state) return false;
  if (list === 'fr' && state.lastPostedDate === isoDate) return true;
  return state.history.some((entry) => entry.date === isoDate && (entry.list ?? 'fr') === list);
}

export async function recordPost(
  path: string,
  isoDate: string,
  postUrn: string,
  postedAt: string,
  list: PublisherList = 'fr',
): Promise<void> {
  const current = (await readStateFile(path)) ?? EMPTY;
  const next: StateFile = {
    // Kept for French media only, as before lists, so a rollback still dedupes.
    lastPostedDate: list === 'fr' ? isoDate : current.lastPostedDate,
    history: [{ date: isoDate, postUrn, postedAt, list }, ...current.history].slice(0, HISTORY_CAP),
  };
  await writeStateFile(path, next);
}
