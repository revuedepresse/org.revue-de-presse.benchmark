import { describe, expect, it, vi } from 'vitest';
import { hasAuthoredTodayInTz } from '../src/dailyGuard.ts';

type FakeAgent = {
  app: {
    bsky: {
      feed: {
        getAuthorFeed: ReturnType<typeof vi.fn>;
      };
    };
  };
};

function mkAgent(posts: Array<{ createdAt: string }>): FakeAgent {
  return {
    app: {
      bsky: {
        feed: {
          getAuthorFeed: vi.fn().mockResolvedValue({
            data: {
              feed: posts.map((p) => ({ post: { record: { createdAt: p.createdAt }, indexedAt: p.createdAt } })),
            },
          }),
        },
      },
    },
  };
}

const DID = 'did:plc:example';
const TZ = 'Europe/Paris';

describe('hasAuthoredTodayInTz', () => {
  it('returns false on an empty feed', async () => {
    const agent = mkAgent([]);
    const now = new Date('2026-05-23T08:00:00Z');
    expect(await hasAuthoredTodayInTz(agent as never, DID, TZ, now)).toBe(false);
  });

  it('returns true when a post exists earlier today in Paris', async () => {
    const agent = mkAgent([{ createdAt: '2026-05-23T03:35:00Z' }]);
    const now = new Date('2026-05-23T08:00:00Z');
    expect(await hasAuthoredTodayInTz(agent as never, DID, TZ, now)).toBe(true);
  });

  it('returns false when the last post was yesterday in Paris', async () => {
    const agent = mkAgent([{ createdAt: '2026-05-22T21:00:00Z' }]);
    const now = new Date('2026-05-23T03:35:00Z');
    expect(await hasAuthoredTodayInTz(agent as never, DID, TZ, now)).toBe(false);
  });

  it('correctly handles the Paris/UTC midnight boundary', async () => {
    const agent = mkAgent([{ createdAt: '2026-05-22T22:30:00Z' }]);
    const now = new Date('2026-05-23T05:00:00Z');
    expect(await hasAuthoredTodayInTz(agent as never, DID, TZ, now)).toBe(true);
  });

  it('passes actor and posts_no_replies filter to getAuthorFeed', async () => {
    const agent = mkAgent([]);
    await hasAuthoredTodayInTz(agent as never, DID, TZ, new Date('2026-05-23T08:00:00Z'));
    expect(agent.app.bsky.feed.getAuthorFeed).toHaveBeenCalledWith(
      expect.objectContaining({ actor: DID, filter: 'posts_no_replies', limit: 30 }),
    );
  });

  it('propagates getAuthorFeed errors to the caller', async () => {
    const agent: FakeAgent = {
      app: {
        bsky: {
          feed: { getAuthorFeed: vi.fn().mockRejectedValue(new Error('PDS down')) },
        },
      },
    };
    await expect(
      hasAuthoredTodayInTz(agent as never, DID, TZ, new Date('2026-05-23T08:00:00Z')),
    ).rejects.toThrow('PDS down');
  });
});
