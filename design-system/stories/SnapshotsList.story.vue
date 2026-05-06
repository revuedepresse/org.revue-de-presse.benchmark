<script setup lang="ts">
import SnapshotsList from '@design-system/components/SnapshotsList.vue';
const items = [
  { id: 'agile', label: 'Agile' },
  { id: 'lean-startup', label: 'Lean startup' },
  { id: 'medias-francais', label: 'Médias français' },
  { id: 'machine-learning', label: 'Machine learning' },
  { id: 'php', label: 'PHP' },
];
</script>

<template>
  <Story title="Organisms/SnapshotsList">
    <Variant title="inline, item selected">
      <SnapshotsList :items="items" selected-id="medias-francais" />
    </Variant>
    <Variant title="empty">
      <SnapshotsList :items="[]" />
    </Variant>
  </Story>
</template>
