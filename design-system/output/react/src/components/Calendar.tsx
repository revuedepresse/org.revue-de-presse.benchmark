"use client";
import * as React from "react";
import { useState } from "react";

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
import DateGrid from "./DateGrid";
import MonthPicker from "./MonthPicker";
import YearPicker from "./YearPicker";
import CalendarActionBar from "./CalendarActionBar";
import type { Locale } from "../utils/i18n";

function Calendar(props: CalendarProps) {
  const [viewMode, setViewMode] = useState(() => "day");

  const [focusedYear, setFocusedYear] = useState(() => 0);

  const [focusedMonth, setFocusedMonth] = useState(() => 0);

  const [initialised, setInitialised] = useState(() => false);

  function ensureInit() {
    if (!initialised) {
      setFocusedYear(props.selectedDate.getFullYear());
      setFocusedMonth(props.selectedDate.getMonth());
      setInitialised(true);
    }
  }

  function setView(mode: "day" | "month" | "year") {
    setViewMode(mode);
  }

  function selectDay(d: Date) {
    setFocusedYear(d.getFullYear());
    setFocusedMonth(d.getMonth());
    props.onSelect?.(d);
  }

  function selectMonth(idx: number) {
    setFocusedMonth(idx);
    setViewMode("day");
  }

  function selectYear(y: number) {
    setFocusedYear(y);
    setViewMode("month");
  }

  function prev() {
    if (viewMode === "day") {
      const m = focusedMonth - 1;
      if (m < 0) {
        setFocusedMonth(11);
        setFocusedYear(1);
      } else setFocusedMonth(m);
    }
  }

  function next() {
    if (viewMode === "day") {
      const m = focusedMonth + 1;
      if (m > 11) {
        setFocusedMonth(0);
        setFocusedYear(1);
      } else setFocusedMonth(m);
    }
  }

  return (
    <div
      role="dialog"
      className={`rdp-calendar rdp-calendar--${props.presentation ?? "inline"}`}
      aria-modal={props.presentation === "sheet" ? "true" : "false"}
    >
      {props.presentation === "sheet" ? (
        <div
          className="rdp-calendar__scrim"
          aria-hidden="true"
          onClick={(event) => props.onDismiss?.()}
        />
      ) : null}
      <div className="rdp-calendar__panel">
        <CalendarActionBar
          position="top"
          date={props.selectedDate}
          locale={props.locale}
          onDateClick={(event) => setView("month")}
          onPrev={(event) => prev()}
          onNext={(event) => next()}
        />
        {viewMode === "day" ? (
          <DateGrid
            year={focusedYear}
            month={focusedMonth}
            selectedDate={props.selectedDate}
            locale={props.locale}
            onSelect={(d) => selectDay(d)}
          />
        ) : null}
        {viewMode === "month" ? (
          <MonthPicker
            year={focusedYear}
            selectedMonth={focusedMonth}
            locale={props.locale}
            onSelect={(idx) => selectMonth(idx)}
          />
        ) : null}
        {viewMode === "year" ? (
          <YearPicker
            yearRange={props.yearRange}
            selectedYear={focusedYear}
            onSelect={(y) => selectYear(y)}
          />
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

export default Calendar;
