<script setup lang="ts">
import YearPicker from '@design-system/components/YearPicker.vue';
</script>

<template>
  <Story title="Molecules/YearPicker">
    <Variant title="2020-2025, 2021 selected">
      <YearPicker :year-range="{ min: 2020, max: 2025 }" :selected-year="2021" />
    </Variant>
  </Story>
</template>
