import './DateGrid.ts';
import './MonthPicker.ts';
import './YearPicker.ts';
import './CalendarActionBar.ts';
import './CalendarMonthBar.ts';
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
@property() yearRange: any
@property() presentation: any
@property() onDismiss: any
@property() locale: any

       @state()  viewMode= 'day'
@state()  focusedDate= new Date()
@state()  focusedYear= 0
@state()  focusedMonth= 0
@state()  initialised= false

        selectDay(d: Date) {
 this.focusedDate = d;
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
prevDay() {
 const next = new Date(this.focusedDate);
 next.setDate(next.getDate() - 1);
 this.focusedDate = next;
 this.focusedYear = next.getFullYear();
 this.focusedMonth = next.getMonth();
}
nextDay() {
 const next = new Date(this.focusedDate);
 next.setDate(next.getDate() + 1);
 this.focusedDate = next;
 this.focusedYear = next.getFullYear();
 this.focusedMonth = next.getMonth();
}
prevMonth() {
 if (this.viewMode === 'year') {
   const next = this.focusedYear - 1;
   if (next >= this.yearRange.min) this.focusedYear = next;
   return;
 }
 const m = this.focusedMonth - 1;
 if (m < 0) {
   this.focusedMonth = 11;
   this.focusedYear -= 1;
 } else {
   this.focusedMonth = m;
 }
}
nextMonth() {
 if (this.viewMode === 'year') {
   const next = this.focusedYear + 1;
   if (next <= this.yearRange.max) this.focusedYear = next;
   return;
 }
 const m = this.focusedMonth + 1;
 if (m > 11) {
   this.focusedMonth = 0;
   this.focusedYear += 1;
 } else {
   this.focusedMonth = m;
 }
}
titleClick() {
 if (this.viewMode === 'day') {
   this.viewMode = 'month';
 } else if (this.viewMode === 'month') {
   this.viewMode = 'year';
 }
}


       connectedCallback() { this.focusedDate = this.selectedDate;
this.focusedYear = this.selectedDate.getFullYear();
this.focusedMonth = this.selectedDate.getMonth();
this.initialised = true }

       updated() {
             this.focusedDate = this.selectedDate;
this.focusedYear = this.selectedDate.getFullYear();
this.focusedMonth = this.selectedDate.getMonth()
           }

     render() {
       return html`

          <div  class={`rdp-calendar rdp-calendar--${props.presentation ?? 'inline'}`}  role="dialog"  aria-modal=${this.presentation === 'sheet' ? 'true' : 'false'} >${this.presentation === 'sheet' ?
              html`<div  aria-hidden="true"  @click=${(event) => this.onDismiss?.()} ></div>`
            : null}
        <div ><calendar-action-bar  position="top"  .date=${this.focusedDate}  .locale=${this.locale}  @prev=${(event) => this.prevDay()}  @next=${(event) => this.nextDay()} ></calendar-action-bar>
        <calendar-month-bar  .viewMode=${this.viewMode}  .focusedYear=${this.focusedYear}  .focusedMonth=${this.focusedMonth}  .locale=${this.locale}  @titleclick=${(event) => this.titleClick()}  @prev=${(event) => this.prevMonth()}  @next=${(event) => this.nextMonth()} ></calendar-month-bar>
        ${this.viewMode === 'day' ?
              html`<date-grid  .year=${this.focusedYear}  .month=${this.focusedMonth}  .selectedDate=${this.focusedDate}  .locale=${this.locale}  @select=${(d) => this.selectDay(d)} ></date-grid>`
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