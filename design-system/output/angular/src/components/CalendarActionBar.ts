import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type CalendarActionBarProps = {
  date: Date;
  locale?: Locale;
  onPrev?: () => void;
  onNext?: () => void;
  onPillClick?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
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
          class="rdp-calendar-action-bar__btn rdp-calendar-action-bar__btn--prev"
          [attr.aria-label]="t('actions.prev-day', undefined, locale ?? 'fr-FR')"
          [attr.aria-disabled]="prevDisabled === true ? 'true' : undefined"
          [attr.disabled]="prevDisabled === true"
          (click)="
          if (prevDisabled !== true) onPrev?.();
        "
        >
          <icon name="previous-item" [size]="32" [decorative]="true"></icon>
        </button>
        <button
          type="button"
          class="rdp-calendar-action-bar__btn rdp-calendar-action-bar__btn--next"
          [attr.aria-label]="t('actions.next-day', undefined, locale ?? 'fr-FR')"
          [attr.aria-disabled]="nextDisabled === true ? 'true' : undefined"
          [attr.disabled]="nextDisabled === true"
          (click)="
          if (nextDisabled !== true) onNext?.();
        "
        >
          <icon name="next-item" [size]="32" [decorative]="true"></icon>
        </button>
      </div>
      <style>
        {{\`
                .rdp-calendar-action-bar {
                  display: flex;
                  gap: var(--separation-1);
                  align-items: center;
                  background: var(--color-brand);
                  padding: var(--separation-1) var(--separation-2);
                  /* Square bottom corners so the band visually merges with the
                     month bar / day grid below it. */
                  border-radius: var(--radius-default) var(--radius-default) 0 0;
                  font-family: 'Roboto', sans-serif;
                }
                .rdp-calendar-action-bar--bottom {
                  border-radius: 0;
                }
                .rdp-calendar-action-bar__pill > svg:first-child { flex-shrink: 0; }
                .rdp-calendar-action-bar__pill {
                  flex: 1;
                  display: inline-flex;
                  align-items: center;
                  gap: var(--separation-1);
                  background: transparent;
                  color: var(--color-white);
                  padding: 0 0 0 var(--separation-2);
                  border: none;
                  border-radius: var(--radius-default);
                  font-size: var(--font-size-date-picker);
                  font-family: inherit;
                  text-align: left;
                  cursor: pointer;
                }
                .rdp-calendar-action-bar__nav {
                  display: flex;
                  gap: var(--separation-1);
                  flex-direction: row;
                }
                .rdp-calendar-action-bar__btn {
                  width: 32px;
                  height: 32px;
                  padding: 0;
                  background: transparent;
                  color: var(--color-brand);
                  border: none;
                  cursor: pointer;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                  line-height: 0;
                }
                /* Day-nav uses the legacy previous-item / next-item icons (which carry
                   a built-in white-fill circle) rotated 90° so the chevrons point
                   left/right instead of up/down. */
                .rdp-calendar-action-bar__btn--prev svg { transform: rotate(-90deg); }
                .rdp-calendar-action-bar__btn--next svg { transform: rotate(-90deg); }
                .rdp-calendar-action-bar__btn[aria-disabled=&quot;true&quot;] {
                  cursor: not-allowed;
                  opacity: 0.5;
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
  @Input() locale!: CalendarActionBarProps["locale"];
  @Input() onPillClick!: CalendarActionBarProps["onPillClick"];
  @Input() date!: CalendarActionBarProps["date"];
  @Input() prevDisabled!: CalendarActionBarProps["prevDisabled"];
  @Input() onPrev!: CalendarActionBarProps["onPrev"];
  @Input() nextDisabled!: CalendarActionBarProps["nextDisabled"];
  @Input() onNext!: CalendarActionBarProps["onNext"];
}

@NgModule({
  declarations: [CalendarActionBar],
  imports: [CommonModule, IconModule],
  exports: [CalendarActionBar],
})
export class CalendarActionBarModule {}
