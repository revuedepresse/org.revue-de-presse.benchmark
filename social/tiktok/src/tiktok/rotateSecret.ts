import { execa } from 'execa';
import { rewriteEnvLine } from './rewriteEnvLine.ts';
import { TikTokRotateError } from './types.ts';

export interface PersistOpts {
  envFilePath?: string;
  pat?: string;
}

export async function persistRefreshToken(
  newValue: string,
  opts: PersistOpts = {},
): Promise<void> {
  if (process.env.GITHUB_ACTIONS === 'true') {
    const repo = process.env.GITHUB_REPOSITORY;
    if (!repo) {
      throw new TikTokRotateError('GITHUB_REPOSITORY is not set in CI');
    }
    if (!opts.pat) {
      throw new TikTokRotateError('TIKTOK_SECRET_ROTATOR_PAT (PAT) is not set');
    }
    try {
      await execa(
        'gh',
        ['secret', 'set', 'TIKTOK_REFRESH_TOKEN', '-R', repo, '-b', newValue],
        { env: { ...process.env, GH_TOKEN: opts.pat } },
      );
    } catch (e) {
      throw new TikTokRotateError(`gh secret set failed: ${(e as Error).message}`);
    }
    return;
  }
  const path = opts.envFilePath ?? 'social/tiktok/.env.local';
  await rewriteEnvLine(path, 'TIKTOK_REFRESH_TOKEN', newValue);
}
