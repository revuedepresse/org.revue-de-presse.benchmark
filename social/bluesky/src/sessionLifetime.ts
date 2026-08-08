import { readFile, writeFile, chmod, rename } from 'node:fs/promises';

/**
 * atproto puts a hard ceiling on how long an OAuth session may live, no matter
 * how diligently it is refreshed. The values mirror
 * @atproto/oauth-provider's oauth-constants.ts:
 *
 *   SESSION_LIFETIME          = 1_209_600_000 ms  (2 weeks)   public client
 *   SESSION_LIFETIME_EXTENDED = 63_072_000_000 ms (2 years)   confidential client
 *
 * The ceiling is not discoverable from the session blob — a refresh token is an
 * opaque string, not a JWT — so the only way to warn ahead of time is to record
 * when the session was bootstrapped and count forward. That is what the
 * `<session-file>.bootstrapped-at` sidecar is for.
 */
export const SESSION_LIFETIME_PUBLIC_MS = 1_209_600_000;
export const SESSION_LIFETIME_CONFIDENTIAL_MS = 63_072_000_000;

/** How far ahead of the ceiling to start warning. */
export const EXPIRY_WARNING_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

export function sessionLifetimeMs(confidential: boolean): number {
  return confidential ? SESSION_LIFETIME_CONFIDENTIAL_MS : SESSION_LIFETIME_PUBLIC_MS;
}

export function bootstrappedAtPath(sessionFile: string): string {
  return `${sessionFile}.bootstrapped-at`;
}

export async function writeBootstrappedAt(sessionFile: string, iso: string): Promise<void> {
  const path = bootstrappedAtPath(sessionFile);
  const tmp = `${path}.tmp`;
  await writeFile(tmp, `${iso}\n`, { mode: 0o600 });
  await chmod(tmp, 0o600);
  await rename(tmp, path);
}

export async function readBootstrappedAt(sessionFile: string): Promise<Date | null> {
  try {
    const raw = (await readFile(bootstrappedAtPath(sessionFile), 'utf8')).trim();
    const at = new Date(raw);
    return Number.isNaN(at.getTime()) ? null : at;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

export type ExpiryStatus = {
  expiresAt: Date;
  msRemaining: number;
  daysRemaining: number;
  shouldWarn: boolean;
  expired: boolean;
};

export function expiryStatus(
  bootstrappedAt: Date,
  confidential: boolean,
  now: Date = new Date(),
): ExpiryStatus {
  const expiresAt = new Date(bootstrappedAt.getTime() + sessionLifetimeMs(confidential));
  const msRemaining = expiresAt.getTime() - now.getTime();
  return {
    expiresAt,
    msRemaining,
    // Round towards zero so "0 days remaining" means "today", not "tomorrow".
    daysRemaining: Math.floor(msRemaining / (24 * 60 * 60 * 1000)),
    shouldWarn: msRemaining <= EXPIRY_WARNING_WINDOW_MS,
    expired: msRemaining <= 0,
  };
}
