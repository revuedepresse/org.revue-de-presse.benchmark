// Mirrored from next/lib/cleanText.ts. Kept in-workspace rather than imported
// across workspaces because `next/` is built as a Next app, not a library, and
// cross-bundler imports are painful. Any change here should be mirrored there
// (and vice versa).

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
