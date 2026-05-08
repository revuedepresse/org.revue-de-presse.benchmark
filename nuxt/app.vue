<script setup lang="ts">
import App from '@design-system/components/App.vue';

const { lists } = useSampleData();

const layout = ref<'desktop' | 'mobile'>('desktop');

function yesterday(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

const pickedDate = ref<Date>(yesterday());

// Earliest date the upstream API has data for.
const minDate = new Date(2025, 2, 4); // 4 March 2025
const yearRange = { min: minDate.getFullYear(), max: new Date().getFullYear() };

const { posts, loading } = useHighlights(pickedDate);

function syncLayout() {
  if (typeof window === 'undefined') return;
  layout.value = window.matchMedia('(max-width: 600px)').matches ? 'mobile' : 'desktop';
}

onMounted(() => {
  syncLayout();
  window.addEventListener('resize', syncLayout);
});
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('resize', syncLayout);
});
</script>

<template>
  <App
    :layout="layout"
    :authenticated="false"
    :posts="posts"
    :picked-date="pickedDate"
    :lists="lists"
    selected-list-id="medias-francais"
    :year-range="yearRange"
    :min-date="minDate"
    :loading="loading"
    locale="fr-FR"
    @date-select="(d: Date) => (pickedDate = d)"
    @logo-click="() => (pickedDate = yesterday())"
  />
</template>

<style>
html,
body,
#__nuxt {
  margin: 0;
  padding: 0;
  background: var(--color-taupe-grey);
  font-family: 'Roboto', sans-serif;
}
</style>
