type BlueskyMe = {
  did: string;
  handle: string | null;
  expiresAt: string;
};

type StartResponse = { redirectUrl: string };

const STATE_KEY = 'rdp:chat:me';

/**
 * Bluesky session state for the chat page. Wraps:
 *   - GET  /api/me                              → hydrate
 *   - POST /api/auth/bluesky/start { handle }   → begin OAuth
 *   - POST /api/auth/bluesky/logout             → clear session
 *
 * The OAuth callback (`/api/auth/bluesky/callback`) runs entirely
 * server-side and redirects the browser back to /discuter, at which
 * point `refresh()` picks up the new session.
 */
export const useBluesky = () => {
  const me = useState<BlueskyMe | null>(STATE_KEY, () => null);

  const refresh = async (): Promise<void> => {
    try {
      const res = await $fetch.raw<BlueskyMe | null>('/api/me', {
        method: 'GET',
        ignoreResponseError: true,
      });
      if (res.status === 204) {
        me.value = null;
        return;
      }
      me.value = (res._data ?? null) as BlueskyMe | null;
    } catch {
      me.value = null;
    }
  };

  const login = async (handle: string): Promise<void> => {
    const trimmed = handle.trim().replace(/^@/, '');
    if (trimmed === '') {
      throw new Error('Bluesky handle is required');
    }
    const res = await $fetch<StartResponse>('/api/auth/bluesky/start', {
      method: 'POST',
      body: { handle: trimmed },
    });
    if (import.meta.client) {
      window.location.href = res.redirectUrl;
    }
  };

  const logout = async (): Promise<void> => {
    await $fetch('/api/auth/bluesky/logout', { method: 'POST' });
    me.value = null;
  };

  const isAuthenticated = computed<boolean>(() => me.value !== null);

  return { me, isAuthenticated, refresh, login, logout };
};
