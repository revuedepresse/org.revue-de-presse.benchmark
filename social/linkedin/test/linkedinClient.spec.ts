import { describe, expect, it, beforeEach, vi } from 'vitest';

const restliCreate = vi.fn();
const authExchangeRefresh = vi.fn();
const authExchangeCode = vi.fn();
const authGenerateUrl = vi.fn();

vi.mock('linkedin-api-client', () => ({
  RestliClient: vi.fn().mockImplementation(() => ({ create: restliCreate })),
  AuthClient: vi.fn().mockImplementation(() => ({
    exchangeRefreshTokenForAccessToken: authExchangeRefresh,
    exchangeAuthCodeForAccessToken: authExchangeCode,
    generateMemberAuthorizationUrl: authGenerateUrl,
  })),
}));

beforeEach(() => {
  restliCreate.mockReset();
  authExchangeRefresh.mockReset();
  authExchangeCode.mockReset();
  authGenerateUrl.mockReset();
});

describe('linkedinClient', () => {
  it('createPost calls RestliClient.create with the right resource, version, and entity', async () => {
    restliCreate.mockResolvedValueOnce({ createdEntityId: 'urn:li:share:42' });
    const { createLinkedinClient } = await import('../src/linkedinClient.ts');
    const client = createLinkedinClient({
      clientId: 'cid',
      clientSecret: 'csec',
      redirectUrl: 'https://localhost:8080/callback',
      version: '202505',
    });
    const urn = await client.createPost({
      accessToken: 'AT',
      authorUrn: 'urn:li:organization:75720423',
      commentary: 'hello',
    });
    expect(urn).toBe('urn:li:share:42');
    const call = restliCreate.mock.calls[0][0];
    expect(call.resourcePath).toBe('/posts');
    expect(call.versionString).toBe('202505');
    expect(call.accessToken).toBe('AT');
    expect(call.entity.author).toBe('urn:li:organization:75720423');
    expect(call.entity.commentary).toBe('hello');
    expect(call.entity.visibility).toBe('PUBLIC');
    expect(call.entity.lifecycleState).toBe('PUBLISHED');
    expect(call.entity.isReshareDisabledByAuthor).toBe(false);
    expect(call.entity.distribution.feedDistribution).toBe('MAIN_FEED');
  });

  it('createPost wraps SDK errors in LinkedinApiError', async () => {
    restliCreate.mockRejectedValueOnce(Object.assign(new Error('boom'), { response: { status: 401 } }));
    const { createLinkedinClient, LinkedinApiError } = await import('../src/linkedinClient.ts');
    const client = createLinkedinClient({
      clientId: 'cid',
      clientSecret: 'csec',
      redirectUrl: 'https://localhost:8080/callback',
      version: '202505',
    });
    await expect(
      client.createPost({ accessToken: 'AT', authorUrn: 'urn:li:organization:1', commentary: 'x' }),
    ).rejects.toBeInstanceOf(LinkedinApiError);
  });

  it('refreshAccessToken calls AuthClient.exchangeRefreshTokenForAccessToken', async () => {
    authExchangeRefresh.mockResolvedValueOnce({
      access_token: 'A',
      refresh_token: 'R',
      expires_in: 3600,
      refresh_token_expires_in: 31_536_000,
    });
    const { createLinkedinClient } = await import('../src/linkedinClient.ts');
    const client = createLinkedinClient({
      clientId: 'cid',
      clientSecret: 'csec',
      redirectUrl: 'https://localhost:8080/callback',
      version: '202505',
    });
    const out = await client.refreshAccessToken('old-refresh');
    expect(authExchangeRefresh).toHaveBeenCalledWith('old-refresh');
    expect(out.access_token).toBe('A');
    expect(out.refresh_token).toBe('R');
  });

  it('generateAuthUrl delegates to AuthClient.generateMemberAuthorizationUrl with the right scopes', async () => {
    authGenerateUrl.mockReturnValueOnce('https://linkedin.com/oauth/v2/authorization?…');
    const { createLinkedinClient } = await import('../src/linkedinClient.ts');
    const client = createLinkedinClient({
      clientId: 'cid',
      clientSecret: 'csec',
      redirectUrl: 'https://localhost:8080/callback',
      version: '202505',
    });
    const url = client.generateAuthUrl('csrf-123');
    expect(url).toContain('https://linkedin.com/oauth/v2/authorization');
    expect(authGenerateUrl).toHaveBeenCalledWith(
      ['w_organization_social', 'r_organization_social'],
      'csrf-123',
    );
  });

  it('exchangeCode delegates to AuthClient.exchangeAuthCodeForAccessToken', async () => {
    authExchangeCode.mockResolvedValueOnce({
      access_token: 'A',
      refresh_token: 'R',
      expires_in: 3600,
      refresh_token_expires_in: 31_536_000,
    });
    const { createLinkedinClient } = await import('../src/linkedinClient.ts');
    const client = createLinkedinClient({
      clientId: 'cid',
      clientSecret: 'csec',
      redirectUrl: 'https://localhost:8080/callback',
      version: '202505',
    });
    const out = await client.exchangeCode('the-code');
    expect(authExchangeCode).toHaveBeenCalledWith('the-code');
    expect(out.access_token).toBe('A');
  });
});
