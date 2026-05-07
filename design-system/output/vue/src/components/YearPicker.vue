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
    ><component :is="'style'">{{
      `
        .rdp-year-picker {
          list-style: none; margin: 0; padding: 0;
          background: var(--color-white);
          border: 1px solid var(--color-brand);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
        }
        .rdp-year-picker__item {
          padding: var(--separation-1) var(--separation-2);
          color: var(--color-brand);
          cursor: pointer;
          border-bottom: 1px solid var(--color-brand);
          text-align: center;
        }
        .rdp-year-picker__item:last-child { border-bottom: none; }
        .rdp-year-picker__item--selected {
          background: var(--color-brand);
          color: var(--color-white);
        }
      `
    }}</component>
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