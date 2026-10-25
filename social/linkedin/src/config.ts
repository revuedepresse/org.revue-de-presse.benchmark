import dotenv from 'dotenv';
import { PUBLISHER_LISTS, type Config, type PublisherList } from './types.ts';

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
  constructor(public readonly missing: string[], message?: string) {
    super(message ?? `Missing required env vars: ${missing.join(', ')}`);
    this.name = 'ConfigError';
  }
}

// French media only unless LINKEDIN_PUBLISH_LISTS names others, e.g.
// "fr,coop-medias": the Coop Médias post is ready but off by default.
function publishLists(raw: string | undefined): PublisherList[] {
  const names = (raw ?? 'fr').split(',').map((s) => s.trim()).filter(Boolean);
  const unknown = names.filter((n) => !PUBLISHER_LISTS.includes(n as PublisherList));
  if (unknown.length > 0 || names.length === 0) {
    throw new ConfigError([], `LINKEDIN_PUBLISH_LISTS names unknown lists: ${unknown.join(', ') || '(none)'}; known: ${PUBLISHER_LISTS.join(', ')}`);
  }
  return [...new Set(names)] as PublisherList[];
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
      'https://play.google.com/store/apps/details?id=org.revue_2_presse&hl=fr',
    postHashtag: process.env.POST_HASHTAG ?? '#RevueDePresse',
    blueskyPublicApiUrl: process.env.BLUESKY_PUBLIC_API_URL ?? 'https://public.api.bsky.app',
    publishLists: publishLists(process.env.LINKEDIN_PUBLISH_LISTS),
    newsletterUrls: {
      fr: process.env.NEWSLETTER_URL_FR ?? 'https://revue-de-presse.org/lettre-quotidienne',
      'coop-medias':
        process.env.NEWSLETTER_URL_COOP_MEDIAS ??
        'https://revue-de-presse.org/lettre-quotidienne-coop-medias',
    },
  };
}
