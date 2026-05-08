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
  let out = text;
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
