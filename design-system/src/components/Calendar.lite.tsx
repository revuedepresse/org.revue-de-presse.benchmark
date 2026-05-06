import { useStore } from '@builder.io/mitosis';
import DateGrid from './DateGrid.lite';
import MonthPicker from './MonthPicker.lite';
import YearPicker from './YearPicker.lite';
import CalendarActionBar from './CalendarActionBar.lite';
import type { Locale } from '../utils/i18n';

type CalendarProps = {
  selectedDate: Date;
  locale?: Locale;
  yearRange: { min: number; max: number };
  presentation?: 'inline' | 'sheet';
  onSelect?: (date: Date) => void;
  onDismiss?: () => void;
};

export default function Calendar(props: CalendarProps) {
  const state = useStore({
    viewMode: 'day' as 'day' | 'month' | 'year',
    focusedYear: 0,
    focusedMonth: 0,
    initialised: false,
    ensureInit() {
      if (!state.initialised) {
        state.focusedYear = props.selectedDate.getFullYear();
        state.focusedMonth = props.selectedDate.getMonth();
        state.initialised = true;
      }
    },
    setView(mode: 'day' | 'month' | 'year') {
      state.viewMode = mode;
    },
    selectDay(d: Date) {
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
    prev() {
      if (state.viewMode === 'day') {
        const m = state.focusedMonth - 1;
        if (m < 0) {
          state.focusedMonth = 11;
          state.focusedYear -= 1;
        } else state.focusedMonth = m;
      }
    },
    next() {
      if (state.viewMode === 'day') {
        const m = state.focusedMonth + 1;
        if (m > 11) {
          state.focusedMonth = 0;
          state.focusedYear += 1;
        } else state.focusedMonth = m;
      }
    },
  });

  state.ensureInit();

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
        <CalendarActionBar
          date={props.selectedDate}
          locale={props.locale}
          position="top"
          onDateClick={() => state.setView('month')}
          onPrev={() => state.prev()}
          onNext={() => state.next()}
        />
        <Show when={state.viewMode === 'day'}>
          <DateGrid
            year={state.focusedYear}
            month={state.focusedMonth}
            selectedDate={props.selectedDate}
            locale={props.locale}
            onSelect={(d: Date) => state.selectDay(d)}
          />
        </Show>
        <Show when={state.viewMode === 'month'}>
          <MonthPicker
            year={state.focusedYear}
            selectedMonth={state.focusedMonth}
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
}
