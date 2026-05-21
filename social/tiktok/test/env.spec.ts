import { describe, expect, it, beforeEach, vi } from 'vitest';
import { loadEnv } from '../src/env.ts';

const baseEnv = {
  TIKTOK_CLIENT_KEY: 'ck',
  TIKTOK_CLIENT_SECRET: 'cs',
  TIKTOK_REFRESH_TOKEN: 'rt',
  API_BASE_URL: 'https://api.revue-de-presse.org',
  API_CLIENT_SECRET: 'apisec',
  NUXT_CAPTURE_URL: 'https://revue-de-presse.org',
  PUBLISH_MODE: 'inbox',
};

function stubAll(overrides: Record<string, string | undefined> = {}): void {
  const merged: Record<string, string | undefined> = { ...baseEnv, ...overrides };
  for (const [k, v] of Object.entries(merged)) {
    if (v === undefined) vi.stubEnv(k, '');
    else vi.stubEnv(k, v);
  }
}

describe('loadEnv', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('parses every required key with defaults applied', () => {
    stubAll();
    const env = loadEnv();
    expect(env.TIKTOK_CLIENT_KEY).toBe('ck');
    expect(env.PUBLISH_MODE).toBe('inbox');
    expect(env.NUXT_CAPTURE_URL).toBe('https://revue-de-presse.org');
    expect(env.API_BASE_URL).toBe('https://api.revue-de-presse.org');
    expect(env.API_CLIENT_SECRET).toBe('apisec');
    expect(env.DRY_RUN).toBe(false);
    expect(env.TIKTOK_SECRET_ROTATOR_PAT).toBeUndefined();
    expect(env.DATE_OVERRIDE).toBeUndefined();
    expect(env.LOG_LEVEL).toBe('info');
    expect(env.TZ).toBe('Europe/Paris');
  });

  it('throws when TIKTOK_REFRESH_TOKEN is empty', () => {
    stubAll({ TIKTOK_REFRESH_TOKEN: '' });
    expect(() => loadEnv()).toThrow(/TIKTOK_REFRESH_TOKEN/);
  });

  it('throws when API_CLIENT_SECRET is empty', () => {
    stubAll({ API_CLIENT_SECRET: '' });
    expect(() => loadEnv()).toThrow(/API_CLIENT_SECRET/);
  });

  it('rejects PUBLISH_MODE other than inbox or direct', () => {
    stubAll({ PUBLISH_MODE: 'draft' });
    expect(() => loadEnv()).toThrow(/PUBLISH_MODE/);
  });

  it('accepts PUBLISH_MODE=direct', () => {
    stubAll({ PUBLISH_MODE: 'direct' });
    expect(loadEnv().PUBLISH_MODE).toBe('direct');
  });

  it('coerces DRY_RUN=true', () => {
    stubAll({ DRY_RUN: 'true' });
    expect(loadEnv().DRY_RUN).toBe(true);
  });

  it('rejects DATE_OVERRIDE not matching YYYY-MM-DD', () => {
    stubAll({ DATE_OVERRIDE: '2026/05/21' });
    expect(() => loadEnv()).toThrow(/DATE_OVERRIDE/);
  });

  it('accepts DATE_OVERRIDE=2026-05-21', () => {
    stubAll({ DATE_OVERRIDE: '2026-05-21' });
    expect(loadEnv().DATE_OVERRIDE).toBe('2026-05-21');
  });

  it('TIKTOK_SECRET_ROTATOR_PAT is optional', () => {
    stubAll({ TIKTOK_SECRET_ROTATOR_PAT: 'pat-xyz' });
    expect(loadEnv().TIKTOK_SECRET_ROTATOR_PAT).toBe('pat-xyz');
  });

  it('empty NUXT_CAPTURE_URL falls back to default', () => {
    stubAll({ NUXT_CAPTURE_URL: '' });
    expect(loadEnv().NUXT_CAPTURE_URL).toBe('https://revue-de-presse.org');
  });

  it('empty API_BASE_URL falls back to default', () => {
    stubAll({ API_BASE_URL: '' });
    expect(loadEnv().API_BASE_URL).toBe('https://api.revue-de-presse.org');
  });
});
