import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { loadConfig, ConfigError } from '../src/config.ts';

const BASE_ENV: Record<string, string> = {
  BLUESKY_HANDLE: 'revue-de-presse.org',
  BLUESKY_CLIENT_METADATA_URL: 'https://revue-de-presse.org/bluesky-client-metadata.json',
  BLUESKY_REDIRECT_URI: 'http://127.0.0.1:8080/callback',
  API_BASE_URL: 'https://api.revue-de-presse.org',
  API_CLIENT_SECRET: 'sek',
};

const FILE_ENV = {
  ...BASE_ENV,
  BLUESKY_SESSION_FILE: './.bluesky-session.json',
  BLUESKY_STATE_FILE: './.bluesky-state.json',
};

let saved: NodeJS.ProcessEnv;

beforeEach(() => {
  saved = { ...process.env };
  for (const k of Object.keys(process.env)) {
    if (k.startsWith('BLUESKY_') || k.startsWith('API_') || k === 'POST_FOOTER_URL' || k === 'POST_HASHTAG' || k === 'TZ' || k === 'LOG_LEVEL') {
      delete process.env[k];
    }
  }
});
afterEach(() => { process.env = saved; });

describe('loadConfig', () => {
  it('reports every missing required key in file mode', () => {
    expect(() => loadConfig()).toThrow(ConfigError);
    try { loadConfig(); } catch (e) {
      expect((e as ConfigError).missing).toEqual(
        expect.arrayContaining(['BLUESKY_HANDLE', 'BLUESKY_CLIENT_METADATA_URL', 'BLUESKY_REDIRECT_URI', 'API_BASE_URL', 'API_CLIENT_SECRET']),
      );
    }
  });

  it('loads defaults for optional keys', () => {
    Object.assign(process.env, FILE_ENV);
    const cfg = loadConfig();
    expect(cfg.blueskyHandle).toBe('revue-de-presse.org');
    expect(cfg.blueskyPdsUrl).toBe('https://bsky.social');
    expect(cfg.tz).toBe('Europe/Paris');
    expect(cfg.logLevel).toBe('info');
    expect(cfg.postFooterUrl).toContain('play.google.com');
    expect(cfg.postHashtag).toBe('#RevueDePresse');
  });

  it('env mode does not require BLUESKY_SESSION_FILE / BLUESKY_STATE_FILE', () => {
    Object.assign(process.env, BASE_ENV, { BLUESKY_OAUTH_SESSION: 'b64-blob' });
    const cfg = loadConfig();
    expect(cfg.blueskyOauthSessionEnv).toBe('b64-blob');
  });

  it('exposes BLUESKY_ROTATED_SESSION_FILE when set', () => {
    Object.assign(process.env, FILE_ENV, { BLUESKY_ROTATED_SESSION_FILE: '/tmp/rot.json' });
    expect(loadConfig().blueskyRotatedSessionFile).toBe('/tmp/rot.json');
  });
});
