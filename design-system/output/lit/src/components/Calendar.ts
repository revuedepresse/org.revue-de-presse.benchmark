import './DateGrid.ts';
import './MonthPicker.ts';
import './YearPicker.ts';
import './CalendarActionBar.ts';
import type { Locale } from '../utils/i18n';



   import { LitElement, html, css } from 'lit';
   import { customElement, property, state, query } from 'lit/decorators';

   type CalendarProps = {
 selectedDate: Date;
 locale?: Locale;
 yearRange: {
   min: number;
   max: number;
 };
 presentation?: 'inline' | 'sheet';
 onSelect?: (date: Date) => void;
 onDismiss?: () => void;
}


   @customElement('my-calendar')
   export default class Calendar extends LitElement {

       createRenderRoot() {
         return this;
       }







     @property() selectedDate: any
@property() onSelect: any
@property() presentation: any
@property() onDismiss: any
@property() locale: any
@property() yearRange: any

       @state()  viewMode= 'day'
@state()  focusedYear= 0
@state()  focusedMonth= 0
@state()  initialised= false

        ensureInit() {
 if (!this.initialised) {
   this.focusedYear = this.selectedDate.getFullYear();
   this.focusedMonth = this.selectedDate.getMonth();
   this.initialised = true;
 }
}
setView(mode: 'day' | 'month' | 'year') {
 this.viewMode = mode;
}
selectDay(d: Date) {
 this.focusedYear = d.getFullYear();
 this.focusedMonth = d.getMonth();
 this.onSelect?.(d);
}
selectMonth(idx: number) {
 this.focusedMonth = idx;
 this.viewMode = 'day';
}
selectYear(y: number) {
 this.focusedYear = y;
 this.viewMode = 'month';
}
prev() {
 if (this.viewMode === 'day') {
   const m = this.focusedMonth - 1;
   if (m < 0) {
     this.focusedMonth = 11;
     this.focusedYear -= 1;
   } else this.focusedMonth = m;
 }
}
next() {
 if (this.viewMode === 'day') {
   const m = this.focusedMonth + 1;
   if (m > 11) {
     this.focusedMonth = 0;
     this.focusedYear += 1;
   } else this.focusedMonth = m;
 }
}






     render() {
       return html`

          <div  class={`rdp-calendar rdp-calendar--${props.presentation ?? 'inline'}`}  role="dialog"  aria-modal=${this.presentation === 'sheet' ? 'true' : 'false'} >${this.presentation === 'sheet' ?
              html`<div  aria-hidden="true"  @click=${(event) => this.onDismiss?.()} ></div>`
            : null}
        <div ><calendar-action-bar  position="top"  .date=${this.selectedDate}  .locale=${this.locale}  @dateclick=${(event) => this.setView('month')}  @prev=${(event) => this.prev()}  @next=${(event) => this.next()} ></calendar-action-bar>
        ${this.viewMode === 'day' ?
              html`<date-grid  .year=${this.focusedYear}  .month=${this.focusedMonth}  .selectedDate=${this.selectedDate}  .locale=${this.locale}  @select=${(d) => this.selectDay(d)} ></date-grid>`
            : null}
        ${this.viewMode === 'month' ?
              html`<month-picker  .year=${this.focusedYear}  .selectedMonth=${this.focusedMonth}  .locale=${this.locale}  @select=${(idx) => this.selectMonth(idx)} ></month-picker>`
            : null}
        ${this.viewMode === 'year' ?
              html`<year-picker  .yearRange=${this.yearRange}  .selectedYear=${this.focusedYear}  @select=${(y) => this.selectYear(y)} ></year-picker>`
            : null}</div>
        <style >${`
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
             `}</style></div>
        `
     }
   }