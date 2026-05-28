// Repairs mojibake: a string whose characters are UTF-8 bytes that have been
// mistakenly decoded as Latin-1, so `é` (UTF-8 `0xC3 0xA9`) appears as `Ã©`
// (Latin-1 `Ã` + `©`). Detects the pattern and roundtrips through Latin-1
// bytes -> UTF-8. Aborts if any character is outside the Latin-1 range
// (e.g. emoji), since that means the string is already valid UTF-8.
export function repairMojibake(text: string): string {
  if (!text) return '';
  // Quick sniff: `Ã` (0xC3) or `Â` (0xC2) followed by a UTF-8
  // continuation byte decoded as Latin-1 (U+0080..U+00BF) is the
  // signature of mojibake.
  if (!/[ÂÃ][-¿]/.test(text)) return text;
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) > 0xff) return text;
  }
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return text;
  }
}

// Strips upstream encoding artefacts from raw status text:
//   - literal `\n` produced by the JSON layer (converted to real LF)
//   - escaped `\'` and `\"` quotes
//   - `\xNN[\]` hex escapes (nbsp → space; printable ASCII decoded; rest dropped)
//   - CSS-style `\NN[\]` hex escapes (printable ASCII only)
//   - 4-digit `\NNNN[\]` artefacts (year-shaped)
//   - Unicode variation selectors and zero-width chars that travel with emoji
//   - any remaining bare backslashes
// Real UTF-8 (accents, emoji) is preserved; line feeds are kept.
// Used by both the website (composables/useHighlights) and the RSS feed plugin.
export function cleanText(text: string): string {
  if (!text) return '';
  // 0. Repair `Ã©`/`Ã¨`/etc. mojibake before any other transform so later
  //    steps see real codepoints, not Latin-1-decoded UTF-8 bytes.
  let out = repairMojibake(text);
  // 1. Strip the literal straight quotes the upstream wraps every status in.
  if (out.startsWith('"') && out.endsWith('"')) {
    out = out.slice(1, -1);
  }
  // 2. Convert literal `\n` (backslash-n in the JSON payload) into actual
  //    line feeds so paragraph breaks render in the post body.
  out = out.replace(/\\n/g, '\n');
  // 3. Decode escaped quotes the upstream still ships in body text:
  //    `L\'Espagne` → `L'Espagne`, `\"Atlantique\"` → `"Atlantique"`.
  out = out.replace(/\\'/g, "'").replace(/\\"/g, '"');
  // 3b. Decode 4-hex-digit `\xNNNN[\]` escapes (Unicode codepoints, e.g.
  //     `\x202f\` for NARROW NO-BREAK SPACE used in French before `:`/`;`/`!`/`?`).
  //     Must run BEFORE the 2-digit step below — otherwise the 2-digit
  //     regex would consume the first two hex chars and leak the rest.
  out = out.replace(/\\x([0-9a-fA-F]{4})\\?/g, (_, hex) => {
    const code = parseInt(hex, 16);
    if (code === 0xa0 || code === 0x2007 || code === 0x202f) return ' ';
    if (code < 0x20 || (code >= 0x7f && code < 0xa0)) return '';
    try {
      return String.fromCodePoint(code);
    } catch {
      return '';
    }
  });
  // 4. Decode `\xNN[\]` hex escapes (e.g. `1er\xa0\mai` — a hex-escaped
  //    non-breaking space followed by a stray backslash). nbsp becomes a
  //    regular space; other printable ASCII codepoints decode to the char;
  //    everything else is dropped.
  out = out.replace(/\\x([0-9a-fA-F]{2})\\?/g, (_, hex) => {
    const code = parseInt(hex, 16);
    if (code === 0xa0) return ' ';
    if (code >= 0x20 && code < 0x7f) return String.fromCodePoint(code);
    return '';
  });
  // 5. CSS-style hex escapes that travel without the `x` prefix
  //    (e.g. `\2f\` → `/`, `\3a\` → `:`). Only resolve printable ASCII.
  out = out.replace(/\\([0-9a-fA-F]{2})\\?/g, (_, hex) => {
    const code = parseInt(hex, 16);
    if (code >= 0x20 && code < 0x7f) return String.fromCodePoint(code);
    return '';
  });
  // 6. Drop ambiguous 4-digit runs (year-shaped artefacts).
  out = out.replace(/\\[0-9]{4}\\?/g, '');
  // 7. Strip Unicode variation selectors (U+FE0E, U+FE0F) and zero-width
  //    spaces that travel with emoji and obscure the text rendering.
  out = out.replace(/[​-‍︎️⁠]/g, '');
  // 8. Final safety net: any remaining bare backslash is an upstream
  //    encoding artefact (real newlines / quotes are already decoded above).
  out = out.replace(/\\/g, '');
  // 9. Collapse runs of spaces left by step 4 so the body doesn't show
  //    suspicious whitespace gaps where `\xa0\` stood.
  out = out.replace(/[ \t]{2,}/g, ' ');
  return out.trim();
}

// Variant for RSS feed output: cleanText() then flatten line feeds into
// single spaces and re-collapse runs. Feed readers vary in how they render
// raw LFs inside <content:encoded>; flattening keeps items single-line.
export function cleanForFeed(text: string): string {
  return cleanText(text)
    .replace(/[\r\n]+/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

// Defensive cleaner for chat-citation card bodies, run client-side so the
// UI is hardened against backend hiccups (residual literal escapes, stray
// quoting, locale-naive whitespace).
//
// Differences vs cleanText:
//   - Citations are always rendered single-line — flatten ANY newline form
//     (real LF/CR, literal `\n`) to a single space rather than preserving
//     paragraph breaks.
//   - Drop wrapping quotes (single OR double — Bluesky bodies sometimes
//     get wrapped at one or both ends).
//   - Insert NBSP (U+00A0) around French guillemets (« … ») per
//     typographical convention. Preserves existing NBSP, never doubles.
//
// Safe to apply after cleanText output too (idempotent on already-clean input).
export function cleanCitationText(text: string): string {
  if (!text) return '';
  let out = repairMojibake(text);

  // 1. Strip wrapping quotes (single or double). Repeat for "'X'" / "\"X\"".
  while (
    (out.startsWith('"') && out.endsWith('"')) ||
    (out.startsWith("'") && out.endsWith("'"))
  ) {
    const next = out.slice(1, -1);
    if (next === out) break;
    out = next;
  }

  // 2. Decode JSON-literal escapes that the backend's PHP TextCleaner
  //    can't address (it only sees real bytes; literal `\n` / `\xNN`
  //    in upstream Bluesky snapshots survive the embed pass intact).
  out = out.replace(/\\n/g, '\n');
  out = out.replace(/\\'/g, "'").replace(/\\"/g, '"');
  out = out.replace(/\\x([0-9a-fA-F]{4})\\?/g, (_, hex) => {
    const code = parseInt(hex, 16);
    if (code === 0xa0 || code === 0x2007 || code === 0x202f) return ' ';
    if (code < 0x20 || (code >= 0x7f && code < 0xa0)) return '';
    try {
      return String.fromCodePoint(code);
    } catch {
      return '';
    }
  });
  out = out.replace(/\\x([0-9a-fA-F]{2})\\?/g, (_, hex) => {
    const code = parseInt(hex, 16);
    if (code === 0xa0) return ' ';
    if (code >= 0x20 && code < 0x7f) return String.fromCodePoint(code);
    return '';
  });
  out = out.replace(/\\/g, '');

  // 3. Flatten ALL whitespace forms (newlines, tabs, real NBSP, narrow NBSP,
  //    figure-space, BOM, zero-width) to a single regular space. Citation
  //    cards are single-line by design.
  out = out.replace(/[\s   ​-‍﻿]+/g, ' ').trim();

  // 4. French typography: ensure « is followed by exactly one NBSP, and
  //    » is preceded by exactly one NBSP. NBSP keeps the guillemet glued
  //    to its content across line wraps. Idempotent: a citation already
  //    formatted with NBSPs stays unchanged. Done after whitespace
  //    collapse so we know what's actually adjacent.
  out = out.replace(/«\s*/g, '« ');
  out = out.replace(/\s*»/g, ' »');

  return out;
}
