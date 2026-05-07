import { t } from "../utils/i18n";
import { localizedMonthLong } from "../utils/intl";
import "./Icon.ts";
import type { Locale } from "../utils/i18n";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type ViewMode = "day" | "month" | "year";
type CalendarMonthBarProps = {
  viewMode?: ViewMode;
  focusedYear?: number;
  focusedMonth?: number;
  locale?: Locale;
  onTitleClick?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

@customElement("calendar-month-bar")
export default class CalendarMonthBar extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() viewMode: any;
  @property() locale: any;
  @property() focusedYear: any;
  @property() focusedMonth: any;
  @property() onTitleClick: any;
  @property() onPrev: any;
  @property() onNext: any;

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

  render() {
    return html`

          <div ><button  type="button"  aria-label=${t(
            this.titleAriaKey,
            undefined,
            this.locale ?? "fr-FR"
          )}  @click=${(event) =>
      this.onTitleClick?.()} ><my-icon  name="pick-item"  .size=${16}  .decorative=${true} ></my-icon>
        <span >${this.title}</span></button>
        <div ><button  type="button"  aria-label=${t(
          this.prevAriaKey,
          undefined,
          this.locale ?? "fr-FR"
        )}  @click=${(event) =>
      this.onPrev?.()} ><my-icon  name="previous-item"  .size=${20}  .decorative=${true} ></my-icon></button>
        <button  type="button"  aria-label=${t(
          this.nextAriaKey,
          undefined,
          this.locale ?? "fr-FR"
        )}  @click=${(event) =>
      this.onNext?.()} ><my-icon  name="next-item"  .size=${20}  .decorative=${true} ></my-icon></button></div>
        <style >${`
               .rdp-calendar-month-bar {
                 display: flex;
                 gap: var(--separation-1);
                 align-items: center;
                 padding: var(--separation-1) 0;
                 font-family: 'Roboto', sans-serif;
               }
               .rdp-calendar-month-bar__pill {
                 flex: 0 0 auto;
                 display: inline-flex;
                 align-items: center;
                 gap: var(--separation-1);
                 width: auto;
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
             `}</style></div>
        `;
  }
}
