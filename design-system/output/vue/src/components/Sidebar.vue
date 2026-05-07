<template>
  <aside class="rdp-sidebar">
    <Calendar
      :selectedDate="selectedDate"
      :locale="locale"
      :yearRange="yearRange"
      :onSelect="(d) => onDateSelect?.(d)"
    ></Calendar
    ><BannerAbout
      :onLegalNoticeClick="(event) => onLegalNoticeClick()"
      :onContactClick="(event) => onContactClick()"
      :onSupportClick="(event) => onSupportClick()"
      :onSourcesClick="(event) => onSourcesClick()"
    ></BannerAbout
    ><component :is="'style'">{{
      `
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
      `
    }}</component>
  </aside>
</template>

<script setup lang="ts">
import Calendar from "./Calendar.vue";
import BannerAbout from "./BannerAbout.vue";
import type { Locale } from "../utils/i18n";

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

const props = defineProps<SidebarProps>();
</script>