<script setup lang="ts">
import Calendar from '@design-system/components/Calendar.vue';
</script>

<template>
  <Story title="Organisms/Calendar">
    <Variant title="inline, April 2021">
      <Calendar
        :selected-date="new Date(2021, 3, 6)"
        :year-range="{ min: 2020, max: 2025 }"
        locale="fr-FR"
      />
    </Variant>
  </Story>
</template>
