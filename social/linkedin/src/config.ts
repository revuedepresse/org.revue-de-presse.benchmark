import dotenv from 'dotenv';
import type { Config } from './types.ts';

dotenv.config({ path: '.env.local' });

const BASE_REQUIRED_KEYS = [
  'LINKEDIN_CLIENT_ID',
  'LINKEDIN_CLIENT_SECRET',
  'LINKEDIN_REDIRECT_URI',
  'API_BASE_URL',
  'API_CLIENT_SECRET',
] as const;

const FILE_MODE_KEYS = ['LINKEDIN_TOKEN_FILE', 'LINKEDIN_STATE_FILE'] as const;

export class ConfigError extends Error {
  constructor(public readonly missing: string[]) {
    super(`Missing required env vars: ${missing.join(', ')}`);
    this.name = 'ConfigError';
  }
}

export function loadConfig(): Config {
  const refreshTokenEnv = process.env.LINKEDIN_REFRESH_TOKEN ?? null;
  const required = [
    ...BASE_REQUIRED_KEYS,
    ...(refreshTokenEnv ? [] : FILE_MODE_KEYS),
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new ConfigError(missing);
  }

  return {
    linkedinClientId: process.env.LINKEDIN_CLIENT_ID!,
    linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    linkedinRedirectUri: process.env.LINKEDIN_REDIRECT_URI!,
    linkedinOrganizationUrn:
      process.env.LINKEDIN_ORGANIZATION_URN ?? 'urn:li:organization:75720423',
    linkedinVersion: process.env.LINKEDIN_VERSION ?? '202605',
    linkedinTokenFile: process.env.LINKEDIN_TOKEN_FILE ?? './.linkedin-token.json',
    linkedinStateFile: process.env.LINKEDIN_STATE_FILE ?? './.linkedin-state.json',
    linkedinRefreshTokenEnv: refreshTokenEnv,
    linkedinRotatedRefreshTokenFile:
      process.env.LINKEDIN_ROTATED_REFRESH_TOKEN_FILE ?? null,
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
