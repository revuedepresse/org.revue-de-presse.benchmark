import dotenv from 'dotenv';
import type { Config } from './types.ts';

dotenv.config({ path: '.env.local' });

const REQUIRED_KEYS = [
  'LINKEDIN_CLIENT_ID',
  'LINKEDIN_CLIENT_SECRET',
  'LINKEDIN_REDIRECT_URI',
  'LINKEDIN_TOKEN_FILE',
  'LINKEDIN_STATE_FILE',
  'API_BASE_URL',
  'API_CLIENT_SECRET',
] as const;

export class ConfigError extends Error {
  constructor(public readonly missing: string[]) {
    super(`Missing required env vars: ${missing.join(', ')}`);
    this.name = 'ConfigError';
  }
}

export function loadConfig(): Config {
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new ConfigError([...missing]);
  }

  return {
    linkedinClientId: process.env.LINKEDIN_CLIENT_ID!,
    linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    linkedinRedirectUri: process.env.LINKEDIN_REDIRECT_URI!,
    linkedinOrganizationUrn:
      process.env.LINKEDIN_ORGANIZATION_URN ?? 'urn:li:organization:75720423',
    linkedinVersion: process.env.LINKEDIN_VERSION ?? '202505',
    linkedinTokenFile: process.env.LINKEDIN_TOKEN_FILE!,
    linkedinStateFile: process.env.LINKEDIN_STATE_FILE!,
    apiBaseUrl: process.env.API_BASE_URL!,
    apiClientSecret: process.env.API_CLIENT_SECRET!,
    logLevel: process.env.LOG_LEVEL ?? 'info',
    tz: process.env.TZ ?? 'Europe/Paris',
  };
}
