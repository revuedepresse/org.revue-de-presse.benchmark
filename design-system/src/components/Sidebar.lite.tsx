import Calendar from './Calendar.lite';
import BannerAbout from './BannerAbout.lite';
import type { Locale } from '../utils/i18n';

type ListItem = { id: string; label: string };

type SidebarProps = {
  lists?: ListItem[];
  selectedListId?: string;
  selectedDate: Date;
  yearRange: { min: number; max: number };
  minDate?: Date;
  locale?: Locale;
  onListSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
  onLegalNoticeClick?: () => void;
  onTermsOfServiceClick?: () => void;
  onContactClick?: () => void;
  onSupportClick?: () => void;
  onSourcesClick?: () => void;
  onDiscuterClick?: () => void;
};

export default function Sidebar(props: SidebarProps) {
  return (
    <aside class="rdp-sidebar">
      <Calendar
        selectedDate={props.selectedDate}
        locale={props.locale}
        yearRange={props.yearRange}
        minDate={props.minDate}
        onSelect={(d: Date) => props.onDateSelect?.(d)}
      />
      <BannerAbout
        onLegalNoticeClick={props.onLegalNoticeClick}
        onTermsOfServiceClick={props.onTermsOfServiceClick}
        onContactClick={props.onContactClick}
        onSupportClick={props.onSupportClick}
        onSourcesClick={props.onSourcesClick}
        onDiscuterClick={props.onDiscuterClick}
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
