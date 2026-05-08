import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input, SimpleChanges } from "@angular/core";

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

import type { Locale } from "../utils/i18n";

@Component({
  selector: "calendar",
  template: `
    <div
      role="dialog"
      [class]="\`rdp-calendar rdp-calendar--\${presentation ?? 'inline'}\`"
      [attr.aria-modal]="presentation === 'sheet' ? 'true' : 'false'"
    >
      <ng-container *ngIf="presentation === 'sheet'"
        ><div
          class="rdp-calendar__scrim"
          aria-hidden="true"
          (click)="onDismiss?.()"
        ></div
      ></ng-container>
      <div class="rdp-calendar__panel">
        <ng-container *ngIf="presentation !== 'sheet'"
          ><calendar-action-bar
            position="top"
            [date]="focusedDate"
            [locale]="locale"
            (prev)="prevDay()"
            (next)="nextDay()"
            [prevDisabled]="prevDayDisabled"
            [nextDisabled]="nextDayDisabled"
          ></calendar-action-bar
        ></ng-container>
        <calendar-month-bar
          [viewMode]="viewMode"
          [focusedYear]="focusedYear"
          [focusedMonth]="focusedMonth"
          [locale]="locale"
          (titleClick)="titleClick()"
          (prev)="prevMonth()"
          (next)="nextMonth()"
          [prevDisabled]="prevMonthDisabled"
          [nextDisabled]="nextMonthDisabled"
        ></calendar-month-bar>
        <ng-container *ngIf="viewMode === 'day'"
          ><date-grid
            [year]="focusedYear"
            [month]="focusedMonth"
            [selectedDate]="focusedDate"
            [minDate]="minDate"
            [locale]="locale"
            (select)="selectDay($event)"
          ></date-grid
        ></ng-container>
        <ng-container *ngIf="viewMode === 'month'"
          ><month-picker
            [year]="focusedYear"
            [selectedMonth]="focusedMonth"
            [minDate]="minDate"
            [locale]="locale"
            (select)="selectMonth($event)"
          ></month-picker
        ></ng-container>
        <ng-container *ngIf="viewMode === 'year'"
          ><year-picker
            [yearRange]="yearRange"
            [selectedYear]="focusedYear"
            (select)="selectYear($event)"
          ></year-picker
        ></ng-container>
      </div>
      <style>
        {{\`
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
              \`}}
      </style>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class Calendar {
  @Input() selectedDate!: CalendarProps["selectedDate"];
  @Input() onSelect!: CalendarProps["onSelect"];
  @Input() yearRange!: CalendarProps["yearRange"];
  @Input() minDate!: CalendarProps["minDate"];
  @Input() presentation!: CalendarProps["presentation"];
  @Input() onDismiss!: CalendarProps["onDismiss"];
  @Input() locale!: CalendarProps["locale"];

  viewMode = "day";
  focusedDate = new Date();
  focusedYear = 0;
  focusedMonth = 0;
  initialised = false;
  selectDay(d: Date) {
    this.focusedDate = d;
    this.focusedYear = d.getFullYear();
    this.focusedMonth = d.getMonth();
    this.onSelect?.(d);
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
  get prevDayDisabled() {
    if (!this.minDate) return false;
    const cur = new Date(
      this.focusedDate.getFullYear(),
      this.focusedDate.getMonth(),
      this.focusedDate.getDate()
    );
    const min = new Date(
      this.minDate.getFullYear(),
      this.minDate.getMonth(),
      this.minDate.getDate()
    );
    return cur.getTime() <= min.getTime();
  }
  get nextDayDisabled() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const cur = new Date(
      this.focusedDate.getFullYear(),
      this.focusedDate.getMonth(),
      this.focusedDate.getDate()
    );
    return cur.getTime() >= yesterday.getTime();
  }
  get prevMonthDisabled() {
    if (this.viewMode === "year") {
      if (!this.yearRange) return false;
      return this.focusedYear <= this.yearRange.min;
    }
    if (!this.minDate) return false;
    const minY = this.minDate.getFullYear();
    const minM = this.minDate.getMonth();
    if (this.focusedYear < minY) return true;
    if (this.focusedYear > minY) return false;
    return this.focusedMonth <= minM;
  }
  get nextMonthDisabled() {
    const today = new Date();
    const curY = today.getFullYear();
    const curM = today.getMonth();
    if (this.viewMode === "year") {
      if (!this.yearRange) return false;
      return this.focusedYear >= this.yearRange.max;
    }
    if (this.focusedYear > curY) return true;
    if (this.focusedYear < curY) return false;
    return this.focusedMonth >= curM;
  }

  ngOnInit() {
    if (typeof window !== "undefined") {
      this.focusedDate = this.selectedDate;
      this.focusedYear = this.selectedDate.getFullYear();
      this.focusedMonth = this.selectedDate.getMonth();
      this.initialised = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof window !== "undefined") {
      this.focusedDate = this.selectedDate;
      this.focusedYear = this.selectedDate.getFullYear();
      this.focusedMonth = this.selectedDate.getMonth();
    }
  }
}

@NgModule({
  declarations: [Calendar],
  imports: [
    CommonModule,
    CalendarActionBarModule,
    CalendarMonthBarModule,
    DateGridModule,
    MonthPickerModule,
    YearPickerModule,
  ],
  exports: [Calendar],
})
export class CalendarModule {}
