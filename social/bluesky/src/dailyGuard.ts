import type { Agent } from '@atproto/api';

function localDayString(d: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(d);
}

export async function hasAuthoredTodayInTz(
  agent: Agent,
  did: string,
  tz: string,
  now: Date = new Date(),
): Promise<boolean> {
  const today = localDayString(now, tz);
  const res = await agent.app.bsky.feed.getAuthorFeed({
    actor: did,
    limit: 30,
    filter: 'posts_no_replies',
  });
  const feed = (res?.data?.feed ?? []) as Array<{
    post: { record?: { createdAt?: string }; indexedAt?: string };
  }>;
  return feed.some((entry) => {
    const ts = entry.post.record?.createdAt ?? entry.post.indexedAt;
    if (!ts) return false;
    return localDayString(new Date(ts), tz) === today;
  });
}
