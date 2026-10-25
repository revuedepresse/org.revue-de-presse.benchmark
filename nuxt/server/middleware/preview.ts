import {
  PREVIEW_COOKIE,
  PREVIEW_QUERY_PARAM,
  cookieHeaderAfter,
  isPreviewOnlyPath,
  previewFromRequest,
} from '../../utils/preview';

// Turns the preview on (?apercu=1) or off (?apercu=0) and remembers it for the
// browsing session in a cookie, before the page renders, so that the server
// already renders what the reader will see: no list picker or newsletter
// invitation appearing or vanishing once the page has loaded.
//
// The cookie is a session cookie (no Max-Age): it lasts until the browser
// session ends, or until ?apercu=0.
export default defineEventHandler((event) => {
  const decision = previewFromRequest(
    getQuery(event)[PREVIEW_QUERY_PARAM],
    getCookie(event, PREVIEW_COOKIE),
  );

  if (decision.cookie === 'set') {
    setCookie(event, PREVIEW_COOKIE, '1', { path: '/', sameSite: 'lax', secure: isSecure(event) });
  } else if (decision.cookie === 'clear') {
    deleteCookie(event, PREVIEW_COOKIE, { path: '/', sameSite: 'lax' });
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
