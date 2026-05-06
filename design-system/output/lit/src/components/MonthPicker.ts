import  { t } from '../utils/i18n';
import  { localizedMonthLong } from '../utils/intl';
import type { Locale } from '../utils/i18n';



  import { LitElement, html, css } from 'lit';
  import { customElement, property, state, query } from 'lit/decorators';

  type MonthPickerProps = {
year: number;
selectedMonth: number; // 0..11
locale?: Locale;
onSelect?: (monthIndex: number) => void;
}


  @customElement('month-picker')
  export default class MonthPicker extends LitElement {

      createRenderRoot() {
        return this;
      }







    @property() locale: any
@property() year: any
@property() selectedMonth: any
@property() onSelect: any


       get months() {
return Array.from({
  length: 12
}, (_, i) => localizedMonthLong(i, this.locale ?? 'fr-FR'));
}






    render() {
      return html`

          <ul  role="listbox"  aria-label=${t('calendar.heading.year', {
          year: this.year
        })} >${this.months?.map((name, index) => (
              html`<li  class={`rdp-month-picker__item${index === props.selectedMonth ? ' rdp-month-picker__item--selected' : ''}`}  role="option"  aria-selected=${index === this.selectedMonth ? 'true' : 'false'}  @click=${(event) => this.onSelect?.(index)} >${name}</li>`
            ))}
        <style >${`
              .rdp-month-picker {
                list-style: none; margin: 0; padding: 0;
                background: var(--color-white);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-default);
                font-family: 'Roboto', sans-serif;
                font-size: var(--font-size-content);
              }
              .rdp-month-picker__item {
                padding: var(--separation-1) var(--separation-2);
                color: var(--color-content-text);
                cursor: pointer;
                border-bottom: 1px solid var(--color-border);
              }
              .rdp-month-picker__item:last-child { border-bottom: none; }
              .rdp-month-picker__item--selected {
                background: var(--color-brand-active);
                color: var(--color-white);
              }
            `}</style></ul>
        `
    }
  }