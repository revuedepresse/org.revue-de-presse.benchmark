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
        <calendar-action-bar
          position="top"
          [date]="focusedDate"
          [locale]="locale"
          (prev)="prevDay()"
          (next)="nextDay()"
        ></calendar-action-bar>
        <calendar-month-bar
          [viewMode]="viewMode"
          [focusedYear]="focusedYear"
          [focusedMonth]="focusedMonth"
          [locale]="locale"
          (titleClick)="titleClick()"
          (prev)="prevMonth()"
          (next)="nextMonth()"
        ></calendar-month-bar>
        <ng-container *ngIf="viewMode === 'day'"
          ><date-grid
            [year]="focusedYear"
            [month]="focusedMonth"
            [selectedDate]="focusedDate"
            [locale]="locale"
            (select)="selectDay($event)"
          ></date-grid
        ></ng-container>
        <ng-container *ngIf="viewMode === 'month'"
          ><month-picker
            [year]="focusedYear"
            [selectedMonth]="focusedMonth"
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
