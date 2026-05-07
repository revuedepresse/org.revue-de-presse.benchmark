import { t } from "../utils/i18n";
import { formatLegacyShortDay } from "../utils/intl";
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
  tag: "calendar-action-bar",
})
export class CalendarActionBar {
  @Prop() position: any;
  @Prop() locale: any;
  @Event() pillClick: any;
  @Prop() date: any;
  @Event() prev: any;
  @Event() next: any;

  componentDidLoad() {}

  render() {
    return (
      <div
        class={`rdp-calendar-action-bar rdp-calendar-action-bar--${
          this.position ?? "top"
        }`}
      >
        <button
          class="rdp-calendar-action-bar__pill"
          type="button"
          aria-label={t(
            "actions.pick-month.aria-label",
            undefined,
            this.locale ?? "fr-FR"
          )}
          onClick={() => this.pillClick?.()}
        >
          <icon name="pick-day" size={16} decorative={true}></icon>
          <span>{formatLegacyShortDay(this.date, this.locale ?? "fr-FR")}</span>
        </button>
        <div class="rdp-calendar-action-bar__nav">
          <button
            class="rdp-calendar-action-bar__btn"
            type="button"
            aria-label={t(
              "actions.prev-day",
              undefined,
              this.locale ?? "fr-FR"
            )}
            onClick={() => this.prev?.()}
          >
            ‹
          </button>
          <button
            class="rdp-calendar-action-bar__btn"
            type="button"
            aria-label={t(
              "actions.next-day",
              undefined,
              this.locale ?? "fr-FR"
            )}
            onClick={() => this.next?.()}
          >
            ›
          </button>
        </div>
        <style>{`
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
      `}</style>
      </div>
    );
  }
}
