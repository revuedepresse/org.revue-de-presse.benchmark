import { randomBytes } from 'node:crypto';
import { join } from 'node:path';
import { createFileStore, resolveStoreDir } from './fileStore';

export type ChatSession = {
  did: string;
  handle?: string;
  createdAt: string;
  expiresAt: string;
};

const SESSION_COOKIE = 'rdp_chat_session';
const SESSION_TTL_DAYS = 30;

export function getChatSessionStore(storeDir: string) {
  return createFileStore<ChatSession>(join(resolveStoreDir(storeDir), 'chat-sessions.json'));
}

export function sessionCookieName(): string {
  return SESSION_COOKIE;
}

export function newSessionId(): string {
  // 192 bits of entropy → 32 base64url chars, no padding.
  return randomBytes(24).toString('base64url');
}

export function sessionExpiry(now = new Date()): { createdAt: string; expiresAt: string } {
  const created = now;
  const expires = new Date(created.getTime() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  return { createdAt: created.toISOString(), expiresAt: expires.toISOString() };
}

export function isExpired(session: ChatSession, now = new Date()): boolean {
  return new Date(session.expiresAt).getTime() <= now.getTime();
}
