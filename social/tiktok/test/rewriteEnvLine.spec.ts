import { describe, expect, it, beforeEach } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rewriteEnvLine } from '../src/tiktok/rewriteEnvLine.ts';

describe('rewriteEnvLine', () => {
  let dir: string;
  let path: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'rewrite-env-'));
    path = join(dir, '.env.local');
  });

  it('replaces an existing key in place, preserving surrounding lines', async () => {
    writeFileSync(path, [
      'TIKTOK_CLIENT_KEY=ck',
      'TIKTOK_REFRESH_TOKEN=old',
      'PUBLISH_MODE=inbox',
    ].join('\n') + '\n');

    await rewriteEnvLine(path, 'TIKTOK_REFRESH_TOKEN', 'new');

    expect(readFileSync(path, 'utf-8')).toBe([
      'TIKTOK_CLIENT_KEY=ck',
      'TIKTOK_REFRESH_TOKEN=new',
      'PUBLISH_MODE=inbox',
    ].join('\n') + '\n');
  });

  it('appends the key if missing, preserving trailing newline', async () => {
    writeFileSync(path, 'TIKTOK_CLIENT_KEY=ck\n');
    await rewriteEnvLine(path, 'TIKTOK_REFRESH_TOKEN', 'new');
    expect(readFileSync(path, 'utf-8')).toBe('TIKTOK_CLIENT_KEY=ck\nTIKTOK_REFRESH_TOKEN=new\n');
  });

  it('appends a leading newline if the file has none', async () => {
    writeFileSync(path, 'TIKTOK_CLIENT_KEY=ck');
    await rewriteEnvLine(path, 'TIKTOK_REFRESH_TOKEN', 'new');
    expect(readFileSync(path, 'utf-8')).toBe('TIKTOK_CLIENT_KEY=ck\nTIKTOK_REFRESH_TOKEN=new\n');
  });

  it('creates the file if missing', async () => {
    rmSync(path, { force: true });
    await rewriteEnvLine(path, 'TIKTOK_REFRESH_TOKEN', 'new');
    expect(readFileSync(path, 'utf-8')).toBe('TIKTOK_REFRESH_TOKEN=new\n');
  });

  it('safely handles regex-significant characters in the key', async () => {
    writeFileSync(path, 'A.B=1\n');
    await rewriteEnvLine(path, 'A.B', '2');
    expect(readFileSync(path, 'utf-8')).toBe('A.B=2\n');
  });
});
