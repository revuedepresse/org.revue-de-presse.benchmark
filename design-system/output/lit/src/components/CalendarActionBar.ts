import  { t } from '../utils/i18n';
import  { formatLegacyShortDay } from '../utils/intl';
import './Icon.ts';
import type { Locale } from '../utils/i18n';



  import { LitElement, html, css } from 'lit';
  import { customElement, property, state, query } from 'lit/decorators';

  type CalendarActionBarProps = {
date: Date;
locale?: Locale;
onPrev?: () => void;
onNext?: () => void;
onPillClick?: () => void;
prevDisabled?: boolean;
nextDisabled?: boolean;
position?: 'top' | 'bottom';
}


  @customElement('calendar-action-bar')
  export default class CalendarActionBar extends LitElement {

      createRenderRoot() {
        return this;
      }







    @property() position: any
@property() locale: any
@property() onPillClick: any
@property() date: any
@property() prevDisabled: any
@property() onPrev: any
@property() nextDisabled: any
@property() onNext: any








    render() {
      return html`

          <div  class={`rdp-calendar-action-bar rdp-calendar-action-bar--${props.position ?? 'top'}`} ><button  type="button"  aria-label=${t('actions.pick-month.aria-label', undefined, this.locale ?? 'fr-FR')}  @click=${(event) => this.onPillClick?.()} ><my-icon  name="pick-day"  .size=${16}  .decorative=${true} ></my-icon>
        <span >${formatLegacyShortDay(this.date, this.locale ?? 'fr-FR')}</span></button>
        <div ><button  type="button"  aria-label=${t('actions.prev-day', undefined, this.locale ?? 'fr-FR')}  aria-disabled=${this.prevDisabled === true ? 'true' : undefined}  .disabled=${this.prevDisabled === true}  @click=${(event) => {
          if (this.prevDisabled !== true) this.onPrev?.();
        }} ><my-icon  name="previous-item"  .size=${32}  .decorative=${true} ></my-icon></button>
        <button  type="button"  aria-label=${t('actions.next-day', undefined, this.locale ?? 'fr-FR')}  aria-disabled=${this.nextDisabled === true ? 'true' : undefined}  .disabled=${this.nextDisabled === true}  @click=${(event) => {
          if (this.nextDisabled !== true) this.onNext?.();
        }} ><my-icon  name="next-item"  .size=${32}  .decorative=${true} ></my-icon></button></div>
        <style >${`
              .rdp-calendar-action-bar {
                display: flex;
                gap: var(--separation-1);
                align-items: center;
                background: var(--color-brand);
                padding: var(--separation-1) var(--separation-2);
                /* Square bottom corners so the band visually merges with the
                   month bar / day grid below it. */
                border-radius: var(--radius-default) var(--radius-default) 0 0;
                font-family: 'Roboto', sans-serif;
              }
              .rdp-calendar-action-bar--bottom {
                border-radius: 0;
              }
              .rdp-calendar-action-bar__pill > svg:first-child { flex-shrink: 0; }
              .rdp-calendar-action-bar__pill {
                flex: 1;
                display: inline-flex;
                align-items: center;
                gap: var(--separation-1);
                background: transparent;
                color: var(--color-white);
                padding: 0 0 0 var(--separation-2);
                border: none;
                border-radius: var(--radius-default);
                font-size: var(--font-size-date-picker);
                font-family: inherit;
                text-align: left;
                cursor: pointer;
              }
              .rdp-calendar-action-bar__nav {
                display: flex;
                gap: var(--separation-1);
                flex-direction: row;
              }
              .rdp-calendar-action-bar__btn {
                width: 32px;
                height: 32px;
                padding: 0;
                background: transparent;
                color: var(--color-brand);
                border: none;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                line-height: 0;
              }
              /* Day-nav uses the legacy previous-item / next-item icons (which carry
                 a built-in white-fill circle) rotated 90° so the chevrons point
                 left/right instead of up/down. */
              .rdp-calendar-action-bar__btn--prev svg { transform: rotate(-90deg); }
              .rdp-calendar-action-bar__btn--next svg { transform: rotate(-90deg); }
              .rdp-calendar-action-bar__btn[aria-disabled="true"] {
                cursor: not-allowed;
                opacity: 0.5;
              }
            `}</style></div>
        `
    }
  }