<script setup lang="ts">
import CalendarActionBar from '@design-system/components/CalendarActionBar.vue';
</script>

<template>
  <Story title="Molecules/CalendarActionBar">
    <Variant title="bottom (mobile)">
      <CalendarActionBar :date="new Date(2021, 3, 2)" position="bottom" />
    </Variant>
    <Variant title="top (desktop)">
      <CalendarActionBar :date="new Date(2021, 3, 2)" position="top" />
    </Variant>
  </Story>
</template>
