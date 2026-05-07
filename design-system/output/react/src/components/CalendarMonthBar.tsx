"use client";
import * as React from "react";

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
import { t } from "../utils/i18n";
import { localizedMonthLong } from "../utils/intl";
import Icon from "./Icon";
import type { Locale } from "../utils/i18n";

function CalendarMonthBar(props: CalendarMonthBarProps) {
  function title() {
    const m: ViewMode = props.viewMode ?? "day";
    const loc = props.locale ?? "fr-FR";
    const year = props.focusedYear ?? new Date().getFullYear();
    if (m === "month") return String(year);
    if (m === "year") return t("calendar.year-picker.heading", undefined, loc);
    return `${localizedMonthLong(props.focusedMonth ?? 0, loc)} ${year}`;
  }

  function titleAriaKey() {
    const m: ViewMode = props.viewMode ?? "day";
    if (m === "day") return "actions.pick-month.aria-label";
    if (m === "month") return "actions.pick-year.aria-label";
    return "calendar.year-picker.heading";
  }

  function prevAriaKey() {
    const m: ViewMode = props.viewMode ?? "day";
    return m === "year" ? "actions.prev-year" : "actions.prev-month";
  }

  function nextAriaKey() {
    const m: ViewMode = props.viewMode ?? "day";
    return m === "year" ? "actions.next-year" : "actions.next-month";
  }

  return (
    <div className="rdp-calendar-month-bar">
      <button
        type="button"
        className="rdp-calendar-month-bar__pill"
        aria-label={t(titleAriaKey(), undefined, props.locale ?? "fr-FR")}
        onClick={(event) => props.onTitleClick?.()}
      >
        <Icon name="pick-item" size={16} decorative />
        <span className="rdp-calendar-month-bar__label">{title()}</span>
      </button>
      <div className="rdp-calendar-month-bar__nav">
        <button
          type="button"
          className="rdp-calendar-month-bar__btn rdp-calendar-month-bar__btn--prev"
          aria-label={t(prevAriaKey(), undefined, props.locale ?? "fr-FR")}
          onClick={(event) => props.onPrev?.()}
        >
          <Icon name="previous-item" size={20} decorative />
        </button>
        <button
          type="button"
          className="rdp-calendar-month-bar__btn rdp-calendar-month-bar__btn--next"
          aria-label={t(nextAriaKey(), undefined, props.locale ?? "fr-FR")}
          onClick={(event) => props.onNext?.()}
        >
          <Icon name="next-item" size={20} decorative />
        </button>
      </div>
      <style>{`
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
      `}</style>
    </div>
  );
}

export default CalendarMonthBar;
