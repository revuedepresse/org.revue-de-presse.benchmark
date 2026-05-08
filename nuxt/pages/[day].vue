<script setup lang="ts">
const route = useRoute();

definePageMeta({
  validate: (r) => /^\d{4}-\d{2}-\d{2}$/.test(String(r.params.day)),
});

const dayParam = computed(() => String(route.params.day));
const initialDate = computed(() => {
  const [y, m, d] = dayParam.value.split('-').map(Number);
  return new Date(y, m - 1, d);
});
</script>

<template>
  <AppShell :initial-date="initialDate" />
</template>
