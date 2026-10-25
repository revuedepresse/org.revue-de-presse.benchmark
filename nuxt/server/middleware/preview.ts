import {
  PREVIEW_COOKIE,
  PREVIEW_QUERY_PARAM,
  cookieHeaderAfter,
  isPreviewOnlyPath,
  previewFromRequest,
} from '../../utils/preview';

// Decides, before the page renders, whether this request previews the
// features not released yet: only with ?apercu=1 in the address. The server
// then already renders what the reader will see, with no list picker or
// newsletter invitation appearing or vanishing once the page has loaded. The
// cookie an earlier version set to remember the preview is cleared.
export default defineEventHandler((event) => {
  const decision = previewFromRequest(
    getQuery(event)[PREVIEW_QUERY_PARAM],
    getCookie(event, PREVIEW_COOKIE),
  );

  if (decision.cookie === 'clear') {
    deleteCookie(event, PREVIEW_COOKIE, { path: '/', sameSite: 'lax', secure: isSecure(event) });
  }
  // Requests made while rendering this page (to the highlights proxy) forward
  // the request's cookies: let them carry the decision just taken.
  event.node.req.headers.cookie = cookieHeaderAfter(event.node.req.headers.cookie, decision);
  if (event.node.req.headers.cookie === undefined) delete event.node.req.headers.cookie;

  event.context.preview = decision.enabled;

  // The newsletter pages are not released yet.
  if (!decision.enabled && isPreviewOnlyPath(getRequestURL(event).pathname)) {
    return sendRedirect(event, '/', 302);
  }
});

function isSecure(event: Parameters<typeof getRequestURL>[0]): boolean {
  return getRequestURL(event).protocol === 'https:';
}
