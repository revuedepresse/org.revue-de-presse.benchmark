import { describe, expect, it, vi } from 'vitest';
import { postThread, BlueskyApiError } from '../src/blueskyClient.ts';

type AgentMock = {
  post: ReturnType<typeof vi.fn>;
  deletePost: ReturnType<typeof vi.fn>;
};

function mkAgent(): AgentMock {
  return {
    post: vi.fn(),
    deletePost: vi.fn().mockResolvedValue(undefined),
  };
}

const DRAFT = {
  lead: { text: 'Top 3 …' },
  enrichedReplies: [
    { text: '1. @a — t1', facets: [], embed: { $type: 'app.bsky.embed.external', external: { uri: 'u1', title: 't1', description: '' } } },
    { text: '2. @b — t2', facets: [], embed: { $type: 'app.bsky.embed.external', external: { uri: 'u2', title: 't2', description: '' } } },
    { text: '3. @c — t3', facets: [], embed: { $type: 'app.bsky.embed.external', external: { uri: 'u3', title: 't3', description: '' } } },
  ],
};

describe('postThread', () => {
  it('posts lead then 3 replies, threading by root+parent', async () => {
    const agent = mkAgent();
    agent.post
      .mockResolvedValueOnce({ uri: 'at://lead', cid: 'c-lead' })
      .mockResolvedValueOnce({ uri: 'at://r1',  cid: 'c-r1' })
      .mockResolvedValueOnce({ uri: 'at://r2',  cid: 'c-r2' })
      .mockResolvedValueOnce({ uri: 'at://r3',  cid: 'c-r3' });

    const rootUri = await postThread(agent as never, DRAFT as never, { sleepMs: 0 });
    expect(rootUri).toBe('at://lead');
    expect(agent.post).toHaveBeenCalledTimes(4);

    expect(agent.post.mock.calls[1][0].reply).toEqual({
      root: { uri: 'at://lead', cid: 'c-lead' },
      parent: { uri: 'at://lead', cid: 'c-lead' },
    });
    expect(agent.post.mock.calls[2][0].reply).toEqual({
      root: { uri: 'at://lead', cid: 'c-lead' },
      parent: { uri: 'at://r1', cid: 'c-r1' },
    });
  });

  it('deletes already-posted records in reverse order when a later reply fails', async () => {
    const agent = mkAgent();
    agent.post
      .mockResolvedValueOnce({ uri: 'at://lead', cid: 'c-lead' })
      .mockResolvedValueOnce({ uri: 'at://r1',  cid: 'c-r1' })
      .mockRejectedValueOnce(new Error('PDS 502'));

    await expect(postThread(agent as never, DRAFT as never, { sleepMs: 0 })).rejects.toBeInstanceOf(BlueskyApiError);
    expect(agent.deletePost).toHaveBeenCalledTimes(2);
    expect(agent.deletePost.mock.calls[0][0]).toBe('at://r1');
    expect(agent.deletePost.mock.calls[1][0]).toBe('at://lead');
  });

  it('still throws BlueskyApiError even if rollback deletes also fail', async () => {
    const agent = mkAgent();
    agent.post
      .mockResolvedValueOnce({ uri: 'at://lead', cid: 'c-lead' })
      .mockRejectedValueOnce(new Error('PDS 502'));
    agent.deletePost.mockRejectedValue(new Error('PDS still down'));

    await expect(postThread(agent as never, DRAFT as never, { sleepMs: 0 })).rejects.toBeInstanceOf(BlueskyApiError);
  });
});
