import { getQuery, setCookie, sendRedirect } from 'h3';
import { useRuntimeConfig } from '#imports';
import { getBlueskyClient } from '../../../utils/blueskyOauth';
import {
  getChatSessionStore,
  newSessionId,
  sessionCookieName,
  sessionExpiry,
} from '../../../utils/sessionStore';

/**
 * Bluesky redirects the user here with `?code=…&state=…` (and an `iss`).
 * Complete the OAuth dance, persist the DID-bound atproto session
 * inside the OAuth client's store, then mint our own opaque chat
 * session cookie and redirect the user back to /discuter.
 */
export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig(event);
  const client = getBlueskyClient(cfg.chat);

  const query = getQuery(event);
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (typeof v === 'string') params.set(k, v);
  }

  const { session } = await client.callback(params);
  const did = session.did;
  // Best-effort handle lookup — the atproto SDK's getProfile is fine
  // for display purposes only. If it fails (network blip, profile gated),
  // we leave the handle blank; the session still works on DID alone.
  let handle: string | undefined;
  try {
    const agent = await client.restore(did);
    const profile = await agent.com.atproto.repo.describeRepo({ repo: did });
    handle = profile.data.handle;
  } catch {
    // ignore — handle is purely cosmetic
  }

  const store = getChatSessionStore(cfg.chat.sessionStoreDir);
  const sid = newSessionId();
  const { createdAt, expiresAt } = sessionExpiry();
  await store.set(sid, { did, handle, createdAt, expiresAt });

  setCookie(event, sessionCookieName(), sid, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !!cfg.chat.publicOrigin, // dev over http is fine, prod is https-only
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });

  return sendRedirect(event, '/discuter', 302);
});
