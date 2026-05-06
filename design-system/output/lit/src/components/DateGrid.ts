import  { t } from '../utils/i18n';
import type { Locale } from '../utils/i18n';



   import { LitElement, html, css } from 'lit';
   import { customElement, property, state, query } from 'lit/decorators';

   type DateGridProps = {
 year: number;
 month: number; // 0..11
 selectedDate?: Date;
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






     render() {
       return html`

          <table  role="grid" ><thead ><tr >${this.weekdays?.map((w, index) => (
              html`<th  scope="col" >${t(`calendar.weekdays.short.${w}`, undefined, this.locale ?? 'fr-FR')}</th>`
            ))}</tr></thead>
        <tbody >${this.rows?.map((row, index) => (
              html`<tr >${row?.map((d, index) => (
             html`<td  class={`rdp-date-grid__cell${state.isSelected(d) ? ' rdp-date-grid__cell--selected' : ''}`}  role="gridcell"  aria-selected=${this.isSelected(d) ? 'true' : 'false'}  data-other-month=${d.getMonth() !== this.month ? 'true' : undefined}  @click=${(event) => this.onSelect?.(d)} >${d.getDate()}</td>`
           ))}</tr>`
            ))}</tbody>
        <style >${`
               .rdp-date-grid {
                 width: 100%;
                 table-layout: fixed;
                 border-collapse: separate;
                 border-spacing: 2px;
                 font-family: 'Roboto', sans-serif;
                 font-size: var(--font-size-calendar-month-day-cell);
               }
               .rdp-date-grid__weekday {
                 font-weight: normal;
                 font-size: var(--font-size-calendar-month-day);
                 color: var(--color-brand-active);
                 padding: 4px 0;
                 text-align: center;
               }
               .rdp-date-grid__cell {
                 padding: 6px 0;
                 border: 1px solid var(--color-border);
                 border-radius: var(--radius-selectable);
                 color: var(--color-content-text);
                 background: var(--color-background-future-date);
                 cursor: pointer;
                 text-align: center;
               }
               .rdp-date-grid__cell[data-other-month="true"] {
                 background: var(--color-background-other-month);
                 color: var(--color-light-grey);
               }
               .rdp-date-grid__cell--selected {
                 background: var(--color-brand-active);
                 color: var(--color-white);
                 border-color: var(--color-brand-active);
               }
             `}</style></table>
        `
     }
   }