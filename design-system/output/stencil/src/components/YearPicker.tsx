import {
  Component,
  h,
  Fragment,
  Event,
  EventEmitter,
  Prop,
} from "@stencil/core";

@Component({
  tag: "year-picker",
})
export class YearPicker {
  @Prop() yearRange: any;
  @Prop() selectedYear: any;
  @Event() select: any;

  get years() {
    return Array.from(
      {
        length: this.yearRange.max - this.yearRange.min + 1,
      },
      (_, i) => this.yearRange.min + i
    );
  }

  componentDidLoad() {}

  render() {
    return (
      <ul class="rdp-year-picker" role="listbox">
        {this.years?.map((y) => (
          <li
            class={`rdp-year-picker__item${
              y === this.selectedYear ? " rdp-year-picker__item--selected" : ""
            }`}
            role="option"
            aria-selected={y === this.selectedYear ? "true" : "false"}
            onClick={() => this.select?.(y)}
          >
            {y}
          </li>
        ))}
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
  }
}
