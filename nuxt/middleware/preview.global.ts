import {
  PREVIEW_COOKIE,
  PREVIEW_QUERY_PARAM,
  isPreviewOnlyPath,
  previewFromRequest,
} from '~/utils/preview';

// The server decides on page requests (server/middleware/preview.ts); in the
// browser, follow ?apercu= on navigations within the site too, and keep the
// newsletter pages out of reach without the preview.
export default defineNuxtRouteMiddleware((to) => {
  const preview = usePreview();
  if (import.meta.client) {
    const decision = previewFromRequest(to.query[PREVIEW_QUERY_PARAM], preview.value ? '1' : undefined);
    if (decision.cookie !== 'keep') {
      useCookie(PREVIEW_COOKIE, { path: '/', sameSite: 'lax' }).value = decision.cookie === 'set' ? '1' : null;
    }
    preview.value = decision.enabled;
  }
  if (!preview.value && isPreviewOnlyPath(to.path)) {
    return navigateTo('/', { redirectCode: 302 });
  }
});
