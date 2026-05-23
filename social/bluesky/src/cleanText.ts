// Mirrored from next/lib/cleanText.ts. Kept in-workspace rather than imported
// across workspaces because `next/` is built as a Next app, not a library, and
// cross-bundler imports are painful. Any change here should be mirrored there
// (and in org.revue-de-presse.bsky/src/clean_text.pl — that Prolog port now
// runs the same normalisation at the upstream repository write boundary).
//
// Role today: legacy-data fallback for rows ingested before the upstream
// cleaner landed. Fresh rows arrive already-clean, but this still runs on
// every fetch since the API does not stamp a "cleaned-at" marker we can use
// to skip work on new rows.

export function repairMojibake(text: string): string {
  if (!text) return '';
  if (!/[ÂÃ][\x80-\xBF]/.test(text)) return text;
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

export function cleanText(text: string): string {
  if (!text) return '';
  let out = repairMojibake(text);
  if (out.startsWith('"') && out.endsWith('"')) {
    out = out.slice(1, -1);
  }
  out = out.replace(/\\n/g, '\n');
  out = out.replace(/\\'/g, "'").replace(/\\"/g, '"');
  // Decode 4-hex-digit `\xNNNN\?` escapes (Unicode codepoints, e.g. U+202F
  // NARROW NO-BREAK SPACE used in French before `:` / `;` / `!` / `?`).
  // Must run BEFORE the 2-digit step below, otherwise the 2-digit step would
  // consume the first two hex chars and leak the remaining two as literal.
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
  out = out.replace(/\\([0-9a-fA-F]{2})\\?/g, (_, hex) => {
    const code = parseInt(hex, 16);
    if (code >= 0x20 && code < 0x7f) return String.fromCodePoint(code);
    return '';
  });
  out = out.replace(/\\[0-9]{4}\\?/g, '');
  out = out.replace(/[​-‍︎️⁠]/g, '');
  out = out.replace(/\\/g, '');
  out = out.replace(/[ \t]{2,}/g, ' ');
  return out.trim();
}
