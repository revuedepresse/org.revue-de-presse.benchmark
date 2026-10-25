<script setup lang="ts">
import type { NuxtError } from '#app';

// Errors render inside the site's own shell (header, calendar, sidebar),
// never Nuxt's default error screen. An unknown address keeps its 404
// status; the panel says there is nothing at that address.
const props = defineProps<{ error: NuxtError }>();

const notFound = computed(() => props.error.statusCode === 404);

useHead({ title: notFound.value ? 'Contenu introuvable — Revue de presse' : 'Page indisponible — Revue de presse' });
</script>

<template>
  <AppShell initial-view="main" :notice-message-key="notFound ? 'errors.no-content' : 'errors.upstream'" />
</template>
