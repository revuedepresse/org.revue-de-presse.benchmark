import { AuthClient, RestliClient } from 'linkedin-api-client';

export class LinkedinApiError extends Error {
  constructor(
    public readonly statusCode: number | undefined,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'LinkedinApiError';
  }
}

export type TokenExchangeResult = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
};

export type LinkedinClient = {
  generateAuthUrl: (state: string) => string;
  exchangeCode: (code: string) => Promise<TokenExchangeResult>;
  refreshAccessToken: (refreshToken: string) => Promise<TokenExchangeResult>;
  createPost: (input: {
    accessToken: string;
    authorUrn: string;
    commentary: string;
  }) => Promise<string>;
};

const SCOPES = ['w_organization_social', 'r_organization_social'];

export function createLinkedinClient(opts: {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  version: string;
}): LinkedinClient {
  const authClient = new AuthClient({
    clientId: opts.clientId,
    clientSecret: opts.clientSecret,
    redirectUrl: opts.redirectUrl,
  });
  const restliClient = new RestliClient();

  return {
    generateAuthUrl(state) {
      return authClient.generateMemberAuthorizationUrl(SCOPES, state);
    },
    async exchangeCode(code) {
      const r = await authClient.exchangeAuthCodeForAccessToken(code);
      return {
        access_token: r.access_token,
        refresh_token: r.refresh_token!,
        expires_in: r.expires_in,
        refresh_token_expires_in: r.refresh_token_expires_in!,
      };
    },
    async refreshAccessToken(refreshToken) {
      const r = await authClient.exchangeRefreshTokenForAccessToken(refreshToken);
      return {
        access_token: r.access_token,
        refresh_token: r.refresh_token!,
        expires_in: r.expires_in,
        refresh_token_expires_in: r.refresh_token_expires_in!,
      };
    },
    async createPost({ accessToken, authorUrn, commentary }) {
      try {
        const res = await restliClient.create({
          resourcePath: '/posts',
          entity: {
            author: authorUrn,
            commentary,
            visibility: 'PUBLIC',
            distribution: {
              feedDistribution: 'MAIN_FEED',
              targetEntities: [],
              thirdPartyDistributionChannels: [],
            },
            lifecycleState: 'PUBLISHED',
            isReshareDisabledByAuthor: false,
          },
          accessToken,
          versionString: opts.version,
        });
        if (typeof res.createdEntityId !== 'string' || res.createdEntityId.length === 0) {
          throw new LinkedinApiError(
            undefined,
            'LinkedIn create-post returned no createdEntityId',
            res,
          );
        }
        return res.createdEntityId;
      } catch (err) {
        if (err instanceof LinkedinApiError) throw err;
        const status = (err as { response?: { status?: number } }).response?.status;
        throw new LinkedinApiError(status, `LinkedIn create-post failed: ${String(err)}`, err);
      }
    },
  };
}
