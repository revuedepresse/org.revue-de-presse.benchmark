import { readFile, writeFile, rename } from 'node:fs/promises';
import type { StateFile } from './types.ts';

const HISTORY_CAP = 30;

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

export async function hasPostedFor(path: string, isoDate: string): Promise<boolean> {
  const state = await readStateFile(path);
  return state?.lastPostedDate === isoDate;
}

export async function recordPost(
  path: string,
  isoDate: string,
  threadRootUri: string,
  postedAt: string,
  publicationIds: string[],
): Promise<void> {
  const current = (await readStateFile(path)) ?? EMPTY;
  const next: StateFile = {
    lastPostedDate: isoDate,
    history: [
      { date: isoDate, threadRootUri, postedAt, publicationIds },
      ...current.history,
    ].slice(0, HISTORY_CAP),
  };
  await writeStateFile(path, next);
}
