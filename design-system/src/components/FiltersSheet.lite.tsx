import SnapshotsList from './SnapshotsList.lite';

type ListItem = { id: string; label: string };

type FiltersSheetProps = {
  lists: ListItem[];
  selectedListId?: string;
  rankings: ListItem[];
  selectedRankingId?: string;
  onListSelect?: (id: string) => void;
  onRankingSelect?: (id: string) => void;
  onDismiss?: () => void;
};

// Mobile bottom sheet gathering the list and ranking pickers, opened from the
// bottom dock like the calendar.
export default function FiltersSheet(props: FiltersSheetProps) {
  return (
    <div class="rdp-filters-sheet" role="dialog" aria-modal="true">
      <div
        class="rdp-filters-sheet__scrim"
        onClick={() => props.onDismiss?.()}
        aria-hidden="true"
      />
      <div class="rdp-filters-sheet__panel">
        <Show when={props.lists.length > 1}>
          <SnapshotsList
            items={props.lists}
            selectedId={props.selectedListId}
            onSelect={(id: string) => props.onListSelect?.(id)}
          />
        </Show>
        <Show when={props.rankings.length > 1}>
          <SnapshotsList
            items={props.rankings}
            selectedId={props.selectedRankingId}
            headingKey="ranking-list.heading"
            onSelect={(id: string) => props.onRankingSelect?.(id)}
          />
        </Show>
      </div>
      <style>{`
        .rdp-filters-sheet { position: fixed; inset: 0; display: grid; align-items: end; z-index: 30; }
        .rdp-filters-sheet__scrim { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); }
        .rdp-filters-sheet__panel {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: var(--separation-2);
          background: var(--color-taupe-grey);
          padding: var(--separation-2);
          border-radius: var(--radius-default) var(--radius-default) 0 0;
        }
      `}</style>
    </div>
  );
}
