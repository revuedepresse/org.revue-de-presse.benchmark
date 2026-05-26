import { deleteCookie, getCookie } from 'h3';
import { useRuntimeConfig } from '#imports';
import { getBlueskyClient } from '../../../utils/blueskyOauth';
import { getChatSessionStore, sessionCookieName } from '../../../utils/sessionStore';

/**
 * Drop the chat session cookie + its store entry, and revoke the
 * underlying atproto session at the PDS. Idempotent.
 */
export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig(event);
  const sid = getCookie(event, sessionCookieName());
  if (!sid) {
    return { ok: true };
  }

  const store = getChatSessionStore(cfg.chat.sessionStoreDir);
  const session = await store.get(sid);
  await store.del(sid);

  if (session?.did) {
    try {
      const client = getBlueskyClient(cfg.chat);
      await client.revoke(session.did);
    } catch {
      // PDS may already have revoked; never fail the logout on this.
    }
  }

  deleteCookie(event, sessionCookieName(), { path: '/' });
  return { ok: true };
});
