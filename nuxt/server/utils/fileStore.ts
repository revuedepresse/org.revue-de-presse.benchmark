import { mkdir, readFile, rename, writeFile, chmod, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';

/**
 * Tiny atomic JSON-keyed file store. One file holds a single Record.
 * Used for the Bluesky OAuth session + state stores and for the
 * app's own opaque-session-id → DID map. Suitable for dev and
 * single-instance production. Swap for Redis if/when the API host
 * runs more than one Nuxt instance.
 */
export type FileStore<T> = {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T): Promise<void>;
  del(key: string): Promise<void>;
};

type Backing = Record<string, unknown>;

async function readJson(path: string): Promise<Backing> {
  try {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw) as Backing;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return {};
    throw err;
  }
}

async function writeJsonAtomic(path: string, value: Backing, mode = 0o600): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const tmp = `${path}.tmp`;
  await writeFile(tmp, JSON.stringify(value, null, 2), { mode });
  await chmod(tmp, mode);
  await rename(tmp, path);
}

export function createFileStore<T>(path: string, mode = 0o600): FileStore<T> {
  return {
    async get(key) {
      const data = await readJson(path);
      return data[key] as T | undefined;
    },
    async set(key, value) {
      const data = await readJson(path);
      data[key] = value;
      await writeJsonAtomic(path, data, mode);
    },
    async del(key) {
      const data = await readJson(path);
      if (!(key in data)) return;
      delete data[key];
      if (Object.keys(data).length === 0) {
        try {
          await unlink(path);
        } catch (err) {
          if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
        }
        return;
      }
      await writeJsonAtomic(path, data, mode);
    },
  };
}

/** Resolve a relative `./.session-store` to an absolute path under cwd. */
export function resolveStoreDir(rel: string): string {
  if (rel.startsWith('/')) return rel;
  return join(process.cwd(), rel);
}
