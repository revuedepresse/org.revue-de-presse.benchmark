// Curated allowlist of Bluesky handles for the French-press outlets the
// daily-summary generator may cite. Hand-extracted from the May 2026 corpus
// snapshots (src/Bluesky/Resources/*.json) — refresh periodically if new
// outlets enter the rotation.
//
// The summary-markdown parser only emits `handle` segments for tokens that
// appear in this set. That guarantees every rendered link points at a real
// Bluesky profile — a Mistral mis-citation like "verite.fr" stays as plain
// text instead of becoming a broken link.

export const KNOWN_BLUESKY_HANDLES: ReadonlySet<string> = new Set([
  'afp.com',
  'bfmtv.com',
  'blast-info.fr',
  'charliehebdo.fr',
  'france24.com',
  'franceculture.fr',
  'humanite.fr',
  'lavoixdunord.fr',
  'lecanardenchaine.fr',
  'lefigaro.fr',
  'lemonde.fr',
  'lepoint.fr',
  'lesechosfr.bsky.social',
  'lesjours.fr',
  'liberation.fr',
  'mediapart.fr',
  'nouvelobs.com',
  'ouest-france.fr',
  'rfi.fr',
]);

export function isKnownBlueskyHandle(candidate: string): boolean {
  return KNOWN_BLUESKY_HANDLES.has(candidate.toLowerCase());
}
