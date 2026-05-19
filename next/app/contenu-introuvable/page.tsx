import AppShellClient from '@/components/AppShellClient';

export default function ContenuIntrouvablePage() {
  // Seeding with [] short-circuits useHighlights' first fetch — the page
  // exists to show "no content", so there is nothing to load. Without a
  // seed the hook starts in loading state and the loading→empty swap on
  // mount produces a ~0.4 CLS that tanks the Lighthouse perf score.
  return (
    <AppShellClient
      emptyMessageKey="alert.empty.no-content-for-date"
      initialStatuses={[]}
    />
  );
}
