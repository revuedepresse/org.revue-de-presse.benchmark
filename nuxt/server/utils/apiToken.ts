type CachedToken = { value: string; expiresAt: number };

let cached: CachedToken | null = null;
let inFlight: Promise<CachedToken> | null = null;

const REFRESH_LEAD_MS = 60_000;
const MINT_PATH = '/api/token';

export async function getApiToken(): Promise<string> {
  const now = Date.now();
  if (cached && cached.expiresAt - REFRESH_LEAD_MS > now) {
    return cached.value;
  }
  if (inFlight) {
    return (await inFlight).value;
  }

  inFlight = mintToken().finally(() => {
    inFlight = null;
  });
  cached = await inFlight;
  return cached.value;
}

export async function refreshApiToken(): Promise<string> {
  cached = null;
  return getApiToken();
}

// Test-only hook to clear module state between specs.
export function __resetApiTokenForTesting(): void {
  cached = null;
  inFlight = null;
}

async function mintToken(): Promise<CachedToken> {
  // @ts-expect-error — provided by Nitro at runtime; under test, stubbed on globalThis
  const config = useRuntimeConfig();
  const base = config.apiBaseUrl as string;
  const secret = config.apiClientSecret as string;
  if (!base || !secret) {
    throw new Error('NUXT_API_BASE_URL or NUXT_API_CLIENT_SECRET not configured');
  }

  const authHeader = 'Basic ' + Buffer.from(':' + secret).toString('base64');
  const url = new URL(MINT_PATH, base);

  // @ts-expect-error — provided by Nitro at runtime; under test, stubbed on globalThis
  const response = await $fetch<{ access_token: string; token_type: string; expires_in: number }>(
    url.toString(),
    {
      method: 'POST',
      headers: { authorization: authHeader, accept: 'application/json' },
    },
  );

  if (response.token_type !== 'Bearer' || !response.access_token) {
    throw new Error('Malformed token response from upstream');
  }

  return {
    value: response.access_token,
    expiresAt: Date.now() + response.expires_in * 1000,
  };
}
