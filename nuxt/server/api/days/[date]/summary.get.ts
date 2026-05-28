// Browser → Nitro → API Platform upstream proxy for the daily-summary
// resource. The upstream endpoint is public (no Bearer required — see
// security.yaml access_control), so this proxy is straight pass-through.
// A separate route exists so that:
//   - the API base URL stays a server-side secret (the same NUXT_API_BASE_URL
//     used by /api/highlights),
//   - 404s from upstream bubble back to the client as 404 (so AppShell can
//     render the "Aucune synthèse" empty state),
//   - any other upstream error becomes a 502 with a clear message.

type SummaryUpstream = {
  '@context'?: string;
  '@id'?: string;
  '@type'?: string;
  date: string;
  markdown: string;
};

export default defineEventHandler(async (event) => {
  const date = getRouterParam(event, 'date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw createError({ statusCode: 400, statusMessage: 'date must be YYYY-MM-DD' });
  }

  const config = useRuntimeConfig();
  if (!config.apiBaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_API_BASE_URL is not configured' });
  }

  const url = new URL(`/api/days/${date}/summary`, config.apiBaseUrl as string);

  try {
    const body = await $fetch<SummaryUpstream>(url.toString(), {
      headers: { accept: 'application/ld+json' },
    });
    return { date: body.date, markdown: body.markdown };
  } catch (err: any) {
    const status = err?.statusCode ?? err?.response?.status;
    if (status === 404) {
      throw createError({ statusCode: 404, statusMessage: 'No summary for this date' });
    }
    throw createError({
      statusCode: 502,
      statusMessage: `Upstream summary fetch failed: ${err?.message ?? 'unknown error'}`,
    });
  }
});
