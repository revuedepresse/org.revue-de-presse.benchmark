export type BlueskyProfiles = {
  // Display names by handle; accounts without one are left out.
  fetchDisplayNames: (handles: string[]) => Promise<Map<string, string>>;
};

// app.bsky.actor.getProfiles takes at most 25 actors per request.
const MAX_ACTORS = 25;

export function createBlueskyProfiles(opts: { baseUrl: string }): BlueskyProfiles {
  return {
    async fetchDisplayNames(handles: string[]): Promise<Map<string, string>> {
      const names = new Map<string, string>();
      for (let i = 0; i < handles.length; i += MAX_ACTORS) {
        const url = new URL('/xrpc/app.bsky.actor.getProfiles', opts.baseUrl);
        for (const handle of handles.slice(i, i + MAX_ACTORS)) {
          url.searchParams.append('actors', handle);
        }
        const res = await fetch(url.toString(), { headers: { accept: 'application/json' } });
        if (!res.ok) {
          throw new Error(`Bluesky getProfiles failed: ${res.status}`);
        }
        const body = (await res.json()) as { profiles?: { handle: string; displayName?: string }[] };
        for (const profile of body.profiles ?? []) {
          const name = profile.displayName?.trim();
          if (name) names.set(profile.handle, name);
        }
      }
      return names;
    },
  };
}
