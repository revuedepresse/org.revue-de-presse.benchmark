import { readFile, writeFile, rename, chmod } from 'node:fs/promises';
import type { TokenFile } from './types.ts';

export class TokenFileError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'TokenFileError';
  }
}

export async function readTokenFile(path: string): Promise<TokenFile | null> {
  let raw: string;
  try {
    raw = await readFile(path, 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw new TokenFileError(`Cannot read ${path}`, err);
  }
  try {
    return JSON.parse(raw) as TokenFile;
  } catch (err) {
    throw new TokenFileError(`Malformed JSON in ${path}`, err);
  }
}

export async function writeTokenFile(path: string, token: TokenFile): Promise<void> {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, JSON.stringify(token, null, 2), { mode: 0o600 });
  await chmod(tmp, 0o600);
  await rename(tmp, path);
}
