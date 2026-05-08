// Browser → Nitro → upstream proxy. Direct browser fetches to the legacy
// API fail CORS preflight on the `x-auth-token` header, so we route through
// Nitro which forwards from `${NUXT_API_BASE_URL}/api/twitter/highlights`
// with the token attached server-side. The token never reaches the browser.
//
// Curl-equivalent of the upstream call:
//   curl 'https://${apiBaseUrl}/api/twitter/highlights?distinctSources=1
//        &includeRetweets=0&excludeMedia=1
//        &startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&pageSize=10'
//        -H 'x-auth-token: ${apiAuthToken}'

export default defineEventHandler(async (event) => {
  const { startDate, endDate } = getQuery(event) as Record<string, string | undefined>;
  if (!startDate || !endDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'startDate and endDate query params are required',
    });
  }

  const config = useRuntimeConfig();
  if (!config.apiBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_API_BASE_URL is not configured',
    });
  }

  const url = new URL('/api/twitter/highlights', config.apiBaseUrl as string);
  url.searchParams.set('distinctSources', '1');
  url.searchParams.set('includeRetweets', '0');
  url.searchParams.set('excludeMedia', '1');
  url.searchParams.set('startDate', startDate);
  url.searchParams.set('endDate', endDate);
  url.searchParams.set('pageSize', '10');

  const headers: Record<string, string> = { accept: '*/*' };
  if (config.apiAuthToken) headers['x-auth-token'] = String(config.apiAuthToken);

  try {
    return await $fetch(url.toString(), { headers });
  } catch (err: any) {
    throw createError({
      statusCode: err?.statusCode ?? 502,
      statusMessage: `Upstream highlights fetch failed: ${err?.message ?? 'unknown error'}`,
    });
  }
});
