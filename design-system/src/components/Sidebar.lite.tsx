import SnapshotsList from './SnapshotsList.lite';
import Calendar from './Calendar.lite';
import BannerAbout from './BannerAbout.lite';
import Footer from './Footer.lite';
import type { Locale } from '../utils/i18n';

type ListItem = { id: string; label: string };

type SidebarProps = {
  lists: ListItem[];
  selectedListId?: string;
  selectedDate: Date;
  yearRange: { min: number; max: number };
  locale?: Locale;
  onListSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
};

export default function Sidebar(props: SidebarProps) {
  return (
    <aside class="rdp-sidebar">
      <SnapshotsList
        items={props.lists}
        selectedId={props.selectedListId}
        onSelect={(id: string) => props.onListSelect?.(id)}
      />
      <Calendar
        selectedDate={props.selectedDate}
        locale={props.locale}
        yearRange={props.yearRange}
        onSelect={(d: Date) => props.onDateSelect?.(d)}
      />
      <BannerAbout />
      <Footer />
      <style>{`
        .rdp-sidebar {
          width: 336px;
          max-width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: var(--separation-2);
          min-width: 0;
        }
        .rdp-sidebar > * { min-width: 0; max-width: 100%; box-sizing: border-box; }
      `}</style>
    </aside>
  );
}
