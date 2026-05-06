import  { t } from '../utils/i18n';
import  { formatDate } from '../utils/intl';
import type { Locale } from '../utils/i18n';



  import { LitElement, html, css } from 'lit';
  import { customElement, property, state, query } from 'lit/decorators';

  type CalendarActionBarProps = {
date: Date;
locale?: Locale;
onDateClick?: () => void;
onPrev?: () => void;
onNext?: () => void;
position?: 'top' | 'bottom';
}


  @customElement('calendar-action-bar')
  export default class CalendarActionBar extends LitElement {

      createRenderRoot() {
        return this;
      }







    @property() position: any
@property() onDateClick: any
@property() date: any
@property() locale: any
@property() onPrev: any
@property() onNext: any








    render() {
      return html`

          <div  class={`rdp-calendar-action-bar rdp-calendar-action-bar--${props.position ?? 'bottom'}`} ><button  type="button"  @click=${(event) => this.onDateClick?.()} >${formatDate(this.date, 'shortDay', this.locale ?? 'fr-FR')}</button>
        <button  type="button"  aria-label=${t('actions.previous', undefined, this.locale ?? 'fr-FR')}  @click=${(event) => this.onPrev?.()} >
                ‹
              </button>
        <button  type="button"  aria-label=${t('actions.next', undefined, this.locale ?? 'fr-FR')}  @click=${(event) => this.onNext?.()} >
                ›
              </button>
        <style >${`
              .rdp-calendar-action-bar {
                display: flex;
                gap: var(--separation-1);
                align-items: center;
                background: var(--color-brand-active);
                padding: var(--separation-1) var(--separation-2);
                border-radius: var(--radius-default);
                font-family: 'Roboto', sans-serif;
              }
              .rdp-calendar-action-bar__pill {
                flex: 1;
                background: var(--color-content-background);
                color: var(--color-white);
                padding: var(--separation-1) var(--separation-2);
                border: none;
                border-radius: var(--radius-default);
                font-size: var(--font-size-date-picker);
                cursor: pointer;
              }
              .rdp-calendar-action-bar__nav {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: var(--color-white);
                color: var(--color-brand-active);
                border: none;
                cursor: pointer;
                font-size: 20px;
                line-height: 1;
              }
            `}</style></div>
        `
    }
  }