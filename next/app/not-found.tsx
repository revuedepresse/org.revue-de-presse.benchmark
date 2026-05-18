import AppShellClient from '@/components/AppShellClient';

// Renders the same shell as /contenu-introuvable so a bad URL lands
// in a familiar place rather than Next's default 404 page.
export default function NotFound() {
  return <AppShellClient emptyMessageKey="alert.empty.no-content-for-date" />;
}
