<template>
  <aside class="rdp-sidebar">
    <Calendar
      :selectedDate="selectedDate"
      :locale="locale"
      :yearRange="yearRange"
      :minDate="minDate"
      :onSelect="(d) => onDateSelect?.(d)"
    ></Calendar>
    <template v-if="(lists ?? []).length > 1">
      <SnapshotsList
        :items="lists ?? []"
        :selectedId="selectedListId"
        :onSelect="(id) => onListSelect?.(id)"
      ></SnapshotsList>
    </template>

    <template v-if="(rankings ?? []).length > 1">
      <SnapshotsList
        headingKey="ranking-list.heading"
        :items="rankings ?? []"
        :selectedId="selectedRankingId"
        :onSelect="(id) => onRankingSelect?.(id)"
      ></SnapshotsList>
    </template>

    <BannerAbout
      :onLegalNoticeClick="(event) => onLegalNoticeClick()"
      :onTermsOfServiceClick="(event) => onTermsOfServiceClick()"
      :onContactClick="(event) => onContactClick()"
      :onSupportClick="(event) => onSupportClick()"
      :onSourcesClick="(event) => onSourcesClick()"
    ></BannerAbout
    >
  </aside>
</template>

<script setup lang="ts">
import Calendar from "./Calendar.vue";
import BannerAbout from "./BannerAbout.vue";
import SnapshotsList from "./SnapshotsList.vue";
import type { Locale } from "../utils/i18n";

type ListItem = {
  id: string;
  label: string;
};
type SidebarProps = {
  lists?: ListItem[];
  selectedListId?: string;
  rankings?: ListItem[];
  selectedRankingId?: string;
  selectedDate: Date;
  yearRange: {
    min: number;
    max: number;
  };
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

const props = defineProps<SidebarProps>();
</script>