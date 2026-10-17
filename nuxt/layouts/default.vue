<script setup lang="ts">
import type { ViewKey } from '~/types/page-meta';

// One AppShell for every page. Pages only declare which view they show
// (definePageMeta({ view })), so navigating between them swaps the main
// panel instead of unmounting and rebuilding the header, calendar and sidebar.
const route = useRoute();

const view = computed<ViewKey>(() => route.meta.view ?? 'main');
const emptyMessageKey = computed(() => route.meta.emptyMessageKey);
const initialDate = computed(() => {
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
