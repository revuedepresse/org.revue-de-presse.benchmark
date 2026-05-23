import { logger } from './logger.ts';

export class BlueskyApiError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'BlueskyApiError';
  }
}

export type PostResult = { uri: string; cid: string };

export type PostingAgent = {
  post: (input: {
    text: string;
    facets?: unknown[];
    embed?: unknown;
    reply?: { root: PostResult; parent: PostResult };
  }) => Promise<PostResult>;
  deletePost: (uri: string) => Promise<void>;
};

export type EnrichedReply = {
  text: string;
  facets: unknown[];
  embed: unknown | undefined;
};

export type EnrichedDraft = {
  lead: { text: string };
  enrichedReplies: EnrichedReply[];
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function postThread(
  agent: PostingAgent,
  draft: EnrichedDraft,
  opts: { sleepMs?: number } = {},
): Promise<string> {
  const gap = opts.sleepMs ?? 250;
  const posted: PostResult[] = [];
  let lead: PostResult;
  try {
    lead = await agent.post({ text: draft.lead.text });
    posted.push(lead);
  } catch (err) {
    throw new BlueskyApiError(`Lead post failed: ${(err as Error).message}`, err);
  }
  const root = lead;
  let parent = lead;

  for (let i = 0; i < draft.enrichedReplies.length; i += 1) {
    const r = draft.enrichedReplies[i];
    try {
      const res = await agent.post({
        text: r.text,
        facets: r.facets,
        embed: r.embed,
        reply: { root, parent },
      });
      posted.push(res);
      parent = res;
    } catch (err) {
      logger.error({ err, replyIndex: i, postedSoFar: posted.length }, 'reply failed; rolling back');
      for (let j = posted.length - 1; j >= 0; j -= 1) {
        try {
          await agent.deletePost(posted[j].uri);
        } catch (delErr) {
          logger.error({ err: delErr, uri: posted[j].uri }, 'rollback delete failed; manual cleanup may be required');
        }
      }
      throw new BlueskyApiError(`Reply ${i + 1} failed: ${(err as Error).message}`, err);
    }
    if (gap > 0 && i < draft.enrichedReplies.length - 1) await sleep(gap);
  }

  return root.uri;
}
