import { t } from "../utils/i18n";
import { localizedMonthLong } from "../utils/intl";
import { Icon } from "./Icon";
import type { Locale } from "../utils/i18n";

import {
  Component,
  h,
  Fragment,
  Event,
  EventEmitter,
  Prop,
} from "@stencil/core";

@Component({
  tag: "calendar-month-bar",
})
export class CalendarMonthBar {
  @Prop() viewMode: any;
  @Prop() locale: any;
  @Prop() focusedYear: any;
  @Prop() focusedMonth: any;
  @Event() titleClick: any;
  @Prop() prevDisabled: any;
  @Event() prev: any;
  @Prop() nextDisabled: any;
  @Event() next: any;

  get title() {
    const m: ViewMode = this.viewMode ?? "day";
    const loc = this.locale ?? "fr-FR";
    const year = this.focusedYear ?? new Date().getFullYear();
    if (m === "month") return String(year);
    if (m === "year") return t("calendar.year-picker.heading", undefined, loc);
    return `${localizedMonthLong(this.focusedMonth ?? 0, loc)} ${year}`;
  }
  get titleAriaKey() {
    const m: ViewMode = this.viewMode ?? "day";
    if (m === "day") return "actions.pick-month.aria-label";
    if (m === "month") return "actions.pick-year.aria-label";
    return "calendar.year-picker.heading";
  }
  get prevAriaKey() {
    const m: ViewMode = this.viewMode ?? "day";
    return m === "year" ? "actions.prev-year" : "actions.prev-month";
  }
  get nextAriaKey() {
    const m: ViewMode = this.viewMode ?? "day";
    return m === "year" ? "actions.next-year" : "actions.next-month";
  }

  componentDidLoad() {}

  render() {
    return (
      <div class="rdp-calendar-month-bar">
        <button
          class="rdp-calendar-month-bar__pill"
          type="button"
          aria-label={t(this.titleAriaKey, undefined, this.locale ?? "fr-FR")}
          onClick={() => this.titleClick?.()}
        >
          <icon name="pick-item" size={16} decorative={true}></icon>
          <span class="rdp-calendar-month-bar__label">{this.title}</span>
        </button>
        <div class="rdp-calendar-month-bar__nav">
          <button
            class="rdp-calendar-month-bar__btn rdp-calendar-month-bar__btn--prev"
            type="button"
            aria-label={t(this.prevAriaKey, undefined, this.locale ?? "fr-FR")}
            aria-disabled={this.prevDisabled === true ? "true" : undefined}
            disabled={this.prevDisabled === true}
            onClick={() => {
              if (this.prevDisabled !== true) this.prev?.();
            }}
          >
            <svg
              viewBox="0 0 24 14"
              width="22"
              height="14"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 11 12 3l9 8"></path>
            </svg>
          </button>
          <button
            class="rdp-calendar-month-bar__btn rdp-calendar-month-bar__btn--next"
            type="button"
            aria-label={t(this.nextAriaKey, undefined, this.locale ?? "fr-FR")}
            aria-disabled={this.nextDisabled === true ? "true" : undefined}
            disabled={this.nextDisabled === true}
            onClick={() => {
              if (this.nextDisabled !== true) this.next?.();
            }}
          >
            <svg
              viewBox="0 0 24 14"
              width="22"
              height="14"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 3 12 11l9-8"></path>
            </svg>
          </button>
        </div>
        <style>{`
        .rdp-calendar-month-bar {
          display: flex;
          gap: var(--separation-1);
          align-items: center;
          padding: var(--separation-1) var(--separation-2);
          font-family: 'Roboto', sans-serif;
        }
        .rdp-calendar-month-bar__pill {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: var(--separation-1);
          width: auto;
          /* Negative margin compensates for the pill's 1px outline so the
             pill's left edge aligns with the bar-content edge; combined with
             the pill's own internal padding the icon ends up matching the
             action-bar icon above (both at +var(--separation-2) inside). */
          margin-left: -1px;
          background: var(--color-white);
          color: var(--color-brand);
          border: 1px solid var(--color-brand);
          padding: var(--separation-1) var(--separation-2);
          border-radius: var(--radius-default);
          font-size: var(--font-size-date-picker);
          cursor: pointer;
          text-align: left;
        }
        .rdp-calendar-month-bar__label { display: inline-block; }
        .rdp-calendar-month-bar__pill:hover { background: var(--color-brand); color: var(--color-white); border-color: var(--color-brand); }
        .rdp-calendar-month-bar__nav {
          margin-left: auto;
          display: flex;
          flex-direction: row;
          gap: var(--separation-1);
          align-items: center;
        }
        .rdp-calendar-month-bar__btn {
          width: 32px;
          height: 32px;
          background: transparent;
          color: var(--color-brand);
          border: none;
          cursor: pointer;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .rdp-calendar-month-bar__btn:hover { color: var(--color-brand-active); }
        .rdp-calendar-month-bar__btn[aria-disabled="true"] {
          color: var(--color-light-grey);
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
      </div>
    );
  }
}
