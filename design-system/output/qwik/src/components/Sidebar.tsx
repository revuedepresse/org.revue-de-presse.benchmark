import { Locale } from "../utils/i18n";

import BannerAbout from "./BannerAbout.jsx";

import Calendar from "./Calendar.jsx";

import { $, Fragment, component$, h } from "@builder.io/qwik";

type ListItem = {
  id: string;
  label: string;
};
type SidebarProps = {
  lists?: ListItem[];
  selectedListId?: string;
  selectedDate: Date;
  yearRange: {
    min: number;
    max: number;
  };
  locale?: Locale;
  onListSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
  onLegalNoticeClick?: () => void;
  onContactClick?: () => void;
  onSupportClick?: () => void;
  onSourcesClick?: () => void;
};
export const Sidebar = component$((props: SidebarProps) => {
  return (
    <aside class="rdp-sidebar">
      <Calendar
        selectedDate={props.selectedDate}
        locale={props.locale}
        yearRange={props.yearRange}
        onSelect$={$((event) => props.onDateSelect?.(d))}
      ></Calendar>
      <BannerAbout
        onLegalNoticeClick$={$((event) => props.onLegalNoticeClick())}
        onContactClick$={$((event) => props.onContactClick())}
        onSupportClick$={$((event) => props.onSupportClick())}
        onSourcesClick$={$((event) => props.onSourcesClick())}
      ></BannerAbout>
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
});

export default Sidebar;
