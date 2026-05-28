import type { Page, Locator } from '@playwright/test';
import { ymd } from './seeded';

type ViewKey = 'main' | 'legal' | 'terms' | 'contact' | 'support' | 'sources';

export const appShell = (p: Page): Locator => p.locator('[data-testid="app-shell"]');
export const postCards = (p: Page): Locator => p.locator('[data-testid="post-card"]');
export const calendar = (p: Page): Locator => p.locator('[data-testid="calendar"]');
export const calendarDate = (p: Page, date: Date): Locator =>
  p.locator(`[data-testid="calendar-date"][data-date="${ymd(date)}"]`);
export const viewButton = (p: Page, view: ViewKey): Locator =>
  p.locator(`[data-testid="view-button"][data-view="${view}"]`);

// Open the calendar if it isn't already visible. On desktop the calendar
// is always inline inside the sidebar; on mobile it opens via a toggle.
// We assert visibility instead of clicking a trigger blindly so the helper
// works for both layouts.
export async function openCalendar(p: Page): Promise<void> {
  const cal = calendar(p);
  if (!(await cal.isVisible().catch(() => false))) {
    // Mobile path: tap the date-display in the header. Selector may need
    // tuning at first run; we try aria-name match first.
    await p.getByRole('button', { name: /date/i }).first().click().catch(() => undefined);
  }
  await cal.waitFor({ state: 'visible' });
}

// Navigate calendar prev-month-by-month until the target day cell is visible,
// then click it. The traversal spec only picks past dates, so prev is correct.
export async function clickDate(p: Page, date: Date): Promise<void> {
  const target = calendarDate(p, date);
  for (let i = 0; i < 24; i++) {
    if (await target.isVisible().catch(() => false)) break;
    const prev = p.getByRole('button', { name: /prev|précédent/i }).first();
    await prev.click();
    await p.waitForTimeout(50);
  }
  await target.click();
}
