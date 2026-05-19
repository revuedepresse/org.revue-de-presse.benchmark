// Module-level in-memory cache for the upstream Bearer token. Resets on
// serverless cold start — same behaviour as the Nitro version this was
// ported from. If cold-start cost ever matters, move the cache off-instance
// (Redis / Vercel KV / Netlify Blobs).

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

export function __resetApiTokenForTesting(): void {
  cached = null;
  inFlight = null;
}

async function mintToken(): Promise<CachedToken> {
  const base = process.env.API_BASE_URL;
  const secret = process.env.API_CLIENT_SECRET;
  if (!base || !secret) {
    throw new Error('API_BASE_URL or API_CLIENT_SECRET not configured');
  }

  const authHeader = 'Basic ' + Buffer.from(':' + secret).toString('base64');
  const url = new URL(MINT_PATH, base);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { authorization: authHeader, accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Token mint failed: ${response.status}`);
  }

  const body = (await response.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
  };

  if (body.token_type !== 'Bearer' || !body.access_token) {
    throw new Error('Malformed token response from upstream');
  }

  return {
    value: body.access_token,
    expiresAt: Date.now() + body.expires_in * 1000,
  };
}
