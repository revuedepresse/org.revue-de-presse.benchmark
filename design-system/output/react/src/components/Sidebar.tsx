import * as React from "react";

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
  minDate?: Date;
  locale?: Locale;
  onListSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
  onLegalNoticeClick?: () => void;
  onContactClick?: () => void;
  onSupportClick?: () => void;
  onSourcesClick?: () => void;
};
import Calendar from "./Calendar";
import BannerAbout from "./BannerAbout";
import type { Locale } from "../utils/i18n";

function Sidebar(props: SidebarProps) {
  return (
    <aside className="rdp-sidebar">
      <Calendar
        selectedDate={props.selectedDate}
        locale={props.locale}
        yearRange={props.yearRange}
        minDate={props.minDate}
        onSelect={(d) => props.onDateSelect?.(d)}
      />
      <BannerAbout
        onLegalNoticeClick={(event) => props.onLegalNoticeClick()}
        onContactClick={(event) => props.onContactClick()}
        onSupportClick={(event) => props.onSupportClick()}
        onSourcesClick={(event) => props.onSourcesClick()}
      />
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

export default Sidebar;
