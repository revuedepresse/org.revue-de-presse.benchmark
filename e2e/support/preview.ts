import type { BrowserContext } from '@playwright/test';

// The Coop Médias lists and the newsletter are only shown in preview
// (?apercu=1, remembered in the rdp_apercu cookie) until their release.
export const PREVIEW_COOKIE = 'rdp_apercu';

export async function enablePreview(context: BrowserContext, baseURL: string | undefined): Promise<void> {
  await context.addCookies([{ name: PREVIEW_COOKIE, value: '1', url: baseURL ?? 'http://localhost:3001' }]);
}
