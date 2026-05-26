import { getBlueskyClient } from '../../../utils/blueskyOauth';

const RESOLVE_HANDLE_URL =
  'https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle';

export type BlueskyHandleErrorCode = 'handle_invalid' | 'handle_not_found';

/**
 * Begin the Bluesky OAuth dance. Body: `{ handle: "alice.bsky.social" }`.
 *
 * Returns `{ redirectUrl: "<PDS authorize URL>" }` for the browser to
 * follow. Validates the handle against the public AppView resolver before
 * starting OAuth so a missing or malformed handle surfaces with a
 * structured `code` instead of being collapsed into a generic 400 by the
 * OAuth client.
 *
 * Error shape (4xx): `{ statusCode, statusMessage, data: { code } }` where
 * `code` is one of `handle_invalid`, `handle_not_found`.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ handle?: unknown }>(event);
  const rawHandle = typeof body?.handle === 'string' ? body.handle.trim() : '';
  if (rawHandle === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'handle_invalid',
      data: { code: 'handle_invalid' satisfies BlueskyHandleErrorCode },
    });
  }
  const handle = rawHandle.toLowerCase().replace(/^@/, '');

  if (!handle.includes('.')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'handle_invalid',
      data: { code: 'handle_invalid' satisfies BlueskyHandleErrorCode },
    });
  }

  let resolved: Response;
  try {
    resolved = await fetch(
      `${RESOLVE_HANDLE_URL}?handle=${encodeURIComponent(handle)}`,
      { method: 'GET', headers: { accept: 'application/json' } },
    );
  } catch (err) {
    throw createError({
      statusCode: 502,
      statusMessage: `Unable to reach the Bluesky resolver: ${(err as Error).message}`,
    });
  }
  if (resolved.status === 400 || resolved.status === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: 'handle_not_found',
      data: { code: 'handle_not_found' satisfies BlueskyHandleErrorCode },
    });
  }
  if (!resolved.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: `Bluesky resolver returned ${resolved.status}`,
    });
  }

  const cfg = useRuntimeConfig(event);
  if (!cfg.chat.apiJwtSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API_JWT_SECRET is not configured on the Nuxt host',
    });
  }

  const client = getBlueskyClient(cfg.chat);

  try {
    const url = await client.authorize(handle, {
      scope: 'atproto transition:generic',
    });
    return { redirectUrl: url.toString() };
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: `Unable to resolve "${handle}" on the Bluesky network: ${(err as Error).message}`,
    });
  }
});
