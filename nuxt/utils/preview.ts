// Preview of the features not released yet (the Coop Médias lists and the
// newsletter). `?apercu=1` on any address turns it on for the rest of the
// browsing session, through a cookie set by the server
// (server/middleware/preview.ts), and `?apercu=0` turns it off. Without it,
// the site shows the French media only, with the choice of ranking.
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
  /** What to do with the cookie: set it, clear it, or leave it as it is. */
  cookie: 'set' | 'clear' | 'keep';
};

function single(value: unknown): unknown {
  return Array.isArray(value) ? value[value.length - 1] : value;
}

// ?apercu=1 turns the preview on, ?apercu=0 off; otherwise the cookie decides.
export function previewFromRequest(queryValue: unknown, cookieValue: unknown): PreviewDecision {
  const asked = single(queryValue);
  if (asked === '1') return { enabled: true, cookie: 'set' };
  if (asked === '0') return { enabled: false, cookie: cookieValue === undefined ? 'keep' : 'clear' };
  return { enabled: cookieValue === '1', cookie: 'keep' };
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
  if (decision.cookie === 'set') others.push(`${PREVIEW_COOKIE}=1`);
  return others.length > 0 ? others.join('; ') : undefined;
}
