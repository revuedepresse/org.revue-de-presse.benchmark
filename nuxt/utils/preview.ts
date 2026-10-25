// Preview of the features not released yet (the Coop Médias lists and the
// newsletter): on only while the address carries `?apercu=1`, which in-site
// navigation keeps (middleware/preview.global.ts). Nothing remembers it, so an
// address without it, https://revue-de-presse.org/ included, always shows the
// public site: the French media only, with the choice of ranking. The cookie
// an earlier version set is cleared.
//
// Pure TS, shared by the server middleware, the highlights proxy and the app.

export const PREVIEW_QUERY_PARAM = 'apercu';
export const PREVIEW_COOKIE = 'rdp_apercu';

// Pages only reachable in preview; without it they redirect to the home page.
// /lettre-quotidienne stays public, offering the French media letter alone.
export const PREVIEW_ONLY_PATHS = ['/lettre-quotidienne-coop-medias'];

export type PreviewDecision = {
  /** Whether this request is shown the preview. */
  enabled: boolean;
  /** What to do with the cookie an earlier version set: clear it, or there is none. */
  cookie: 'clear' | 'keep';
};

function single(value: unknown): unknown {
  return Array.isArray(value) ? value[value.length - 1] : value;
}

// The preview is on only for ?apercu=1; a leftover cookie never turns it on.
export function previewFromRequest(queryValue: unknown, cookieValue: unknown): PreviewDecision {
  return {
    enabled: single(queryValue) === '1',
    cookie: cookieValue === undefined ? 'keep' : 'clear',
  };
}

export function isPreviewQuery(queryValue: unknown): boolean {
  return single(queryValue) === '1';
}

export function isPreviewOnlyPath(path: string): boolean {
  return PREVIEW_ONLY_PATHS.includes(path);
}

// The `cookie` request header once the decision applies, so that requests the
// server makes while rendering this page (the highlights proxy) see the same
// preview state as the page itself.
export function cookieHeaderAfter(header: string | undefined, decision: PreviewDecision): string | undefined {
  if (decision.cookie === 'keep') return header;
  const others = (header ?? '')
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part !== '' && !part.startsWith(`${PREVIEW_COOKIE}=`));
  return others.length > 0 ? others.join('; ') : undefined;
}
