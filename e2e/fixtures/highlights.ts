// /api/highlights mock payloads. Shape matches both apps' proxy output:
// { aggregates: [], statuses: Status[], version: 'v6.x.x' }.

export type Status = {
  screen_name: string;
  publication_id: string;
  url: string;
  avatar_url: string | null;
  text: string;
  reposts: number;
  likes: number;
  replies: number;
  date: string;
  status?: unknown;
};

export type HighlightsResponse = {
  aggregates: never[];
  statuses: Status[];
  version: string;
};

const VERSION = 'v6.0.0';

function makeStatus(seed: number, i: number, ymd: string): Status {
  const handles = [
    'franceculture.fr',
    'lemonde.fr',
    'mediapart.fr',
    'liberation.fr',
    'lefigaro.fr',
    'lequipe.fr',
    'arretsurimages.net',
  ];
  const handle = handles[(seed + i) % handles.length];
  const status: Status = {
    screen_name: handle,
    publication_id: `synth-${ymd}-${i}`,
    url: `https://bsky.app/profile/${handle}/post/${ymd}-${i}`,
    avatar_url: `https://cdn.example/${handle}.jpg`,
    text: `Synthetic post ${i + 1} for ${ymd}.`,
    reposts: 50 + ((seed + i) % 200),
    likes: 100 + ((seed * 3 + i) % 500),
    replies: 10 + ((seed + i * 2) % 80),
    date: `${ymd}T08:00:00Z`,
  };
  status.status = { ...status };
  return status;
}

function hashDate(ymd: string): number {
  let h = 0;
  for (let i = 0; i < ymd.length; i++) h = (h * 31 + ymd.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const fixtures: Record<string, HighlightsResponse> = {
  '2026-05-01': (() => {
    const make = (handle: string, name: string, i: number): Status => {
      const s: Status = {
        screen_name: handle,
        publication_id: `curated-2026-05-01-${i}`,
        url: `https://bsky.app/profile/${handle}/post/curated-${i}`,
        avatar_url: `https://cdn.example/${handle}.jpg`,
        text: `${name} curated post for 2026-05-01.`,
        reposts: 100 + i * 10,
        likes: 300 + i * 50,
        replies: 40 + i * 5,
        date: '2026-05-01T08:00:00Z',
      };
      s.status = { ...s };
      return s;
    };
    return {
      aggregates: [],
      statuses: [
        make('franceculture.fr', 'France Culture', 0),
        make('lemonde.fr', 'Le Monde', 1),
        make('mediapart.fr', 'Mediapart', 2),
      ],
      version: VERSION,
    };
  })(),
};

export function getFixture(ymd: string): HighlightsResponse {
  if (fixtures[ymd]) return fixtures[ymd];
  const seed = hashDate(ymd);
  const count = 3 + (seed % 5);
  return {
    aggregates: [],
    statuses: Array.from({ length: count }, (_, i) => makeStatus(seed, i, ymd)),
    version: VERSION,
  };
}
