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
      <template v-if="presentation !== 'sheet'">
        <CalendarActionBar
          position="top"
          :date="focusedDate"
          :locale="locale"
          :onPrev="(event) => prevDay()"
          :onNext="(event) => nextDay()"
          :prevDisabled="prevDayDisabled"
          :nextDisabled="nextDayDisabled"
        ></CalendarActionBar>
      </template>

      <CalendarMonthBar
        :viewMode="viewMode"
        :focusedYear="focusedYear"
        :focusedMonth="focusedMonth"
        :locale="locale"
        :onTitleClick="(event) => titleClick()"
        :onPrev="(event) => prevMonth()"
        :onNext="(event) => nextMonth()"
        :prevDisabled="prevMonthDisabled"
        :nextDisabled="nextMonthDisabled"
      ></CalendarMonthBar>
      <template v-if="viewMode === 'day'">
        <DateGrid
          :year="focusedYear"
          :month="focusedMonth"
          :selectedDate="focusedDate"
          :minDate="minDate"
          :locale="locale"
          :onSelect="(d) => selectDay(d)"
        ></DateGrid>
      </template>

      <template v-if="viewMode === 'month'">
        <MonthPicker
          :year="focusedYear"
          :selectedMonth="focusedMonth"
          :minDate="minDate"
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
          padding: 0;
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
import { computed, onMounted, ref, watch } from "vue";

import DateGrid from "./DateGrid.vue";
import MonthPicker from "./MonthPicker.vue";
import YearPicker from "./YearPicker.vue";
import CalendarActionBar from "./CalendarActionBar.vue";
import CalendarMonthBar from "./CalendarMonthBar.vue";
import type { Locale } from "../utils/i18n";

type CalendarProps = {
  selectedDate: Date;
  locale?: Locale;
  yearRange: {
    min: number;
    max: number;
  };
  minDate?: Date;
  presentation?: "inline" | "sheet";
  onSelect?: (date: Date) => void;
  onDismiss?: () => void;
};

const props = defineProps<CalendarProps>();
const viewMode = ref("day");
const focusedDate = ref(new Date());
const focusedYear = ref(0);
const focusedMonth = ref(0);
const initialised = ref(false);

onMounted(() => {
  focusedDate.value = props.selectedDate;
  focusedYear.value = props.selectedDate.getFullYear();
  focusedMonth.value = props.selectedDate.getMonth();
  initialised.value = true;
});

const prevDayDisabled = computed(() => {
  if (!props.minDate) return false;
  const cur = new Date(
    focusedDate.value.getFullYear(),
    focusedDate.value.getMonth(),
    focusedDate.value.getDate()
  );
  const min = new Date(
    props.minDate.getFullYear(),
    props.minDate.getMonth(),
    props.minDate.getDate()
  );
  return cur.getTime() <= min.getTime();
});
const nextDayDisabled = computed(() => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const cur = new Date(
    focusedDate.value.getFullYear(),
    focusedDate.value.getMonth(),
    focusedDate.value.getDate()
  );
  return cur.getTime() >= yesterday.getTime();
});
const prevMonthDisabled = computed(() => {
  if (viewMode.value === "year") {
    if (!props.yearRange) return false;
    return focusedYear.value <= props.yearRange.min;
  }
  if (!props.minDate) return false;
  const minY = props.minDate.getFullYear();
  const minM = props.minDate.getMonth();
  if (focusedYear.value < minY) return true;
  if (focusedYear.value > minY) return false;
  return focusedMonth.value <= minM;
});
const nextMonthDisabled = computed(() => {
  const today = new Date();
  const curY = today.getFullYear();
  const curM = today.getMonth();
  if (viewMode.value === "year") {
    if (!props.yearRange) return false;
    return focusedYear.value >= props.yearRange.max;
  }
  if (focusedYear.value > curY) return true;
  if (focusedYear.value < curY) return false;
  return focusedMonth.value >= curM;
});

watch(
  () => [props.selectedDate],
  () => {
    focusedDate.value = props.selectedDate;
    focusedYear.value = props.selectedDate.getFullYear();
    focusedMonth.value = props.selectedDate.getMonth();
  },
  { immediate: true }
);
function selectDay(d: Date) {
  focusedDate.value = d;
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
function prevDay() {
  const next = new Date(focusedDate.value);
  next.setDate(next.getDate() - 1);
  focusedDate.value = next;
  focusedYear.value = next.getFullYear();
  focusedMonth.value = next.getMonth();
  props.onSelect?.(next);
}
function nextDay() {
  const next = new Date(focusedDate.value);
  next.setDate(next.getDate() + 1);
  focusedDate.value = next;
  focusedYear.value = next.getFullYear();
  focusedMonth.value = next.getMonth();
  props.onSelect?.(next);
}
function prevMonth() {
  if (viewMode.value === "year") {
    const next = focusedYear.value - 1;
    if (next >= props.yearRange.min) focusedYear.value = next;
    return;
  }
  const m = focusedMonth.value - 1;
  if (m < 0) {
    focusedMonth.value = 11;
    focusedYear.value -= 1;
  } else {
    focusedMonth.value = m;
  }
}
function nextMonth() {
  if (viewMode.value === "year") {
    const next = focusedYear.value + 1;
    if (next <= props.yearRange.max) focusedYear.value = next;
    return;
  }
  const m = focusedMonth.value + 1;
  if (m > 11) {
    focusedMonth.value = 0;
    focusedYear.value += 1;
  } else {
    focusedMonth.value = m;
  }
}
function titleClick() {
  if (viewMode.value === "day") {
    viewMode.value = "month";
  } else if (viewMode.value === "month") {
    viewMode.value = "year";
  }
}
</script>