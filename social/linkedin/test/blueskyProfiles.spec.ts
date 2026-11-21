import { describe, expect, it, beforeEach, vi } from 'vitest';
import { createBlueskyProfiles } from '../src/blueskyProfiles.ts';

type FetchMock = ReturnType<typeof vi.fn>;

const profiles = (entries: [string, string | undefined][]) =>
  new Response(
    JSON.stringify({ profiles: entries.map(([handle, displayName]) => ({ did: `did:plc:${handle}`, handle, displayName })) }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );

let fetchMock: FetchMock;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

describe('blueskyProfiles', () => {
  it('maps each handle to its display name, from the public AppView', async () => {
    fetchMock.mockResolvedValueOnce(
      profiles([
        ['alternatives-economiques.fr', 'Alternatives Economiques'],
        ['afp.com', 'Agence France-Presse'],
      ]),
    );
    const names = await createBlueskyProfiles({ baseUrl: 'https://public.api.bsky.app' }).fetchDisplayNames([
      'alternatives-economiques.fr',
      'afp.com',
    ]);

    expect(names.get('alternatives-economiques.fr')).toBe('Alternatives Economiques');
    expect(names.get('afp.com')).toBe('Agence France-Presse');
    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.origin + url.pathname).toBe('https://public.api.bsky.app/xrpc/app.bsky.actor.getProfiles');
    expect(url.searchParams.getAll('actors')).toEqual(['alternatives-economiques.fr', 'afp.com']);
  });

  it('leaves out accounts without a display name, or with a blank one', async () => {
    fetchMock.mockResolvedValueOnce(profiles([['a.example.org', undefined], ['b.example.org', '  ']]));
    const names = await createBlueskyProfiles({ baseUrl: 'https://public.api.bsky.app' }).fetchDisplayNames([
      'a.example.org',
      'b.example.org',
    ]);

    expect(names.size).toBe(0);
  });

  it('asks for at most 25 accounts per request', async () => {
    const handles = Array.from({ length: 30 }, (_, i) => `outlet${i}.example.org`);
    fetchMock
      .mockResolvedValueOnce(profiles(handles.slice(0, 25).map((h) => [h, h.toUpperCase()])))
      .mockResolvedValueOnce(profiles(handles.slice(25).map((h) => [h, h.toUpperCase()])));
    const names = await createBlueskyProfiles({ baseUrl: 'https://public.api.bsky.app' }).fetchDisplayNames(handles);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(new URL(fetchMock.mock.calls[0][0] as string).searchParams.getAll('actors')).toHaveLength(25);
    expect(names.size).toBe(30);
  });

  it('throws when the AppView answers an error, so the caller can fall back on handles', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 502 }));

    await expect(
      createBlueskyProfiles({ baseUrl: 'https://public.api.bsky.app' }).fetchDisplayNames(['afp.com']),
    ).rejects.toThrow('502');
  });
});
