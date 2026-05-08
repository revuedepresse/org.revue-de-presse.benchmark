import { LitElement, html, css } from 'lit';
  import { customElement, property, state, query } from 'lit/decorators';

  type YearPickerProps = {
yearRange: {
  min: number;
  max: number;
};
selectedYear: number;
onSelect?: (year: number) => void;
}


  @customElement('year-picker')
  export default class YearPicker extends LitElement {

      createRenderRoot() {
        return this;
      }







    @property() yearRange: any
@property() selectedYear: any
@property() onSelect: any


       get years() {
return Array.from({
  length: this.yearRange.max - this.yearRange.min + 1
}, (_, i) => this.yearRange.min + i);
}






    render() {
      return html`

          <ul  role="listbox" >${this.years?.map((y, index) => (
              html`<li  class={`rdp-year-picker__item${y === props.selectedYear ? ' rdp-year-picker__item--selected' : ''}`}  role="option"  aria-selected=${y === this.selectedYear ? 'true' : 'false'}  @click=${(event) => this.onSelect?.(y)} >${y}</li>`
            ))}
        <style >${`
              .rdp-year-picker {
                list-style: none;
                margin: 0 var(--separation-2) var(--separation-2);
                margin-left: calc(2 * var(--separation-2));
                padding: 0;
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
            `}</style></ul>
        `
    }
  }