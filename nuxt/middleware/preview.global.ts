import { PREVIEW_QUERY_PARAM, isPreviewOnlyPath, isPreviewQuery } from '~/utils/preview';

// The preview lives in the address alone (utils/preview.ts): once a page is
// opened with ?apercu=1, every in-site navigation keeps it, so the reader can
// click around; an address typed or opened without it is the public site.
export default defineNuxtRouteMiddleware((to, from) => {
  const preview = usePreview();
  const asked = to.query[PREVIEW_QUERY_PARAM];
  if (import.meta.client && asked === undefined && isPreviewQuery(from.query[PREVIEW_QUERY_PARAM]) && to.fullPath !== from.fullPath) {
    return navigateTo({ path: to.path, query: { ...to.query, [PREVIEW_QUERY_PARAM]: '1' }, hash: to.hash }, { replace: true });
  }
  if (import.meta.client) {
    preview.value = isPreviewQuery(asked);
  }
  if (!preview.value && isPreviewOnlyPath(to.path)) {
    return navigateTo('/', { redirectCode: 302 });
  }
});
