import {
  Show,
  onMount,
  on,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";

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

import DateGrid from "./DateGrid";
import MonthPicker from "./MonthPicker";
import YearPicker from "./YearPicker";
import CalendarActionBar from "./CalendarActionBar";
import CalendarMonthBar from "./CalendarMonthBar";
import type { Locale } from "../utils/i18n";

function Calendar(props: CalendarProps) {
  const [viewMode, setViewMode] = createSignal("day");

  const [focusedDate, setFocusedDate] = createSignal(new Date());

  const [focusedYear, setFocusedYear] = createSignal(0);

  const [focusedMonth, setFocusedMonth] = createSignal(0);

  const [initialised, setInitialised] = createSignal(false);

  function selectDay(d: Date) {
    setFocusedDate(d);
    setFocusedYear(d.getFullYear());
    setFocusedMonth(d.getMonth());
    props.onSelect?.(d);
  }

  function selectMonth(idx: number) {
    setFocusedMonth(idx);
    setViewMode("day");
  }

  function selectYear(y: number) {
    setFocusedYear(y);
    setViewMode("month");
  }

  function prevDay() {
    const next = new Date(focusedDate());
    next.setDate(next.getDate() - 1);
    setFocusedDate(next);
    setFocusedYear(next.getFullYear());
    setFocusedMonth(next.getMonth());
  }

  function nextDay() {
    const next = new Date(focusedDate());
    next.setDate(next.getDate() + 1);
    setFocusedDate(next);
    setFocusedYear(next.getFullYear());
    setFocusedMonth(next.getMonth());
  }

  function prevMonth() {
    if (viewMode() === "year") {
      const next = focusedYear() - 1;
      if (next >= props.yearRange.min) setFocusedYear(next);
      return;
    }
    const m = focusedMonth() - 1;
    if (m < 0) {
      setFocusedMonth(11);
      setFocusedYear(1);
    } else {
      setFocusedMonth(m);
    }
  }

  function nextMonth() {
    if (viewMode() === "year") {
      const next = focusedYear() + 1;
      if (next <= props.yearRange.max) setFocusedYear(next);
      return;
    }
    const m = focusedMonth() + 1;
    if (m > 11) {
      setFocusedMonth(0);
      setFocusedYear(1);
    } else {
      setFocusedMonth(m);
    }
  }

  function titleClick() {
    if (viewMode() === "day") {
      setViewMode("month");
    } else if (viewMode() === "month") {
      setViewMode("year");
    }
  }

  const prevDayDisabled = createMemo(() => {
    if (!props.minDate) return false;
    const cur = new Date(
      focusedDate().getFullYear(),
      focusedDate().getMonth(),
      focusedDate().getDate()
    );
    const min = new Date(
      props.minDate.getFullYear(),
      props.minDate.getMonth(),
      props.minDate.getDate()
    );
    return cur.getTime() <= min.getTime();
  });

  const nextDayDisabled = createMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const cur = new Date(
      focusedDate().getFullYear(),
      focusedDate().getMonth(),
      focusedDate().getDate()
    );
    return cur.getTime() >= yesterday.getTime();
  });

  const prevMonthDisabled = createMemo(() => {
    if (viewMode() === "year") {
      if (!props.yearRange) return false;
      return focusedYear() <= props.yearRange.min;
    }
    if (!props.minDate) return false;
    const minY = props.minDate.getFullYear();
    const minM = props.minDate.getMonth();
    if (focusedYear() < minY) return true;
    if (focusedYear() > minY) return false;
    return focusedMonth() <= minM;
  });

  const nextMonthDisabled = createMemo(() => {
    const today = new Date();
    const curY = today.getFullYear();
    const curM = today.getMonth();
    if (viewMode() === "year") {
      if (!props.yearRange) return false;
      return focusedYear() >= props.yearRange.max;
    }
    if (focusedYear() > curY) return true;
    if (focusedYear() < curY) return false;
    return focusedMonth() >= curM;
  });

  onMount(() => {
    setFocusedDate(props.selectedDate);
    setFocusedYear(props.selectedDate.getFullYear());
    setFocusedMonth(props.selectedDate.getMonth());
    setInitialised(true);
  });

  const onUpdateFn_0_props_selectedDate = createMemo(() => props.selectedDate);
  function onUpdateFn_0() {
    setFocusedDate(props.selectedDate);
    setFocusedYear(props.selectedDate.getFullYear());
    setFocusedMonth(props.selectedDate.getMonth());
  }
  createEffect(on(() => [onUpdateFn_0_props_selectedDate()], onUpdateFn_0));

  return (
    <>
      <div
        class={`rdp-calendar rdp-calendar--${props.presentation ?? "inline"}`}
        role="dialog"
        aria-modal={props.presentation === "sheet" ? "true" : "false"}
      >
        <Show when={props.presentation === "sheet"}>
          <div
            class="rdp-calendar__scrim"
            aria-hidden="true"
            onClick={(event) => props.onDismiss?.()}
          ></div>
        </Show>
        <div class="rdp-calendar__panel">
          <Show when={props.presentation !== "sheet"}>
            <CalendarActionBar
              position="top"
              date={focusedDate()}
              locale={props.locale}
              onPrev={(event) => prevDay()}
              onNext={(event) => nextDay()}
              prevDisabled={prevDayDisabled()}
              nextDisabled={nextDayDisabled()}
            ></CalendarActionBar>
          </Show>
          <CalendarMonthBar
            viewMode={viewMode()}
            focusedYear={focusedYear()}
            focusedMonth={focusedMonth()}
            locale={props.locale}
            onTitleClick={(event) => titleClick()}
            onPrev={(event) => prevMonth()}
            onNext={(event) => nextMonth()}
            prevDisabled={prevMonthDisabled()}
            nextDisabled={nextMonthDisabled()}
          ></CalendarMonthBar>
          <Show when={viewMode() === "day"}>
            <DateGrid
              year={focusedYear()}
              month={focusedMonth()}
              selectedDate={focusedDate()}
              minDate={props.minDate}
              locale={props.locale}
              onSelect={(d) => selectDay(d)}
            ></DateGrid>
          </Show>
          <Show when={viewMode() === "month"}>
            <MonthPicker
              year={focusedYear()}
              selectedMonth={focusedMonth()}
              minDate={props.minDate}
              locale={props.locale}
              onSelect={(idx) => selectMonth(idx)}
            ></MonthPicker>
          </Show>
          <Show when={viewMode() === "year"}>
            <YearPicker
              yearRange={props.yearRange}
              selectedYear={focusedYear()}
              onSelect={(y) => selectYear(y)}
            ></YearPicker>
          </Show>
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
    </>
  );
}

export default Calendar;
