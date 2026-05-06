<script setup lang="ts">
import Sidebar from '@design-system/components/Sidebar.vue';
const lists = [
  { id: 'agile', label: 'Agile' },
  { id: 'medias-francais', label: 'Médias français' },
  { id: 'machine-learning', label: 'Machine learning' },
];
</script>

<template>
  <Story title="Organisms/Sidebar">
    <Variant title="default">
      <Sidebar
        :lists="lists"
        selected-list-id="medias-francais"
        :selected-date="new Date(2021, 3, 6)"
        :year-range="{ min: 2020, max: 2025 }"
        locale="fr-FR"
      />
    </Variant>
  </Story>
</template>
