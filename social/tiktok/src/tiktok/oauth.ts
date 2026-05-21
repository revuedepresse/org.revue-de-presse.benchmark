import { TIKTOK } from './endpoints.ts';
import {
  TokenResponseSchema,
  TikTokAuthError,
  TikTokClientCredentialsError,
} from './types.ts';

export interface OauthEnv {
  TIKTOK_CLIENT_KEY: string;
  TIKTOK_CLIENT_SECRET: string;
  TIKTOK_REFRESH_TOKEN: string;
}

export async function refreshAccessToken(env: OauthEnv): Promise<{
  accessToken: string;
  newRefreshToken: string;
  expiresInSec: number;
}> {
  const res = await fetch(TIKTOK.oauthToken, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    body: new URLSearchParams({
      client_key:    env.TIKTOK_CLIENT_KEY,
      client_secret: env.TIKTOK_CLIENT_SECRET,
      grant_type:    'refresh_token',
      refresh_token: env.TIKTOK_REFRESH_TOKEN,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    const lowered = text.toLowerCase();
    if (lowered.includes('invalid_client') || res.status === 400) {
      throw new TikTokClientCredentialsError(
        `TikTok rejected client credentials: ${res.status} ${text}`,
      );
    }
    throw new TikTokAuthError(`TikTok refresh failed: ${res.status} ${text}`);
  }
  const json = TokenResponseSchema.parse(JSON.parse(text));
  return {
    accessToken:     json.access_token,
    newRefreshToken: json.refresh_token,
    expiresInSec:    json.expires_in,
  };
}
