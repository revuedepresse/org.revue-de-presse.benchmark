<template>
  <ul
    class="rdp-month-picker"
    role="listbox"
    :aria-label="
      t('calendar.heading.year', {
        year: year,
      })
    "
  >
    <template :key="index" v-for="(name, index) in months">
      <li
        role="option"
        :aria-selected="index === selectedMonth ? 'true' : 'false'"
        :class="`rdp-month-picker__item${
          index === selectedMonth ? ' rdp-month-picker__item--selected' : ''
        }`"
        @click="async (event) => onSelect?.(index)"
      >
        {{ name }}
      </li> </template
    ><component :is="'style'">{{
      `
        .rdp-month-picker {
          list-style: none; margin: 0; padding: 0;
          background: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
        }
        .rdp-month-picker__item {
          padding: var(--separation-1) var(--separation-2);
          color: var(--color-content-text);
          cursor: pointer;
          border-bottom: 1px solid var(--color-border);
        }
        .rdp-month-picker__item:last-child { border-bottom: none; }
        .rdp-month-picker__item--selected {
          background: var(--color-brand-active);
          color: var(--color-white);
        }
      `
    }}</component>
  </ul>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { t } from "../utils/i18n";
import { localizedMonthLong } from "../utils/intl";
import type { Locale } from "../utils/i18n";

type MonthPickerProps = {
  year: number;
  selectedMonth: number; // 0..11
  locale?: Locale;
  onSelect?: (monthIndex: number) => void;
};

const props = defineProps<MonthPickerProps>();

const months = computed(() => {
  return Array.from(
    {
      length: 12,
    },
    (_, i) => localizedMonthLong(i, props.locale ?? "fr-FR")
  );
});
</script>