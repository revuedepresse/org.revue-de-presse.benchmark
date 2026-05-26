import { SignJWT } from 'jose';

/**
 * Mint a short-lived HS256 JWT for the Symfony API's
 * BlueskyJwtAuthenticator. Exp = 60s, sub = DID, iss must match
 * what the verifier checks (`nuxt.revue-de-presse.org`).
 */
export async function signApiJwt(opts: {
  secret: string;
  did: string;
  handle?: string;
}): Promise<string> {
  const key = new TextEncoder().encode(opts.secret);
  const jwt = await new SignJWT({ handle: opts.handle })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer('nuxt.revue-de-presse.org')
    .setSubject(opts.did)
    .setIssuedAt()
    .setExpirationTime('60s')
    .sign(key);

  return jwt;
}
