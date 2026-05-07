import { DateGrid } from "./DateGrid";
import { MonthPicker } from "./MonthPicker";
import { YearPicker } from "./YearPicker";
import { CalendarActionBar } from "./CalendarActionBar";
import { CalendarMonthBar } from "./CalendarMonthBar";
import type { Locale } from "../utils/i18n";

import {
  Component,
  h,
  Fragment,
  Watch,
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
  @Prop() yearRange: any;
  @Prop() presentation: any;
  @Event() dismiss: any;
  @Prop() locale: any;
  @State() viewMode = "day";
  @State() focusedDate = new Date();
  @State() focusedYear = 0;
  @State() focusedMonth = 0;
  @State() initialised = false;

  selectDay(d: Date) {
    this.focusedDate = d;
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
  prevDay() {
    const next = new Date(this.focusedDate);
    next.setDate(next.getDate() - 1);
    this.focusedDate = next;
    this.focusedYear = next.getFullYear();
    this.focusedMonth = next.getMonth();
  }
  nextDay() {
    const next = new Date(this.focusedDate);
    next.setDate(next.getDate() + 1);
    this.focusedDate = next;
    this.focusedYear = next.getFullYear();
    this.focusedMonth = next.getMonth();
  }
  prevMonth() {
    if (this.viewMode === "year") {
      const next = this.focusedYear - 1;
      if (next >= this.yearRange.min) this.focusedYear = next;
      return;
    }
    const m = this.focusedMonth - 1;
    if (m < 0) {
      this.focusedMonth = 11;
      this.focusedYear -= 1;
    } else {
      this.focusedMonth = m;
    }
  }
  nextMonth() {
    if (this.viewMode === "year") {
      const next = this.focusedYear + 1;
      if (next <= this.yearRange.max) this.focusedYear = next;
      return;
    }
    const m = this.focusedMonth + 1;
    if (m > 11) {
      this.focusedMonth = 0;
      this.focusedYear += 1;
    } else {
      this.focusedMonth = m;
    }
  }
  titleClick() {
    if (this.viewMode === "day") {
      this.viewMode = "month";
    } else if (this.viewMode === "month") {
      this.viewMode = "year";
    }
  }

  watch0Fn() {
    this.focusedDate = this.selectedDate;
    this.focusedYear = this.selectedDate.getFullYear();
    this.focusedMonth = this.selectedDate.getMonth();
  }

  @Watch("selectedDate")
  watch0() {
    this.watch0Fn();
  }

  componentDidLoad() {
    this.focusedDate = this.selectedDate;
    this.focusedYear = this.selectedDate.getFullYear();
    this.focusedMonth = this.selectedDate.getMonth();
    this.initialised = true;
    this.watch0Fn();
  }

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
            date={this.focusedDate}
            locale={this.locale}
            onPrev={() => this.prevDay()}
            onNext={() => this.nextDay()}
          ></calendar-action-bar>
          <calendar-month-bar
            viewMode={this.viewMode}
            focusedYear={this.focusedYear}
            focusedMonth={this.focusedMonth}
            locale={this.locale}
            onTitleClick={() => this.titleClick()}
            onPrev={() => this.prevMonth()}
            onNext={() => this.nextMonth()}
          ></calendar-month-bar>
          {this.viewMode === "day" ? (
            <date-grid
              year={this.focusedYear}
              month={this.focusedMonth}
              selectedDate={this.focusedDate}
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
