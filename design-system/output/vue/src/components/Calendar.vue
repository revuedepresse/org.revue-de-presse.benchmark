<template>
  <div
    role="dialog"
    :class="`rdp-calendar rdp-calendar--${presentation ?? 'inline'}`"
    :aria-modal="presentation === 'sheet' ? 'true' : 'false'"
  >
    <template v-if="presentation === 'sheet'">
      <div
        class="rdp-calendar__scrim"
        aria-hidden="true"
        @click="async (event) => onDismiss?.()"
      ></div>
    </template>

    <div class="rdp-calendar__panel">
      <CalendarActionBar
        position="top"
        :date="selectedDate"
        :locale="locale"
        :onDateClick="(event) => setView('month')"
        :onPrev="(event) => prev()"
        :onNext="(event) => next()"
      ></CalendarActionBar>
      <template v-if="viewMode === 'day'">
        <DateGrid
          :year="focusedYear"
          :month="focusedMonth"
          :selectedDate="selectedDate"
          :locale="locale"
          :onSelect="(d) => selectDay(d)"
        ></DateGrid>
      </template>

      <template v-if="viewMode === 'month'">
        <MonthPicker
          :year="focusedYear"
          :selectedMonth="focusedMonth"
          :locale="locale"
          :onSelect="(idx) => selectMonth(idx)"
        ></MonthPicker>
      </template>

      <template v-if="viewMode === 'year'">
        <YearPicker
          :yearRange="yearRange"
          :selectedYear="focusedYear"
          :onSelect="(y) => selectYear(y)"
        ></YearPicker>
      </template>
    </div>
    <component :is="'style'">{{
      `
        .rdp-calendar { font-family: 'Roboto', sans-serif; }
        .rdp-calendar--inline {
          background: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-default);
          padding: var(--separation-2);
        }
        .rdp-calendar--sheet { position: fixed; inset: 0; display: grid; align-items: end; }
        .rdp-calendar__scrim { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); }
        .rdp-calendar--sheet .rdp-calendar__panel {
          position: relative;
          background: var(--color-white);
          padding: var(--separation-2);
          border-radius: var(--radius-default) var(--radius-default) 0 0;
        }
      `
    }}</component>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import DateGrid from "./DateGrid.vue";
import MonthPicker from "./MonthPicker.vue";
import YearPicker from "./YearPicker.vue";
import CalendarActionBar from "./CalendarActionBar.vue";
import type { Locale } from "../utils/i18n";

type CalendarProps = {
  selectedDate: Date;
  locale?: Locale;
  yearRange: {
    min: number;
    max: number;
  };
  presentation?: "inline" | "sheet";
  onSelect?: (date: Date) => void;
  onDismiss?: () => void;
};

const props = defineProps<CalendarProps>();
const viewMode = ref("day");
const focusedYear = ref(0);
const focusedMonth = ref(0);
const initialised = ref(false);

function ensureInit() {
  if (!initialised.value) {
    focusedYear.value = props.selectedDate.getFullYear();
    focusedMonth.value = props.selectedDate.getMonth();
    initialised.value = true;
  }
}
function setView(mode: "day" | "month" | "year") {
  viewMode.value = mode;
}
function selectDay(d: Date) {
  focusedYear.value = d.getFullYear();
  focusedMonth.value = d.getMonth();
  props.onSelect?.(d);
}
function selectMonth(idx: number) {
  focusedMonth.value = idx;
  viewMode.value = "day";
}
function selectYear(y: number) {
  focusedYear.value = y;
  viewMode.value = "month";
}
function prev() {
  if (viewMode.value === "day") {
    const m = focusedMonth.value - 1;
    if (m < 0) {
      focusedMonth.value = 11;
      focusedYear.value -= 1;
    } else focusedMonth.value = m;
  }
}
function next() {
  if (viewMode.value === "day") {
    const m = focusedMonth.value + 1;
    if (m > 11) {
      focusedMonth.value = 0;
      focusedYear.value += 1;
    } else focusedMonth.value = m;
  }
}
</script>