import AppShellClient from '@/components/AppShellClient';
import { fetchHighlights } from '@/lib/highlights';

// Render dynamically so the date-dependent SSR fetch uses the current
// "yesterday" rather than a build-time snapshot.
export const dynamic = 'force-dynamic';

function yesterday(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default async function HomePage() {
  const initialDate = yesterday();
  const day = ymd(initialDate);
  // Falling back to undefined on upstream failure preserves the existing
  // client-fetch behaviour: useHighlights sees no seed and attempts a
  // normal fetch on mount.
  const initialStatuses = await fetchHighlights(day, day)
    .then((body) => body.statuses)
    .catch(() => undefined);
  return <AppShellClient initialDate={initialDate} initialStatuses={initialStatuses} />;
}
