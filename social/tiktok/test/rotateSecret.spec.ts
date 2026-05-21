import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const { execaMock } = vi.hoisted(() => ({ execaMock: vi.fn() }));
vi.mock('execa', () => ({ execa: execaMock }));

import { persistRefreshToken } from '../src/tiktok/rotateSecret.ts';

describe('persistRefreshToken', () => {
  beforeEach(() => {
    execaMock.mockReset();
    vi.unstubAllEnvs();
  });

  it('rewrites the local .env.local when not in GH Actions', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'rot-'));
    const envFile = join(dir, '.env.local');
    writeFileSync(envFile, 'TIKTOK_REFRESH_TOKEN=old\n');

    vi.stubEnv('GITHUB_ACTIONS', '');

    await persistRefreshToken('new', { envFilePath: envFile });
    expect(readFileSync(envFile, 'utf-8')).toBe('TIKTOK_REFRESH_TOKEN=new\n');
    expect(execaMock).not.toHaveBeenCalled();
  });

  it('calls gh secret set when in GH Actions, with PAT in GH_TOKEN', async () => {
    vi.stubEnv('GITHUB_ACTIONS', 'true');
    vi.stubEnv('GITHUB_REPOSITORY', 'org/repo');
    execaMock.mockResolvedValue({ exitCode: 0 });

    await persistRefreshToken('new', { pat: 'pat-123' });

    expect(execaMock).toHaveBeenCalledOnce();
    const [bin, args, opts] = execaMock.mock.calls[0];
    expect(bin).toBe('gh');
    expect(args).toEqual([
      'secret', 'set', 'TIKTOK_REFRESH_TOKEN',
      '-R', 'org/repo', '-b', 'new',
    ]);
    expect((opts as { env: Record<string, string> }).env.GH_TOKEN).toBe('pat-123');
  });

  it('throws TikTokRotateError in CI without GITHUB_REPOSITORY', async () => {
    vi.stubEnv('GITHUB_ACTIONS', 'true');
    vi.stubEnv('GITHUB_REPOSITORY', '');
    await expect(persistRefreshToken('new', { pat: 'pat-123' })).rejects.toThrow(/GITHUB_REPOSITORY/);
  });

  it('throws TikTokRotateError in CI without PAT', async () => {
    vi.stubEnv('GITHUB_ACTIONS', 'true');
    vi.stubEnv('GITHUB_REPOSITORY', 'org/repo');
    await expect(persistRefreshToken('new', {})).rejects.toThrow(/PAT/);
  });
});
