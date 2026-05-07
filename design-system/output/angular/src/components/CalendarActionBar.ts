import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type CalendarActionBarProps = {
  date: Date;
  locale?: Locale;
  onPrev?: () => void;
  onNext?: () => void;
  onPillClick?: () => void;
  position?: "top" | "bottom";
};

import { t } from "../utils/i18n";
import { formatLegacyShortDay } from "../utils/intl";
import type { Locale } from "../utils/i18n";

@Component({
  selector: "calendar-action-bar",
  template: `
    <div
      [class]="\`rdp-calendar-action-bar rdp-calendar-action-bar--\${position ?? 'top'}\`"
    >
      <button
        type="button"
        class="rdp-calendar-action-bar__pill"
        [attr.aria-label]="t('actions.pick-month.aria-label', undefined, locale ?? 'fr-FR')"
        (click)="onPillClick?.()"
      >
        <icon name="pick-day" [size]="16" [decorative]="true"></icon>
        <span>{{formatLegacyShortDay(date, locale ?? 'fr-FR')}}</span>
      </button>
      <div class="rdp-calendar-action-bar__nav">
        <button
          type="button"
          class="rdp-calendar-action-bar__btn"
          [attr.aria-label]="t('actions.prev-day', undefined, locale ?? 'fr-FR')"
          (click)="onPrev?.()"
        >
          ‹
        </button>
        <button
          type="button"
          class="rdp-calendar-action-bar__btn"
          [attr.aria-label]="t('actions.next-day', undefined, locale ?? 'fr-FR')"
          (click)="onNext?.()"
        >
          ›
        </button>
      </div>
      <style>
        {{\`
                .rdp-calendar-action-bar {
                  display: flex;
                  gap: var(--separation-1);
                  align-items: center;
                  padding: var(--separation-1) 0;
                  font-family: 'Roboto', sans-serif;
                }
                .rdp-calendar-action-bar--bottom {
                  background: var(--color-brand);
                  padding: var(--separation-1) var(--separation-2);
                  border-radius: 0;
                }
                .rdp-calendar-action-bar__pill {
                  flex: 1;
                  display: inline-flex;
                  align-items: center;
                  gap: var(--separation-1);
                  background: var(--color-brand);
                  color: var(--color-white);
                  padding: var(--separation-1) var(--separation-2);
                  border: none;
                  border-radius: var(--radius-default);
                  font-size: var(--font-size-date-picker);
                  font-family: inherit;
                  text-align: left;
                  cursor: pointer;
                }
                .rdp-calendar-action-bar__pill:hover { filter: brightness(1.05); }
                .rdp-calendar-action-bar__nav {
                  display: flex;
                  gap: var(--separation-1);
                  flex-direction: row;
                }
                .rdp-calendar-action-bar__btn {
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  background: var(--color-white);
                  color: var(--color-brand);
                  border: none;
                  cursor: pointer;
                  font-size: 20px;
                  line-height: 1;
                  flex-shrink: 0;
                }
                .rdp-calendar-action-bar__btn:hover { background: var(--color-brand); color: var(--color-white); }
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
  @Input() locale!: CalendarActionBarProps["locale"];
  @Input() onPillClick!: CalendarActionBarProps["onPillClick"];
  @Input() date!: CalendarActionBarProps["date"];
  @Input() onPrev!: CalendarActionBarProps["onPrev"];
  @Input() onNext!: CalendarActionBarProps["onNext"];
}

@NgModule({
  declarations: [CalendarActionBar],
  imports: [CommonModule, IconModule],
  exports: [CalendarActionBar],
})
export class CalendarActionBarModule {}
