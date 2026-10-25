<script setup lang="ts">
import type { ViewKey } from '~/types/page-meta';

// One AppShell for every page. Pages only declare which view they show
// (definePageMeta({ view })), so navigating between them swaps the main
// panel instead of unmounting and rebuilding the header, calendar and sidebar.
const route = useRoute();

const view = computed<ViewKey>(() => route.meta.view ?? 'main');
const emptyMessageKey = computed(() => route.meta.emptyMessageKey);
const initialDate = computed(() => {
  // `/` always means yesterday's top 10, even when arriving from another day.
  if (route.path === '/') {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  const day = route.params.day;
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return undefined;
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d);
});
</script>

<template>
  <AppShell :initial-view="view" :initial-date="initialDate" :empty-message-key="emptyMessageKey" />
  <slot />
</template>
