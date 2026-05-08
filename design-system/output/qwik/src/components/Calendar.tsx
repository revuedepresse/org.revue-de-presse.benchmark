import { Locale } from "../utils/i18n";

import CalendarActionBar from "./CalendarActionBar.jsx";

import CalendarMonthBar from "./CalendarMonthBar.jsx";

import DateGrid from "./DateGrid.jsx";

import MonthPicker from "./MonthPicker.jsx";

import YearPicker from "./YearPicker.jsx";

import {
  $,
  Fragment,
  component$,
  h,
  useComputed$,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";

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
export const selectDay = function selectDay(
  props,
  state,
  prevDayDisabled,
  nextDayDisabled,
  prevMonthDisabled,
  nextMonthDisabled,
  d: Date
) {
  state.focusedDate = d;
  state.focusedYear = d.getFullYear();
  state.focusedMonth = d.getMonth();
  props.onSelect?.(d);
};
export const selectMonth = function selectMonth(
  props,
  state,
  prevDayDisabled,
  nextDayDisabled,
  prevMonthDisabled,
  nextMonthDisabled,
  idx: number
) {
  state.focusedMonth = idx;
  state.viewMode = "day";
};
export const selectYear = function selectYear(
  props,
  state,
  prevDayDisabled,
  nextDayDisabled,
  prevMonthDisabled,
  nextMonthDisabled,
  y: number
) {
  state.focusedYear = y;
  state.viewMode = "month";
};
export const prevDay = function prevDay(
  props,
  state,
  prevDayDisabled,
  nextDayDisabled,
  prevMonthDisabled,
  nextMonthDisabled
) {
  const next = new Date(state.focusedDate);
  next.setDate(next.getDate() - 1);
  state.focusedDate = next;
  state.focusedYear = next.getFullYear();
  state.focusedMonth = next.getMonth();
};
export const nextDay = function nextDay(
  props,
  state,
  prevDayDisabled,
  nextDayDisabled,
  prevMonthDisabled,
  nextMonthDisabled
) {
  const next = new Date(state.focusedDate);
  next.setDate(next.getDate() + 1);
  state.focusedDate = next;
  state.focusedYear = next.getFullYear();
  state.focusedMonth = next.getMonth();
};
export const prevMonth = function prevMonth(
  props,
  state,
  prevDayDisabled,
  nextDayDisabled,
  prevMonthDisabled,
  nextMonthDisabled
) {
  if (state.viewMode === "year") {
    const next = state.focusedYear - 1;
    if (next >= props.yearRange.min) state.focusedYear = next;
    return;
  }
  const m = state.focusedMonth - 1;
  if (m < 0) {
    state.focusedMonth = 11;
    state.focusedYear -= 1;
  } else {
    state.focusedMonth = m;
  }
};
export const nextMonth = function nextMonth(
  props,
  state,
  prevDayDisabled,
  nextDayDisabled,
  prevMonthDisabled,
  nextMonthDisabled
) {
  if (state.viewMode === "year") {
    const next = state.focusedYear + 1;
    if (next <= props.yearRange.max) state.focusedYear = next;
    return;
  }
  const m = state.focusedMonth + 1;
  if (m > 11) {
    state.focusedMonth = 0;
    state.focusedYear += 1;
  } else {
    state.focusedMonth = m;
  }
};
export const titleClick = function titleClick(
  props,
  state,
  prevDayDisabled,
  nextDayDisabled,
  prevMonthDisabled,
  nextMonthDisabled
) {
  if (state.viewMode === "day") {
    state.viewMode = "month";
  } else if (state.viewMode === "month") {
    state.viewMode = "year";
  }
};
export const Calendar = component$((props: CalendarProps) => {
  const prevDayDisabled = useComputed$(() => {
    if (!props.minDate) return false;
    const cur = new Date(
      state.focusedDate.getFullYear(),
      state.focusedDate.getMonth(),
      state.focusedDate.getDate()
    );
    const min = new Date(
      props.minDate.getFullYear(),
      props.minDate.getMonth(),
      props.minDate.getDate()
    );
    return cur.getTime() <= min.getTime();
  });
  const nextDayDisabled = useComputed$(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const cur = new Date(
      state.focusedDate.getFullYear(),
      state.focusedDate.getMonth(),
      state.focusedDate.getDate()
    );
    return cur.getTime() >= yesterday.getTime();
  });
  const prevMonthDisabled = useComputed$(() => {
    if (state.viewMode === "year") {
      if (!props.yearRange) return false;
      return state.focusedYear <= props.yearRange.min;
    }
    if (!props.minDate) return false;
    const minY = props.minDate.getFullYear();
    const minM = props.minDate.getMonth();
    if (state.focusedYear < minY) return true;
    if (state.focusedYear > minY) return false;
    return state.focusedMonth <= minM;
  });
  const nextMonthDisabled = useComputed$(() => {
    const today = new Date();
    const curY = today.getFullYear();
    const curM = today.getMonth();
    if (state.viewMode === "year") {
      if (!props.yearRange) return false;
      return state.focusedYear >= props.yearRange.max;
    }
    if (state.focusedYear > curY) return true;
    if (state.focusedYear < curY) return false;
    return state.focusedMonth >= curM;
  });
  const state = useStore<any>({
    focusedDate: new Date(),
    focusedMonth: 0,
    focusedYear: 0,
    initialised: false,
    viewMode: "day",
  });
  useVisibleTask$(() => {
    state.focusedDate = props.selectedDate;
    state.focusedYear = props.selectedDate.getFullYear();
    state.focusedMonth = props.selectedDate.getMonth();
    state.initialised = true;
  });
  useTask$(({ track }) => {
    track(() => props.selectedDate);
    state.focusedDate = props.selectedDate;
    state.focusedYear = props.selectedDate.getFullYear();
    state.focusedMonth = props.selectedDate.getMonth();
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
        {props.presentation !== "sheet" ? (
          <CalendarActionBar
            position="top"
            date={state.focusedDate}
            locale={props.locale}
            onPrev$={$((event) =>
              prevDay(
                props,
                state,
                prevDayDisabled,
                nextDayDisabled,
                prevMonthDisabled,
                nextMonthDisabled
              )
            )}
            onNext$={$((event) =>
              nextDay(
                props,
                state,
                prevDayDisabled,
                nextDayDisabled,
                prevMonthDisabled,
                nextMonthDisabled
              )
            )}
            prevDisabled={prevDayDisabled.value}
            nextDisabled={nextDayDisabled.value}
          ></CalendarActionBar>
        ) : null}
        <CalendarMonthBar
          viewMode={state.viewMode}
          focusedYear={state.focusedYear}
          focusedMonth={state.focusedMonth}
          locale={props.locale}
          onTitleClick$={$((event) =>
            titleClick(
              props,
              state,
              prevDayDisabled,
              nextDayDisabled,
              prevMonthDisabled,
              nextMonthDisabled
            )
          )}
          onPrev$={$((event) =>
            prevMonth(
              props,
              state,
              prevDayDisabled,
              nextDayDisabled,
              prevMonthDisabled,
              nextMonthDisabled
            )
          )}
          onNext$={$((event) =>
            nextMonth(
              props,
              state,
              prevDayDisabled,
              nextDayDisabled,
              prevMonthDisabled,
              nextMonthDisabled
            )
          )}
          prevDisabled={prevMonthDisabled.value}
          nextDisabled={nextMonthDisabled.value}
        ></CalendarMonthBar>
        {state.viewMode === "day" ? (
          <DateGrid
            year={state.focusedYear}
            month={state.focusedMonth}
            selectedDate={state.focusedDate}
            minDate={props.minDate}
            locale={props.locale}
            onSelect$={$((event) =>
              selectDay(
                props,
                state,
                prevDayDisabled,
                nextDayDisabled,
                prevMonthDisabled,
                nextMonthDisabled,
                d
              )
            )}
          ></DateGrid>
        ) : null}
        {state.viewMode === "month" ? (
          <MonthPicker
            year={state.focusedYear}
            selectedMonth={state.focusedMonth}
            minDate={props.minDate}
            locale={props.locale}
            onSelect$={$((event) =>
              selectMonth(
                props,
                state,
                prevDayDisabled,
                nextDayDisabled,
                prevMonthDisabled,
                nextMonthDisabled,
                idx
              )
            )}
          ></MonthPicker>
        ) : null}
        {state.viewMode === "year" ? (
          <YearPicker
            yearRange={props.yearRange}
            selectedYear={state.focusedYear}
            onSelect$={$((event) =>
              selectYear(
                props,
                state,
                prevDayDisabled,
                nextDayDisabled,
                prevMonthDisabled,
                nextMonthDisabled,
                y
              )
            )}
          ></YearPicker>
        ) : null}
      </div>
      <style>{`
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
      `}</style>
    </div>
  );
});

export default Calendar;
