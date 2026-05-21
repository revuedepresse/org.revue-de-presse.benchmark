import { describe, expect, it, beforeEach } from 'vitest';
import { mkdtempSync, statSync, writeFileSync, readFileSync, accessSync, constants } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readTokenFile, writeTokenFile, TokenFileError } from '../src/tokenStore.ts';
import type { TokenFile } from '../src/types.ts';

let dir: string;
let path: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'rdp-linkedin-token-'));
  path = join(dir, 'token.json');
});

const SAMPLE: TokenFile = {
  access_token: 'a',
  access_token_expires_at: 1716300000000,
  refresh_token: 'r',
  refresh_token_expires_at: 1747836000000,
  rotated_at: 1716200000000,
};

describe('tokenStore', () => {
  it('round-trips a write then read', async () => {
    await writeTokenFile(path, SAMPLE);
    const read = await readTokenFile(path);
    expect(read).toEqual(SAMPLE);
  });

  it('writes the file with mode 0600', async () => {
    await writeTokenFile(path, SAMPLE);
    const mode = statSync(path).mode & 0o777;
    expect(mode).toBe(0o600);
  });

  it('returns null for a missing file', async () => {
    const read = await readTokenFile(join(dir, 'does-not-exist.json'));
    expect(read).toBeNull();
  });

  it('throws TokenFileError on malformed JSON', async () => {
    writeFileSync(path, 'not json{');
    await expect(readTokenFile(path)).rejects.toBeInstanceOf(TokenFileError);
  });

  it('writes atomically via .tmp + rename (no .tmp left behind)', async () => {
    await writeTokenFile(path, SAMPLE);
    expect(() => accessSync(`${path}.tmp`, constants.F_OK)).toThrow();
    expect(JSON.parse(readFileSync(path, 'utf8'))).toEqual(SAMPLE);
  });
});
