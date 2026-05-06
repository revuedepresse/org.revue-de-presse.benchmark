<template>
  <aside class="rdp-sidebar">
    <SnapshotsList
      :items="lists"
      :selectedId="selectedListId"
      :onSelect="(id) => onListSelect?.(id)"
    ></SnapshotsList
    ><Calendar
      :selectedDate="selectedDate"
      :locale="locale"
      :yearRange="yearRange"
      :onSelect="(d) => onDateSelect?.(d)"
    ></Calendar
    ><BannerAbout></BannerAbout><Footer></Footer
    ><component :is="'style'">{{
      `
        .rdp-sidebar {
          width: 336px;
          display: flex;
          flex-direction: column;
          gap: var(--separation-2);
        }
      `
    }}</component>
  </aside>
</template>

<script setup lang="ts">
import SnapshotsList from "./SnapshotsList.vue";
import Calendar from "./Calendar.vue";
import BannerAbout from "./BannerAbout.vue";
import Footer from "./Footer.vue";
import type { Locale } from "../utils/i18n";

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

const props = defineProps<SidebarProps>();
</script>