import { onMount, onUpdate, useStore } from '@builder.io/mitosis';
import DateGrid from './DateGrid.lite';
import MonthPicker from './MonthPicker.lite';
import YearPicker from './YearPicker.lite';
import CalendarActionBar from './CalendarActionBar.lite';
import CalendarMonthBar from './CalendarMonthBar.lite';
import type { Locale } from '../utils/i18n';

type CalendarProps = {
  selectedDate: Date;
  locale?: Locale;
  yearRange: { min: number; max: number };
  minDate?: Date;
  presentation?: 'inline' | 'sheet';
  onSelect?: (date: Date) => void;
  onDismiss?: () => void;
};

export default function Calendar(props: CalendarProps) {
  const state = useStore({
    viewMode: 'day' as 'day' | 'month' | 'year',
    focusedDate: new Date(),
    focusedYear: 0,
    focusedMonth: 0,
    initialised: false,
    selectDay(d: Date) {
      state.focusedDate = d;
      state.focusedYear = d.getFullYear();
      state.focusedMonth = d.getMonth();
      props.onSelect?.(d);
    },
    selectMonth(idx: number) {
      state.focusedMonth = idx;
      state.viewMode = 'day';
    },
    selectYear(y: number) {
      state.focusedYear = y;
      state.viewMode = 'month';
    },
    prevDay() {
      const next = new Date(state.focusedDate);
      next.setDate(next.getDate() - 1);
      state.focusedDate = next;
      state.focusedYear = next.getFullYear();
      state.focusedMonth = next.getMonth();
      props.onSelect?.(next);
    },
    nextDay() {
      const next = new Date(state.focusedDate);
      next.setDate(next.getDate() + 1);
      state.focusedDate = next;
      state.focusedYear = next.getFullYear();
      state.focusedMonth = next.getMonth();
      props.onSelect?.(next);
    },
    prevMonth() {
      if (state.viewMode === 'year') {
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
    },
    nextMonth() {
      if (state.viewMode === 'year') {
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
    },
    titleClick() {
      if (state.viewMode === 'day') {
        state.viewMode = 'month';
      } else if (state.viewMode === 'month') {
        state.viewMode = 'year';
      }
    },
    get prevDayDisabled(): boolean {
      if (!props.minDate) return false;
      const cur = new Date(
        state.focusedDate.getFullYear(),
        state.focusedDate.getMonth(),
        state.focusedDate.getDate(),
      );
      const min = new Date(
        props.minDate.getFullYear(),
        props.minDate.getMonth(),
        props.minDate.getDate(),
      );
      return cur.getTime() <= min.getTime();
    },
    get nextDayDisabled(): boolean {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const cur = new Date(
        state.focusedDate.getFullYear(),
        state.focusedDate.getMonth(),
        state.focusedDate.getDate(),
      );
      return cur.getTime() >= yesterday.getTime();
    },
    get prevMonthDisabled(): boolean {
      if (state.viewMode === 'year') {
        if (!props.yearRange) return false;
        return state.focusedYear <= props.yearRange.min;
      }
      if (!props.minDate) return false;
      const minY = props.minDate.getFullYear();
      const minM = props.minDate.getMonth();
      if (state.focusedYear < minY) return true;
      if (state.focusedYear > minY) return false;
      return state.focusedMonth <= minM;
    },
    get nextMonthDisabled(): boolean {
      const today = new Date();
      const curY = today.getFullYear();
      const curM = today.getMonth();
      if (state.viewMode === 'year') {
        if (!props.yearRange) return false;
        return state.focusedYear >= props.yearRange.max;
      }
      if (state.focusedYear > curY) return true;
      if (state.focusedYear < curY) return false;
      return state.focusedMonth >= curM;
    },
  });

  onMount(() => {
    state.focusedDate = props.selectedDate;
    state.focusedYear = props.selectedDate.getFullYear();
    state.focusedMonth = props.selectedDate.getMonth();
    state.initialised = true;
  });

  // Re-sync the focused month/year whenever an external prop change moves the
  // selected date (e.g. day-step taps on the mobile dock that live outside
  // the Calendar tree). Crossing a month boundary swaps the rendered month.
  onUpdate(() => {
    state.focusedDate = props.selectedDate;
    state.focusedYear = props.selectedDate.getFullYear();
    state.focusedMonth = props.selectedDate.getMonth();
  }, [props.selectedDate]);

  return (
    <div
      class={`rdp-calendar rdp-calendar--${props.presentation ?? 'inline'}`}
      role="dialog"
      aria-modal={props.presentation === 'sheet' ? 'true' : 'false'}
    >
      <Show when={props.presentation === 'sheet'}>
        <div
          class="rdp-calendar__scrim"
          onClick={() => props.onDismiss?.()}
          aria-hidden="true"
        />
      </Show>
      <div class="rdp-calendar__panel">
        <Show when={props.presentation !== 'sheet'}>
          <CalendarActionBar
            date={state.focusedDate}
            locale={props.locale}
            position="top"
            onPrev={() => state.prevDay()}
            onNext={() => state.nextDay()}
            prevDisabled={state.prevDayDisabled}
            nextDisabled={state.nextDayDisabled}
          />
        </Show>
        <CalendarMonthBar
          viewMode={state.viewMode}
          focusedYear={state.focusedYear}
          focusedMonth={state.focusedMonth}
          locale={props.locale}
          onTitleClick={() => state.titleClick()}
          onPrev={() => state.prevMonth()}
          onNext={() => state.nextMonth()}
          prevDisabled={state.prevMonthDisabled}
          nextDisabled={state.nextMonthDisabled}
        />
        <Show when={state.viewMode === 'day'}>
          <DateGrid
            year={state.focusedYear}
            month={state.focusedMonth}
            selectedDate={state.focusedDate}
            minDate={props.minDate}
            locale={props.locale}
            onSelect={(d: Date) => state.selectDay(d)}
          />
        </Show>
        <Show when={state.viewMode === 'month'}>
          <MonthPicker
            year={state.focusedYear}
            selectedMonth={state.focusedMonth}
            minDate={props.minDate}
            locale={props.locale}
            onSelect={(idx: number) => state.selectMonth(idx)}
          />
        </Show>
        <Show when={state.viewMode === 'year'}>
          <YearPicker
            yearRange={props.yearRange}
            selectedYear={state.focusedYear}
            onSelect={(y: number) => state.selectYear(y)}
          />
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
  );
}
