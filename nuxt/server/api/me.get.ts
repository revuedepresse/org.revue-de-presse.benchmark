/**
 * Returns the current chat session, if any. Used by the Nuxt client
 * to hydrate `useBluesky()` on page load. Returns 204 when there's
 * no session (so the browser can distinguish "logged out" from
 * "request failed").
 */
export default defineEventHandler((event) => {
  const session = event.context.chatSession;
  if (!session) {
    setResponseStatus(event, 204);
    return null;
  }
  return {
    did: session.did,
    handle: session.handle ?? null,
    expiresAt: session.expiresAt,
  };
});
