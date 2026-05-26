import { getCookie } from 'h3';
import { useRuntimeConfig } from '#imports';
import {
  getChatSessionStore,
  isExpired,
  sessionCookieName,
  type ChatSession,
} from '../utils/sessionStore';

declare module 'h3' {
  interface H3EventContext {
    chatSession?: ChatSession;
  }
}

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, sessionCookieName());
  if (!cookie) return;

  const cfg = useRuntimeConfig(event);
  const store = getChatSessionStore(cfg.chat.sessionStoreDir);
  const session = await store.get(cookie);
  if (!session || isExpired(session)) {
    return;
  }

  event.context.chatSession = session;
});
