import { describe, expect, it } from 'vitest';
import {
  expiryStatus,
  sessionLifetimeMs,
  SESSION_LIFETIME_CONFIDENTIAL_MS,
  SESSION_LIFETIME_PUBLIC_MS,
} from '../src/sessionLifetime.ts';

const DAY = 24 * 60 * 60 * 1000;

describe('sessionLifetimeMs', () => {
  it('mirrors the atproto oauth-provider constants', () => {
    // SESSION_LIFETIME = 2 weeks, SESSION_LIFETIME_EXTENDED = 2 years.
    expect(SESSION_LIFETIME_PUBLIC_MS).toBe(14 * DAY);
    expect(SESSION_LIFETIME_CONFIDENTIAL_MS).toBe(730 * DAY);
    expect(sessionLifetimeMs(false)).toBe(SESSION_LIFETIME_PUBLIC_MS);
    expect(sessionLifetimeMs(true)).toBe(SESSION_LIFETIME_CONFIDENTIAL_MS);
  });
});

describe('expiryStatus', () => {
  it('reproduces the June 2026 public-client outage', () => {
    // Bootstrapped 2026-05-23 18:39; the 2026-06-06 05:30 run still worked and
    // the 2026-06-07 05:30 run got invalid_grant / "Session expired".
    const bootstrappedAt = new Date('2026-05-23T18:39:00Z');
    expect(expiryStatus(bootstrappedAt, false, new Date('2026-06-06T05:30:00Z')).expired).toBe(false);
    expect(expiryStatus(bootstrappedAt, false, new Date('2026-06-07T05:30:00Z')).expired).toBe(true);
  });

  it('gives a confidential client two years from the same bootstrap', () => {
    const bootstrappedAt = new Date('2026-05-23T18:39:00Z');
    const status = expiryStatus(bootstrappedAt, true, new Date('2026-06-07T05:30:00Z'));
    expect(status.expired).toBe(false);
    expect(status.shouldWarn).toBe(false);
    expect(status.daysRemaining).toBe(715);
  });

  it('warns inside the final fortnight but not before it', () => {
    const bootstrappedAt = new Date('2026-01-01T00:00:00Z');
    const expires = new Date(bootstrappedAt.getTime() + SESSION_LIFETIME_CONFIDENTIAL_MS);

    const before = new Date(expires.getTime() - 15 * DAY);
    expect(expiryStatus(bootstrappedAt, true, before).shouldWarn).toBe(false);

    const inside = new Date(expires.getTime() - 13 * DAY);
    expect(expiryStatus(bootstrappedAt, true, inside).shouldWarn).toBe(true);
    expect(expiryStatus(bootstrappedAt, true, inside).expired).toBe(false);
  });

  it('counts days remaining towards zero so "0" means today', () => {
    const bootstrappedAt = new Date('2026-01-01T00:00:00Z');
    const expires = new Date(bootstrappedAt.getTime() + SESSION_LIFETIME_PUBLIC_MS);
    const almost = new Date(expires.getTime() - 6 * 60 * 60 * 1000);
    expect(expiryStatus(bootstrappedAt, false, almost).daysRemaining).toBe(0);
  });
});
