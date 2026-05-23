import type { Config } from './types.ts';

const BASE_REQUIRED_KEYS = [
  'BLUESKY_HANDLE',
  'BLUESKY_CLIENT_METADATA_URL',
  'BLUESKY_REDIRECT_URI',
  'API_BASE_URL',
  'API_CLIENT_SECRET',
] as const;

const FILE_MODE_KEYS = ['BLUESKY_SESSION_FILE', 'BLUESKY_STATE_FILE'] as const;

export class ConfigError extends Error {
  constructor(public readonly missing: string[]) {
    super(`Missing required env vars: ${missing.join(', ')}`);
    this.name = 'ConfigError';
  }
}

export function loadConfig(): Config {
  const oauthSessionEnv = process.env.BLUESKY_OAUTH_SESSION ?? null;
  const required = [
    ...BASE_REQUIRED_KEYS,
    ...(oauthSessionEnv ? [] : FILE_MODE_KEYS),
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) throw new ConfigError(missing);

  return {
    blueskyHandle: process.env.BLUESKY_HANDLE!,
    blueskyClientMetadataUrl: process.env.BLUESKY_CLIENT_METADATA_URL!,
    blueskyRedirectUri: process.env.BLUESKY_REDIRECT_URI!,
    blueskyPdsUrl: process.env.BLUESKY_PDS_URL ?? 'https://bsky.social',
    blueskySessionFile: process.env.BLUESKY_SESSION_FILE ?? './.bluesky-session.json',
    blueskyStateFile: process.env.BLUESKY_STATE_FILE ?? './.bluesky-state.json',
    blueskyOauthSessionEnv: oauthSessionEnv,
    blueskyRotatedSessionFile: process.env.BLUESKY_ROTATED_SESSION_FILE ?? null,
    apiBaseUrl: process.env.API_BASE_URL!,
    apiClientSecret: process.env.API_CLIENT_SECRET!,
    logLevel: process.env.LOG_LEVEL ?? 'info',
    tz: process.env.TZ ?? 'Europe/Paris',
    postFooterUrl:
      process.env.POST_FOOTER_URL ??
      'https://play.google.com/store/apps/details?id=org.revue_2_presse',
    postHashtag: process.env.POST_HASHTAG ?? '#RevueDePresse',
  };
}
