<script setup lang="ts">
const route = useRoute();

definePageMeta({
  validate: (r) => /^\d{4}-\d{2}-\d{2}$/.test(String(r.params.day)),
});

const initialDate = computed(() => {
  const [y, m, d] = String(route.params.day).split('-').map(Number);
  return new Date(y, m - 1, d);
});
</script>

<template>
  <AppShell :initial-date="initialDate" />
</template>
