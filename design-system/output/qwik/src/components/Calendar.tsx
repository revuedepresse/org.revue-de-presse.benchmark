import { Locale } from "../utils/i18n";

import CalendarActionBar from "./CalendarActionBar.jsx";

import DateGrid from "./DateGrid.jsx";

import MonthPicker from "./MonthPicker.jsx";

import YearPicker from "./YearPicker.jsx";

import { $, Fragment, component$, h, useStore } from "@builder.io/qwik";

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
export const ensureInit = function ensureInit(props, state) {
  if (!state.initialised) {
    state.focusedYear = props.selectedDate.getFullYear();
    state.focusedMonth = props.selectedDate.getMonth();
    state.initialised = true;
  }
};
export const setView = function setView(
  props,
  state,
  mode: "day" | "month" | "year"
) {
  state.viewMode = mode;
};
export const selectDay = function selectDay(props, state, d: Date) {
  state.focusedYear = d.getFullYear();
  state.focusedMonth = d.getMonth();
  props.onSelect?.(d);
};
export const selectMonth = function selectMonth(props, state, idx: number) {
  state.focusedMonth = idx;
  state.viewMode = "day";
};
export const selectYear = function selectYear(props, state, y: number) {
  state.focusedYear = y;
  state.viewMode = "month";
};
export const prev = function prev(props, state) {
  if (state.viewMode === "day") {
    const m = state.focusedMonth - 1;
    if (m < 0) {
      state.focusedMonth = 11;
      state.focusedYear -= 1;
    } else state.focusedMonth = m;
  }
};
export const next = function next(props, state) {
  if (state.viewMode === "day") {
    const m = state.focusedMonth + 1;
    if (m > 11) {
      state.focusedMonth = 0;
      state.focusedYear += 1;
    } else state.focusedMonth = m;
  }
};
export const Calendar = component$((props: CalendarProps) => {
  const state = useStore<any>({
    focusedMonth: 0,
    focusedYear: 0,
    initialised: false,
    viewMode: "day",
  });

  return (
    <div
      role="dialog"
      class={`rdp-calendar rdp-calendar--${props.presentation ?? "inline"}`}
      aria-modal={(() => {
        props.presentation === "sheet" ? "true" : "false";
      })()}
    >
      {props.presentation === "sheet" ? (
        <div
          class="rdp-calendar__scrim"
          aria-hidden="true"
          onClick$={$((event) => props.onDismiss?.())}
        ></div>
      ) : null}
      <div class="rdp-calendar__panel">
        <CalendarActionBar
          position="top"
          date={props.selectedDate}
          locale={props.locale}
          onDateClick$={$((event) => setView(props, state, "month"))}
          onPrev$={$((event) => prev(props, state))}
          onNext$={$((event) => next(props, state))}
        ></CalendarActionBar>
        {state.viewMode === "day" ? (
          <DateGrid
            year={state.focusedYear}
            month={state.focusedMonth}
            selectedDate={props.selectedDate}
            locale={props.locale}
            onSelect$={$((event) => selectDay(props, state, d))}
          ></DateGrid>
        ) : null}
        {state.viewMode === "month" ? (
          <MonthPicker
            year={state.focusedYear}
            selectedMonth={state.focusedMonth}
            locale={props.locale}
            onSelect$={$((event) => selectMonth(props, state, idx))}
          ></MonthPicker>
        ) : null}
        {state.viewMode === "year" ? (
          <YearPicker
            yearRange={props.yearRange}
            selectedYear={state.focusedYear}
            onSelect$={$((event) => selectYear(props, state, y))}
          ></YearPicker>
        ) : null}
      </div>
      <style>{`
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
      `}</style>
    </div>
  );
});

export default Calendar;
