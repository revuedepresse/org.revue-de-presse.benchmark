import { open, stat, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';

/**
 * atproto refresh tokens are single-use: the PDS invalidates the old one the
 * moment it issues a replacement. Two processes refreshing the same session
 * concurrently therefore race, and the loser holds a token the server has
 * already retired — which @atproto/oauth-client turns into a TokenRefreshError
 * and then *deletes the stored session*, requiring a human to re-authorise.
 *
 * Without a `requestLock` the library prints "No lock mechanism provided.
 * Credentials might get revoked." and falls back to a 1-second sleep-and-recheck
 * heuristic. A real lock removes the race instead of narrowing it.
 *
 * This is a plain advisory file lock: exclusive create (`wx`) is atomic on
 * POSIX and on Windows, so whoever creates the file owns the lock.
 */

export type LockOptions = {
  /** Directory the lock files live in. Defaults to the session file's directory. */
  dir: string;
  /** Give up waiting after this long and throw. */
  timeoutMs?: number;
  /** Treat a lock file older than this as abandoned by a crashed process. */
  staleMs?: number;
  /** Poll interval while waiting. */
  pollMs?: number;
};

export class LockTimeoutError extends Error {
  constructor(name: string, timeoutMs: number) {
    super(`Timed out after ${timeoutMs}ms waiting for lock "${name}"`);
    this.name = 'LockTimeoutError';
  }
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Lock names come from the library as `@atproto-oauth-client-did:plc:…`. */
export function lockFileName(name: string): string {
  return `.lock-${name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
}

export function createRequestLock(opts: LockOptions) {
  const timeoutMs = opts.timeoutMs ?? 30_000;
  // The library already caps a refresh at 30s, so anything older than a minute
  // belongs to a process that died holding the lock.
  const staleMs = opts.staleMs ?? 60_000;
  const pollMs = opts.pollMs ?? 100;

  return async function requestLock<T>(name: string, fn: () => T | PromiseLike<T>): Promise<T> {
    const path = join(opts.dir, lockFileName(name));
    const deadline = Date.now() + timeoutMs;

    for (;;) {
      try {
        const handle = await open(path, 'wx', 0o600);
        try {
          await handle.writeFile(`${process.pid}\n`, 'utf8');
        } finally {
          await handle.close();
        }
        try {
          return await fn();
        } finally {
          // Best effort: a failed unlink would otherwise mask fn()'s result,
          // and the staleness sweep above reclaims it on the next run.
          await unlink(path).catch(() => {});
        }
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== 'EEXIST') throw err;

        const info = await stat(path).catch(() => null);
        if (info && Date.now() - info.mtimeMs > staleMs) {
          await unlink(path).catch(() => {});
          continue;
        }

        if (Date.now() >= deadline) throw new LockTimeoutError(name, timeoutMs);
        await sleep(pollMs);
      }
    }
  };
}

/** Lock files sit beside the session file they guard. */
export function lockDirForSessionFile(sessionFile: string): string {
  return dirname(sessionFile) || '.';
}
