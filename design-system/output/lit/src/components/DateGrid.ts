import  { t } from '../utils/i18n';
import type { Locale } from '../utils/i18n';



   import { LitElement, html, css } from 'lit';
   import { customElement, property, state, query } from 'lit/decorators';

   type DateGridProps = {
 year: number;
 month: number; // 0..11
 selectedDate?: Date;
 minDate?: Date;
 locale?: Locale;
 onSelect?: (date: Date) => void;
}


   @customElement('date-grid')
   export default class DateGrid extends LitElement {

       createRenderRoot() {
         return this;
       }







     @property() year: any
@property() month: any
@property() selectedDate: any
@property() minDate: any
@property() locale: any
@property() onSelect: any

       @state()  weekdays= ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

        get rows() {
 const first = new Date(this.year, this.month, 1);
 const offset = (first.getDay() + 6) % 7;
 const start = new Date(this.year, this.month, 1 - offset);
 const all = Array.from({
   length: 42
 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
 return [0, 1, 2, 3, 4, 5].map(row => all.slice(row * 7, row * 7 + 7));
}
isSelected(d: Date) {
 const sel = this.selectedDate;
 return !!sel && sel.getFullYear() === d.getFullYear() && sel.getMonth() === d.getMonth() && sel.getDate() === d.getDate();
}
isFuture(d: Date) {
 const today = new Date();
 today.setHours(0, 0, 0, 0);
 const cell = new Date(d.getFullYear(), d.getMonth(), d.getDate());
 return cell.getTime() >= today.getTime();
}
isBeforeMin(d: Date) {
 if (!this.minDate) return false;
 const min = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate());
 const cell = new Date(d.getFullYear(), d.getMonth(), d.getDate());
 return cell.getTime() < min.getTime();
}
isDisabled(d: Date) {
 return this.isFuture(d) || this.isBeforeMin(d);
}






     render() {
       return html`

          <table  role="grid" ><thead ><tr >${this.weekdays?.map((w, index) => (
              html`<th  scope="col" >${t(`calendar.weekdays.short.${w}`, undefined, this.locale ?? 'fr-FR')}</th>`
            ))}</tr></thead>
        <tbody >${this.rows?.map((row, index) => (
              html`<tr >${row?.map((d, index) => (
             html`<td  class={`rdp-date-grid__cell${state.isSelected(d) ? ' rdp-date-grid__cell--selected' : ''}`}  role="gridcell"  aria-selected=${this.isSelected(d) ? 'true' : 'false'}  aria-disabled=${this.isDisabled(d) ? 'true' : undefined}  data-other-month=${d.getMonth() !== this.month ? 'true' : undefined}  data-future=${this.isDisabled(d) ? 'true' : undefined}  @click=${(event) => {
          if (!this.isDisabled(d)) this.onSelect?.(d);
        }} >${!this.isDisabled(d) ?
              html`${d.getDate()}`
            : null}</td>`
           ))}</tr>`
            ))}</tbody>
        <style >${`
               .rdp-date-grid {
                 width: calc(100% - 2 * var(--separation-2));
                 margin: 0 var(--separation-2) var(--separation-2);
                 table-layout: fixed;
                 border-collapse: separate;
                 border-spacing: 2px;
                 font-family: 'Roboto', sans-serif;
                 font-size: var(--font-size-calendar-month-day-cell);
               }
               .rdp-date-grid__weekday {
                 font-weight: normal;
                 font-size: var(--font-size-calendar-month-day);
                 color: var(--color-brand);
                 padding: 4px 0;
                 text-align: center;
               }
               .rdp-date-grid__cell {
                 padding: 6px 0;
                 height: 32px;
                 border: 1px solid var(--color-border);
                 border-radius: var(--radius-selectable);
                 color: var(--color-content-text);
                 background: var(--color-background-future-date);
                 cursor: pointer;
                 text-align: center;
                 box-sizing: border-box;
               }
               .rdp-date-grid__cell[data-other-month="true"] {
                 background: var(--color-background-other-month);
                 color: var(--color-light-grey);
               }
               .rdp-date-grid__cell[data-future="true"] {
                 color: var(--color-light-grey);
                 background: var(--color-background-future-date);
                 cursor: not-allowed;
               }
               .rdp-date-grid__cell--selected {
                 background: var(--color-brand);
                 color: var(--color-white);
                 border-color: var(--color-brand);
               }
             `}</style></table>
        `
     }
   }