import { readBody, createError, setResponseHeaders, sendStream } from 'h3';
import { useRuntimeConfig } from '#imports';
import { signApiJwt } from '../utils/signApiJwt';
import { logger } from '../utils/logger';

const log = logger.child({ route: '/api/chat' });

/**
 * Browser → Nuxt → Symfony API SSE proxy.
 *
 * The Nuxt server is the trust boundary: it owns the chat session
 * cookie, looks up the bound DID, mints a 60-s HS256 JWT, and
 * forwards the request to the API. The upstream stream is piped
 * straight back to the browser, untouched.
 */
export default defineEventHandler(async (event) => {
  const session = event.context.chatSession;
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Chat session required' });
  }

  const cfg = useRuntimeConfig(event);
  if (!cfg.chat.apiJwtSecret) {
    log.error('API_JWT_SECRET is not configured on the Nuxt host');
    throw createError({
      statusCode: 500,
      statusMessage: 'API_JWT_SECRET is not configured on the Nuxt host',
    });
  }
  if (!cfg.apiBaseUrl) {
    log.error('apiBaseUrl is not configured');
    throw createError({ statusCode: 500, statusMessage: 'apiBaseUrl is not configured' });
  }

  const body = await readBody<{ userMessage?: unknown; conversationId?: unknown }>(event);
  const userMessage = typeof body?.userMessage === 'string' ? body.userMessage : '';
  if (userMessage.trim() === '') {
    throw createError({ statusCode: 400, statusMessage: 'userMessage is required' });
  }
  const conversationId =
    typeof body?.conversationId === 'string' && body.conversationId !== ''
      ? body.conversationId
      : undefined;

  const jwt = await signApiJwt({
    secret: cfg.chat.apiJwtSecret,
    did: session.did,
    handle: session.handle ?? undefined,
  });

  const upstreamUrl = cfg.apiBaseUrl.replace(/\/$/, '') + '/api/chat/turns';
  const upstream = await fetch(upstreamUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({ userMessage, conversationId }),
  });

  if (!upstream.ok || upstream.body === null) {
    const detail = await upstream.text().catch(() => '');
    log.warn(
      {
        did: session.did,
        conversationId,
        status: upstream.status,
        statusText: upstream.statusText,
        detail: detail.slice(0, 500),
      },
      'upstream chat returned non-ok response',
    );
    throw createError({
      statusCode: upstream.status || 502,
      statusMessage: detail || upstream.statusText || 'Upstream chat error',
    });
  }

  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  return sendStream(event, upstream.body);
});
