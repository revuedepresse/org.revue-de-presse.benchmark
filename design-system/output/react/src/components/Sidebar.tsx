import * as React from "react";

type ListItem = {
  id: string;
  label: string;
};
type SidebarProps = {
  lists: ListItem[];
  selectedListId?: string;
  selectedDate: Date;
  yearRange: {
    min: number;
    max: number;
  };
  locale?: Locale;
  onListSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
};
import SnapshotsList from "./SnapshotsList";
import Calendar from "./Calendar";
import BannerAbout from "./BannerAbout";
import Footer from "./Footer";
import type { Locale } from "../utils/i18n";

function Sidebar(props: SidebarProps) {
  return (
    <aside className="rdp-sidebar">
      <SnapshotsList
        items={props.lists}
        selectedId={props.selectedListId}
        onSelect={(id) => props.onListSelect?.(id)}
      />
      <Calendar
        selectedDate={props.selectedDate}
        locale={props.locale}
        yearRange={props.yearRange}
        onSelect={(d) => props.onDateSelect?.(d)}
      />
      <BannerAbout />
      <Footer />
      <style>{`
        .rdp-sidebar {
          width: 336px;
          display: flex;
          flex-direction: column;
          gap: var(--separation-2);
        }
      `}</style>
    </aside>
  );
}

export default Sidebar;
