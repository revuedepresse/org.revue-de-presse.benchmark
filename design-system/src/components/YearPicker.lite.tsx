import { useStore } from '@builder.io/mitosis';

type YearPickerProps = {
  yearRange: { min: number; max: number };
  selectedYear: number;
  onSelect?: (year: number) => void;
};

export default function YearPicker(props: YearPickerProps) {
  const state = useStore({
    get years(): number[] {
      return Array.from(
        { length: props.yearRange.max - props.yearRange.min + 1 },
        (_, i) => props.yearRange.min + i
      );
    },
  });

  return (
    <ul class="rdp-year-picker" role="listbox">
      <For each={state.years}>
        {(y) => (
          <li
            role="option"
            aria-selected={y === props.selectedYear ? 'true' : 'false'}
            class={`rdp-year-picker__item${y === props.selectedYear ? ' rdp-year-picker__item--selected' : ''}`}
            onClick={() => props.onSelect?.(y)}
          >
            {y}
          </li>
        )}
      </For>
      <style>{`
        .rdp-year-picker {
          list-style: none; margin: 0; padding: 0;
          background: var(--color-white);
          border: 1px solid var(--color-brand);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
        }
        .rdp-year-picker__item {
          padding: var(--separation-1) var(--separation-2);
          color: var(--color-brand);
          cursor: pointer;
          border-bottom: 1px solid var(--color-brand);
          text-align: center;
        }
        .rdp-year-picker__item:last-child { border-bottom: none; }
        .rdp-year-picker__item--selected {
          background: var(--color-brand);
          color: var(--color-white);
        }
      `}</style>
    </ul>
  );
}
