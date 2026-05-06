import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type CalendarActionBarProps = {
  date: Date;
  locale?: Locale;
  onDateClick?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  position?: "top" | "bottom";
};

import { t } from "../utils/i18n";
import { formatLegacyShortDay } from "../utils/intl";
import type { Locale } from "../utils/i18n";

@Component({
  selector: "calendar-action-bar",
  template: `
    <div
      [class]="\`rdp-calendar-action-bar rdp-calendar-action-bar--\${position ?? 'bottom'}\`"
    >
      <button
        type="button"
        class="rdp-calendar-action-bar__pill"
        (click)="onDateClick?.()"
      >
        {{formatLegacyShortDay(date, locale ?? 'fr-FR')}}
      </button>
      <button
        type="button"
        class="rdp-calendar-action-bar__nav"
        [attr.aria-label]="t('actions.previous', undefined, locale ?? 'fr-FR')"
        (click)="onPrev?.()"
      >
        ‹
      </button>
      <button
        type="button"
        class="rdp-calendar-action-bar__nav"
        [attr.aria-label]="t('actions.next', undefined, locale ?? 'fr-FR')"
        (click)="onNext?.()"
      >
        ›
      </button>
      <style>
        {{\`
                .rdp-calendar-action-bar {
                  display: flex;
                  gap: var(--separation-1);
                  align-items: center;
                  background: var(--color-brand-active);
                  padding: var(--separation-1) var(--separation-2);
                  border-radius: var(--radius-default);
                  font-family: 'Roboto', sans-serif;
                }
                .rdp-calendar-action-bar__pill {
                  flex: 1;
                  background: var(--color-content-background);
                  color: var(--color-white);
                  padding: var(--separation-1) var(--separation-2);
                  border: none;
                  border-radius: var(--radius-default);
                  font-size: var(--font-size-date-picker);
                  cursor: pointer;
                }
                .rdp-calendar-action-bar__nav {
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  background: var(--color-white);
                  color: var(--color-brand-active);
                  border: none;
                  cursor: pointer;
                  font-size: 20px;
                  line-height: 1;
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
export default class CalendarActionBar {
  t = t;
  formatLegacyShortDay = formatLegacyShortDay;

  @Input() position!: CalendarActionBarProps["position"];
  @Input() onDateClick!: CalendarActionBarProps["onDateClick"];
  @Input() date!: CalendarActionBarProps["date"];
  @Input() locale!: CalendarActionBarProps["locale"];
  @Input() onPrev!: CalendarActionBarProps["onPrev"];
  @Input() onNext!: CalendarActionBarProps["onNext"];
}

@NgModule({
  declarations: [CalendarActionBar],
  imports: [CommonModule],
  exports: [CalendarActionBar],
})
export class CalendarActionBarModule {}
