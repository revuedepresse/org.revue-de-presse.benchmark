import { Locale } from "../utils/i18n";

import BannerAbout from "./BannerAbout.jsx";

import Calendar from "./Calendar.jsx";

import Footer from "./Footer.jsx";

import SnapshotsList from "./SnapshotsList.jsx";

import { $, Fragment, component$, h } from "@builder.io/qwik";

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
export const Sidebar = component$((props: SidebarProps) => {
  return (
    <aside class="rdp-sidebar">
      <SnapshotsList
        items={props.lists}
        selectedId={props.selectedListId}
        onSelect$={$((event) => props.onListSelect?.(id))}
      ></SnapshotsList>
      <Calendar
        selectedDate={props.selectedDate}
        locale={props.locale}
        yearRange={props.yearRange}
        onSelect$={$((event) => props.onDateSelect?.(d))}
      ></Calendar>
      <BannerAbout></BannerAbout>
      <Footer></Footer>
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
});

export default Sidebar;
