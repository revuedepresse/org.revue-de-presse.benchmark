const ENDPOINT = 'https://api.pwnedpasswords.com/range/';

export type BreachResult =
  | { breached: true; count: number }
  | { breached: false }
  | { error: 'fetch-failed' };

export async function isBreached(value: string, signal?: AbortSignal): Promise<BreachResult> {
  try {
    const fullHashHex = await fullSha1Hex(value);
    const prefix = fullHashHex.slice(0, 5).toUpperCase();
    const suffix = fullHashHex.slice(5).toUpperCase();
    const response = await fetch(`${ENDPOINT}${prefix}`, {
      headers: { 'Add-Padding': 'true' },
      signal,
    });
    if (!response.ok) return { error: 'fetch-failed' };
    const body = await response.text();
    for (const line of body.split(/\r?\n/)) {
      const [hashSuffix, rawCount] = line.split(':');
      if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
        return { breached: true, count: parseInt(rawCount ?? '0', 10) };
      }
    }
    return { breached: false };
  } catch {
    return { error: 'fetch-failed' };
  }
}

async function fullSha1Hex(value: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
