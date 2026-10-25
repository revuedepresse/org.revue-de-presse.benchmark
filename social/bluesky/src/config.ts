import { PUBLISHER_LISTS, type Config, type PublisherList } from './types.ts';

const BASE_REQUIRED_KEYS = [
  'BLUESKY_HANDLE',
  'BLUESKY_CLIENT_METADATA_URL',
  'BLUESKY_REDIRECT_URI',
  'API_BASE_URL',
  'API_CLIENT_SECRET',
] as const;

const FILE_MODE_KEYS = ['BLUESKY_SESSION_FILE', 'BLUESKY_STATE_FILE'] as const;

export class ConfigError extends Error {
  constructor(public readonly missing: string[], message?: string) {
    super(message ?? `Missing required env vars: ${missing.join(', ')}`);
    this.name = 'ConfigError';
  }
}

// French media only unless BLUESKY_PUBLISH_LISTS names others, e.g.
// "fr,coop-medias": the Coop Médias thread is ready but off by default.
function publishLists(raw: string | undefined): PublisherList[] {
  const names = (raw ?? 'fr').split(',').map((s) => s.trim()).filter(Boolean);
  const unknown = names.filter((n) => !PUBLISHER_LISTS.includes(n as PublisherList));
  if (unknown.length > 0 || names.length === 0) {
    throw new ConfigError([], `BLUESKY_PUBLISH_LISTS names unknown lists: ${unknown.join(', ') || '(none)'}; known: ${PUBLISHER_LISTS.join(', ')}`);
  }
  return [...new Set(names)] as PublisherList[];
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
    blueskyRotatedStateFile: process.env.BLUESKY_ROTATED_STATE_FILE ?? null,
    blueskyPrivateJwk: process.env.BLUESKY_PRIVATE_JWK || null,
    blueskyJwksUri: process.env.BLUESKY_JWKS_URI || null,
    apiBaseUrl: process.env.API_BASE_URL!,
    apiClientSecret: process.env.API_CLIENT_SECRET!,
    logLevel: process.env.LOG_LEVEL ?? 'info',
    tz: process.env.TZ ?? 'Europe/Paris',
    postFooterUrl:
      process.env.POST_FOOTER_URL ??
      'https://play.google.com/store/apps/details?id=org.revue_2_presse',
    postHashtag: process.env.POST_HASHTAG ?? '#RevueDePresse',
    publishLists: publishLists(process.env.BLUESKY_PUBLISH_LISTS),
    newsletterUrls: {
      fr: process.env.NEWSLETTER_URL ?? 'https://revue-de-presse.org/lettre-quotidienne',
      'coop-medias':
        process.env.NEWSLETTER_URL_COOP_MEDIAS ?? 'https://revue-de-presse.org/lettre-quotidienne-coop-medias',
    },
  };
}
