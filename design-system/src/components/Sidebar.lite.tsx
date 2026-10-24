import Calendar from './Calendar.lite';
import BannerAbout from './BannerAbout.lite';
import SnapshotsList from './SnapshotsList.lite';
import type { Locale } from '../utils/i18n';

type ListItem = { id: string; label: string };

type SidebarProps = {
  lists?: ListItem[];
  selectedListId?: string;
  rankings?: ListItem[];
  selectedRankingId?: string;
  selectedDate: Date;
  yearRange: { min: number; max: number };
  minDate?: Date;
  locale?: Locale;
  onListSelect?: (id: string) => void;
  onRankingSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
  onLegalNoticeClick?: () => void;
  onTermsOfServiceClick?: () => void;
  onContactClick?: () => void;
  onSupportClick?: () => void;
  onSourcesClick?: () => void;
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
      <Show when={(props.lists ?? []).length > 1}>
        <SnapshotsList
          items={props.lists ?? []}
          selectedId={props.selectedListId}
          onSelect={(id: string) => props.onListSelect?.(id)}
        />
      </Show>
      <Show when={(props.rankings ?? []).length > 1}>
        <SnapshotsList
          items={props.rankings ?? []}
          selectedId={props.selectedRankingId}
          headingKey="ranking-list.heading"
          onSelect={(id: string) => props.onRankingSelect?.(id)}
        />
      </Show>
      <BannerAbout
        onLegalNoticeClick={props.onLegalNoticeClick}
        onTermsOfServiceClick={props.onTermsOfServiceClick}
        onContactClick={props.onContactClick}
        onSupportClick={props.onSupportClick}
        onSourcesClick={props.onSourcesClick}
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
