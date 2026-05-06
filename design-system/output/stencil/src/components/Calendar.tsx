import { DateGrid } from "./DateGrid";
import { MonthPicker } from "./MonthPicker";
import { YearPicker } from "./YearPicker";
import { CalendarActionBar } from "./CalendarActionBar";
import type { Locale } from "../utils/i18n";

import {
  Component,
  h,
  Fragment,
  Event,
  EventEmitter,
  Prop,
  State,
} from "@stencil/core";

@Component({
  tag: "calendar",
})
export class Calendar {
  @Prop() selectedDate: any;
  @Event() select: any;
  @Prop() presentation: any;
  @Event() dismiss: any;
  @Prop() locale: any;
  @Prop() yearRange: any;
  @State() viewMode = "day";
  @State() focusedYear = 0;
  @State() focusedMonth = 0;
  @State() initialised = false;

  ensureInit() {
    if (!this.initialised) {
      this.focusedYear = this.selectedDate.getFullYear();
      this.focusedMonth = this.selectedDate.getMonth();
      this.initialised = true;
    }
  }
  setView(mode: "day" | "month" | "year") {
    this.viewMode = mode;
  }
  selectDay(d: Date) {
    this.focusedYear = d.getFullYear();
    this.focusedMonth = d.getMonth();
    this.select?.(d);
  }
  selectMonth(idx: number) {
    this.focusedMonth = idx;
    this.viewMode = "day";
  }
  selectYear(y: number) {
    this.focusedYear = y;
    this.viewMode = "month";
  }
  prev() {
    if (this.viewMode === "day") {
      const m = this.focusedMonth - 1;
      if (m < 0) {
        this.focusedMonth = 11;
        this.focusedYear -= 1;
      } else this.focusedMonth = m;
    }
  }
  next() {
    if (this.viewMode === "day") {
      const m = this.focusedMonth + 1;
      if (m > 11) {
        this.focusedMonth = 0;
        this.focusedYear += 1;
      } else this.focusedMonth = m;
    }
  }

  componentDidLoad() {}

  render() {
    return (
      <div
        class={`rdp-calendar rdp-calendar--${this.presentation ?? "inline"}`}
        role="dialog"
        aria-modal={this.presentation === "sheet" ? "true" : "false"}
      >
        {this.presentation === "sheet" ? (
          <div
            class="rdp-calendar__scrim"
            aria-hidden="true"
            onClick={() => this.dismiss?.()}
          ></div>
        ) : null}
        <div class="rdp-calendar__panel">
          <calendar-action-bar
            position="top"
            date={this.selectedDate}
            locale={this.locale}
            onDateClick={() => this.setView("month")}
            onPrev={() => this.prev()}
            onNext={() => this.next()}
          ></calendar-action-bar>
          {this.viewMode === "day" ? (
            <date-grid
              year={this.focusedYear}
              month={this.focusedMonth}
              selectedDate={this.selectedDate}
              locale={this.locale}
              onSelect={(d) => this.selectDay(d)}
            ></date-grid>
          ) : null}
          {this.viewMode === "month" ? (
            <month-picker
              year={this.focusedYear}
              selectedMonth={this.focusedMonth}
              locale={this.locale}
              onSelect={(idx) => this.selectMonth(idx)}
            ></month-picker>
          ) : null}
          {this.viewMode === "year" ? (
            <year-picker
              yearRange={this.yearRange}
              selectedYear={this.focusedYear}
              onSelect={(y) => this.selectYear(y)}
            ></year-picker>
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
  }
}
