import { readBody, createError } from 'h3';
import { useRuntimeConfig } from '#imports';
import { getBlueskyClient } from '../../../utils/blueskyOauth';

/**
 * Begin the Bluesky OAuth dance. Body: `{ handle: "alice.bsky.social" }`.
 * Returns `{ redirectUrl: "<PDS authorize URL>" }` for the browser to
 * follow.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ handle?: unknown }>(event);
  const rawHandle = typeof body?.handle === 'string' ? body.handle.trim() : '';
  if (rawHandle === '') {
    throw createError({ statusCode: 400, statusMessage: 'handle is required' });
  }
  const handle = rawHandle.toLowerCase().replace(/^@/, '');

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
