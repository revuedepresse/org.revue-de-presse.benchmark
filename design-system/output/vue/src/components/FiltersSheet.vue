<template>
  <div class="rdp-filters-sheet" role="dialog" aria-modal="true">
    <div
      class="rdp-filters-sheet__scrim"
      aria-hidden="true"
      @click="async (event) => onDismiss?.()"
    ></div>
    <div class="rdp-filters-sheet__panel">
      <template v-if="lists.length > 1">
        <SnapshotsList
          :items="lists"
          :selectedId="selectedListId"
          :onSelect="(id) => onListSelect?.(id)"
        ></SnapshotsList>
      </template>

      <template v-if="rankings.length > 1">
        <SnapshotsList
          headingKey="ranking-list.heading"
          :items="rankings"
          :selectedId="selectedRankingId"
          :onSelect="(id) => onRankingSelect?.(id)"
        ></SnapshotsList>
      </template>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import SnapshotsList from "./SnapshotsList.vue";

type ListItem = {
  id: string;
  label: string;
};
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

const props = defineProps<FiltersSheetProps>();
</script>