import { logger } from './logger.ts';

export type HandleResolver = {
  resolveHandle: (args: { handle: string }) => Promise<{ data: { did?: string } }>;
};

export type MentionResolver = {
  resolve: (handle: string) => Promise<string | null>;
};

export function createMentionResolver(agent: HandleResolver): MentionResolver {
  const cache = new Map<string, string | null>();
  return {
    async resolve(handle: string): Promise<string | null> {
      if (cache.has(handle)) return cache.get(handle) ?? null;
      try {
        const res = await agent.resolveHandle({ handle });
        const did = res?.data?.did ?? null;
        cache.set(handle, did);
        if (!did) logger.warn({ handle }, 'mentionResolver: PDS returned no did; rendering without mention facet');
        return did;
      } catch (err) {
        logger.warn({ handle, err }, 'mentionResolver: resolveHandle failed; rendering without mention facet');
        cache.set(handle, null);
        return null;
      }
    },
  };
}
