import { $, Fragment, component$, h, useComputed$ } from "@builder.io/qwik";

type YearPickerProps = {
  yearRange: {
    min: number;
    max: number;
  };
  selectedYear: number;
  onSelect?: (year: number) => void;
};
export const YearPicker = component$((props: YearPickerProps) => {
  const years = useComputed$(() => {
    return Array.from(
      {
        length: props.yearRange.max - props.yearRange.min + 1,
      },
      (_, i) => props.yearRange.min + i
    );
  });
  const state: any = {};

  return (
    <ul class="rdp-year-picker" role="listbox">
      {(years.value || []).map((y) => {
        return (
          <li
            role="option"
            aria-selected={(() => {
              y === props.selectedYear ? "true" : "false";
            })()}
            class={`rdp-year-picker__item${
              y === props.selectedYear ? " rdp-year-picker__item--selected" : ""
            }`}
            onClick$={$((event) => props.onSelect?.(y))}
          >
            {y}
          </li>
        );
      })}
      <style>{`
        .rdp-year-picker {
          list-style: none; margin: 0; padding: 0;
          background: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
        }
        .rdp-year-picker__item {
          padding: var(--separation-1) var(--separation-2);
          color: var(--color-content-text);
          cursor: pointer;
          border-bottom: 1px solid var(--color-border);
          text-align: center;
        }
        .rdp-year-picker__item:last-child { border-bottom: none; }
        .rdp-year-picker__item--selected {
          background: var(--color-brand-active);
          color: var(--color-white);
        }
      `}</style>
    </ul>
  );
});

export default YearPicker;
