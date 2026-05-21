import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const REQUIRED = {
  LINKEDIN_CLIENT_ID: 'cid',
  LINKEDIN_CLIENT_SECRET: 'csecret',
  LINKEDIN_REDIRECT_URI: 'https://localhost:8080/callback',
  LINKEDIN_TOKEN_FILE: './tok.json',
  LINKEDIN_STATE_FILE: './state.json',
  API_BASE_URL: 'https://api.revue-de-presse.org',
  API_CLIENT_SECRET: 'apisecret',
};

describe('loadConfig', () => {
  const original = { ...process.env };

  beforeEach(() => {
    for (const key of Object.keys(REQUIRED)) delete process.env[key];
    delete process.env.LINKEDIN_ORGANIZATION_URN;
    delete process.env.LINKEDIN_VERSION;
    delete process.env.LOG_LEVEL;
    delete process.env.TZ;
    delete process.env.POST_FOOTER_URL;
    delete process.env.POST_HASHTAG;
  });

  afterEach(() => {
    process.env = { ...original };
  });

  it('returns typed config when all required vars are present', async () => {
    Object.assign(process.env, REQUIRED);
    const { loadConfig } = await import('../src/config.ts');
    const cfg = loadConfig();
    expect(cfg.linkedinClientId).toBe('cid');
    expect(cfg.linkedinClientSecret).toBe('csecret');
    expect(cfg.apiBaseUrl).toBe('https://api.revue-de-presse.org');
  });

  it('applies defaults for optional vars', async () => {
    Object.assign(process.env, REQUIRED);
    const { loadConfig } = await import('../src/config.ts');
    const cfg = loadConfig();
    expect(cfg.linkedinOrganizationUrn).toBe('urn:li:organization:75720423');
    expect(cfg.linkedinVersion).toBe('202505');
    expect(cfg.logLevel).toBe('info');
    expect(cfg.tz).toBe('Europe/Paris');
    expect(cfg.postFooterUrl).toBe(
      'https://play.google.com/store/apps/details?id=org.revue_2_presse',
    );
    expect(cfg.postHashtag).toBe('#RevueDePresse');
  });

  it('honours overrides for optional vars', async () => {
    Object.assign(process.env, REQUIRED, {
      LINKEDIN_ORGANIZATION_URN: 'urn:li:organization:999',
      LINKEDIN_VERSION: '202601',
      LOG_LEVEL: 'debug',
      TZ: 'UTC',
      POST_FOOTER_URL: 'https://example.org/digest',
      POST_HASHTAG: '#MyDigest',
    });
    const { loadConfig } = await import('../src/config.ts');
    const cfg = loadConfig();
    expect(cfg.linkedinOrganizationUrn).toBe('urn:li:organization:999');
    expect(cfg.linkedinVersion).toBe('202601');
    expect(cfg.logLevel).toBe('debug');
    expect(cfg.tz).toBe('UTC');
    expect(cfg.postFooterUrl).toBe('https://example.org/digest');
    expect(cfg.postHashtag).toBe('#MyDigest');
  });

  it('throws listing a single missing key', async () => {
    Object.assign(process.env, REQUIRED);
    delete process.env.LINKEDIN_CLIENT_ID;
    const { loadConfig } = await import('../src/config.ts');
    expect(() => loadConfig()).toThrow(/LINKEDIN_CLIENT_ID/);
  });

  it('throws listing ALL missing keys at once', async () => {
    const { loadConfig } = await import('../src/config.ts');
    try {
      loadConfig();
      throw new Error('expected loadConfig to throw');
    } catch (err) {
      const msg = (err as Error).message;
      for (const key of Object.keys(REQUIRED)) {
        expect(msg).toContain(key);
      }
    }
  });
});
