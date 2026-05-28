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

/**
 * Brand-name → canonical Bluesky handle map. Defensive layer for when
 * Mistral writes a human-readable brand name (or a malformed handle with
 * the wrong TLD or capitalisation) instead of the technical handle.
 *
 * Keys are lowercased; the parser does a lowercase lookup before matching.
 * Aliases are added for the variations actually observed in May 2026
 * outputs — extend as new ones surface.
 */
export const BLUESKY_HANDLE_ALIASES: ReadonlyMap<string, string> = new Map([
  // afp.com
  ['afp', 'afp.com'],
  ['afp.fr', 'afp.com'],
  ['agence france-presse', 'afp.com'],
  ['agence france presse', 'afp.com'],
  // bfmtv.com
  ['bfm', 'bfmtv.com'],
  ['bfmtv', 'bfmtv.com'],
  ['bfm tv', 'bfmtv.com'],
  // blast-info.fr
  ['blast', 'blast-info.fr'],
  ['blast info', 'blast-info.fr'],
  // charliehebdo.fr
  ['charlie hebdo', 'charliehebdo.fr'],
  ['charlie-hebdo', 'charliehebdo.fr'],
  // france24.com
  ['france 24', 'france24.com'],
  ['france24', 'france24.com'],
  ['france24.fr', 'france24.com'],
  // franceculture.fr
  ['france culture', 'franceculture.fr'],
  ['franceculture', 'franceculture.fr'],
  // humanite.fr
  ['humanité', 'humanite.fr'],
  ['l’humanité', 'humanite.fr'],
  ["l'humanité", 'humanite.fr'],
  // lavoixdunord.fr
  ['la voix du nord', 'lavoixdunord.fr'],
  // lecanardenchaine.fr
  ['le canard enchaîné', 'lecanardenchaine.fr'],
  ['le canard enchaine', 'lecanardenchaine.fr'],
  ['canard enchaîné', 'lecanardenchaine.fr'],
  // lefigaro.fr
  ['le figaro', 'lefigaro.fr'],
  ['figaro', 'lefigaro.fr'],
  // lemonde.fr
  ['le monde', 'lemonde.fr'],
  ['lemonde', 'lemonde.fr'],
  // lepoint.fr
  ['le point', 'lepoint.fr'],
  // lesechosfr.bsky.social
  ['les echos', 'lesechosfr.bsky.social'],
  ['les échos', 'lesechosfr.bsky.social'],
  ['lesechos', 'lesechosfr.bsky.social'],
  ['lesechos.fr', 'lesechosfr.bsky.social'],
  // lesjours.fr
  ['les jours', 'lesjours.fr'],
  // liberation.fr
  ['libération', 'liberation.fr'],
  ['liberation', 'liberation.fr'],
  // mediapart.fr
  ['mediapart', 'mediapart.fr'],
  ['médiapart', 'mediapart.fr'],
  // nouvelobs.com
  ['nouvel obs', 'nouvelobs.com'],
  ['nouvel observateur', 'nouvelobs.com'],
  ['le nouvel obs', 'nouvelobs.com'],
  ['nouvelobs', 'nouvelobs.com'],
  // ouest-france.fr
  ['ouest france', 'ouest-france.fr'],
  ['ouest-france', 'ouest-france.fr'],
  // rfi.fr
  ['rfi', 'rfi.fr'],
]);

/**
 * Resolve a candidate token (raw lowercase) to a canonical handle if known
 * — either via direct allowlist match or alias lookup. Returns null when
 * the token cannot be confidently mapped.
 */
export function resolveBlueskyHandle(candidate: string): string | null {
  const c = candidate.toLowerCase();
  if (KNOWN_BLUESKY_HANDLES.has(c)) return c;

  return BLUESKY_HANDLE_ALIASES.get(c) ?? null;
}

/**
 * Pre-process the raw markdown by rewriting every known brand-name alias
 * to its canonical handle. The dotted-handle regex in the parser then
 * picks up the canonical form and emits a clickable handle segment.
 *
 * Examples (before → after):
 *   "L'AFP a rapporté"           → "L'afp.com a rapporté"
 *   "Selon Le Monde et Mediapart" → "Selon lemonde.fr et mediapart.fr"
 *   "AFP.fr précise"             → "afp.com précise"
 *
 * Aliases are applied longest-first so multi-word names ("le canard
 * enchaîné") win over their shorter prefixes ("canard enchaîné", "le").
 * Word-boundary lookarounds use Unicode `\p{L}\p{N}` so accented chars
 * like "é" count as letters for boundary purposes.
 */
const ALIASES_SORTED: ReadonlyArray<[string, string]> = Array.from(
  BLUESKY_HANDLE_ALIASES.entries(),
).sort(([a], [b]) => b.length - a.length);

/**
 * Drop redundant `(handle.tld)` parenthetical citations when the handle is
 * already in the allowlist. Mistral often writes both the brand name AND a
 * parenthetical handle for the same outlet ("Mediapart.fr a rapporté X
 * (mediapart.fr)") — after the brand-name normalisation above turns the
 * inline mention into a canonical handle, the parenthetical is pure
 * redundancy. Leading whitespace is consumed so we don't leave " ." or
 * " ," dangling after the strip.
 */
export function dropParentheticalHandleCitations(markdown: string): string {
  const HANDLE = '[a-z][a-z0-9-]*(?:\\.[a-z0-9-]+)+';
  const re = new RegExp(`\\s*\\(\\s*(${HANDLE})\\s*\\)`, 'gi');
  return markdown.replace(re, (match, raw: string) => {
    if (KNOWN_BLUESKY_HANDLES.has(raw.toLowerCase())) return '';
    return match;
  });
}

export function normalizeBrandNamesToHandles(markdown: string): string {
  let out = markdown;
  for (const [alias, handle] of ALIASES_SORTED) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Three boundary conditions, all required for a match:
    //   1. lookbehind: no letter/digit immediately before (so we don't
    //      match "monde" inside "amondement")
    //   2. lookahead `(?!\.[a-z]+)`: not immediately followed by a TLD-like
    //      `.suffix` (so the alias "lemonde" doesn't match inside the
    //      canonical handle "lemonde.fr" and produce "lemonde.fr.fr")
    //   3. lookahead `(?![\p{L}\p{N}])`: not immediately followed by a
    //      letter or digit (so "afp" doesn't match inside "Afpine")
    const re = new RegExp(
      `(?<![\\p{L}\\p{N}])${escaped}(?!\\.[a-z]+)(?![\\p{L}\\p{N}])`,
      'giu',
    );
    out = out.replace(re, handle);
  }
  return out;
}
