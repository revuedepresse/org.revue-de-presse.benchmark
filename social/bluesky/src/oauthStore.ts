import { readFile, writeFile, rename, chmod } from 'node:fs/promises';

export type SimpleStore<T> = {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T): Promise<void>;
  del(key: string): Promise<void>;
};

type FileBacking = Record<string, unknown>;

async function readJson(path: string): Promise<FileBacking> {
  try {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw) as FileBacking;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return {};
    throw err;
  }
}

async function writeJsonAtomic(path: string, value: FileBacking, mode = 0o600): Promise<void> {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, JSON.stringify(value, null, 2), { mode });
  await chmod(tmp, mode);
  await rename(tmp, path);
}

function createFileStore<T>(path: string, mode: number): SimpleStore<T> {
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
      delete data[key];
      await writeJsonAtomic(path, data, mode);
    },
  };
}

export function createFileSessionStore<T = unknown>(path: string): SimpleStore<T> {
  return createFileStore<T>(path, 0o600);
}

export function createFileStateStore<T = unknown>(path: string): SimpleStore<T> {
  return createFileStore<T>(path, 0o600);
}

export type EnvSessionStore<T = unknown> = SimpleStore<T> & {
  lastSet?: { did: string; value: T };
};

export function createEnvSessionStore<T = unknown>(b64: string): EnvSessionStore<T> {
  let initial: { did: string; session: T };
  try {
    const json = Buffer.from(b64, 'base64').toString('utf8');
    initial = JSON.parse(json) as { did: string; session: T };
    if (typeof initial.did !== 'string' || initial.session == null) {
      throw new Error('missing did or session');
    }
  } catch (err) {
    throw new Error(`BLUESKY_OAUTH_SESSION is not valid base64-encoded JSON: ${(err as Error).message}`);
  }
  const memory = new Map<string, T>();
  memory.set(initial.did, initial.session);
  const store: EnvSessionStore<T> = {
    async get(key) {
      return memory.get(key);
    },
    async set(key, value) {
      memory.set(key, value);
      store.lastSet = { did: key, value };
    },
    async del(key) {
      memory.delete(key);
    },
  };
  return store;
}
