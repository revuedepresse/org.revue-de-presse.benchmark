<template>
  <ul class="rdp-year-picker" role="listbox">
    <template :key="index" v-for="(y, index) in years">
      <li
        role="option"
        :aria-selected="y === selectedYear ? 'true' : 'false'"
        :class="`rdp-year-picker__item${
          y === selectedYear ? ' rdp-year-picker__item--selected' : ''
        }`"
        @click="async (event) => onSelect?.(y)"
      >
        {{ y }}
      </li> </template
    >
  </ul>
</template>

<script setup lang="ts">
import { computed } from "vue";

type YearPickerProps = {
  yearRange: {
    min: number;
    max: number;
  };
  selectedYear: number;
  onSelect?: (year: number) => void;
};

const props = defineProps<YearPickerProps>();

const years = computed(() => {
  return Array.from(
    {
      length: props.yearRange.max - props.yearRange.min + 1,
    },
    (_, i) => props.yearRange.min + i
  );
});
</script>