<script setup lang="ts">
definePageMeta({
  view: 'main',
  validate: (r) => /^\d{4}-\d{2}-\d{2}$/.test(String(r.params.day)),
});
</script>

<template>
  <!-- Rendered by the shared AppShell in layouts/default.vue -->
</template>
