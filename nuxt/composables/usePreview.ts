// Whether this browsing session previews the features not released yet (the
// Coop Médias lists and the newsletter); see utils/preview.ts. Decided on the
// server for each page request (server/middleware/preview.ts) and handed to
// the browser with the page, so the first paint already matches.
export function usePreview() {
  return useState<boolean>('rdp-preview', () =>
    import.meta.server ? useRequestEvent()?.context.preview === true : false,
  );
}
