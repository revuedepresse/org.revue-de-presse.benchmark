import  { t } from '../utils/i18n';
import type { ButtonVariant, IconName } from '../types';



  import { LitElement, html, css } from 'lit';
  import { customElement, property, state, query } from 'lit/decorators';

  type ButtonProps = {
variant: ButtonVariant;
labelKey?: string;
label?: string;
icon?: IconName;
iconAfter?: IconName;
disabled?: boolean;
loading?: boolean;
ariaLabel?: string;
onClick?: () => void;
}


  @customElement('my-button')
  export default class Button extends LitElement {

      createRenderRoot() {
        return this;
      }







    @property() variant: any
@property() loading: any
@property() disabled: any
@property() ariaLabel: any
@property() onClick: any
@property() icon: any
@property() labelKey: any
@property() label: any
@property() iconAfter: any








    render() {
      return html`

          <button  class={`rdp-button rdp-button--${props.variant}`}  type="button"  data-loading=${this.loading ? 'true' : undefined}  .disabled=${this.disabled || this.loading}  aria-label=${this.ariaLabel}  @click=${(event) => this.onClick?.()} >${this.icon ?
              html`<span >${this.icon}</span>`
            : null}
        ${this.variant !== 'scrollTop' && this.variant !== 'avatar' ?
              html`<span >${this.labelKey ?
            html`${t(this.labelKey)}`
          : html`${this.label ?? ''}`}</span>`
            : null}
        ${this.iconAfter ?
              html`<span >${this.iconAfter}</span>`
            : null}
        <style >${`
              .rdp-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: var(--separation-1);
                border: none;
                cursor: pointer;
                font-family: 'Roboto', sans-serif;
                font-size: var(--font-size-content);
                padding: var(--separation-1) var(--separation-2);
                border-radius: var(--radius-default);
                background: var(--button-bg-primary);
                color: var(--button-fg-primary);
                transition: background 120ms;
              }
              .rdp-button:hover { background: var(--button-bg-primary-hover); }
              .rdp-button:disabled { background: var(--button-bg-disabled); cursor: not-allowed; }
              .rdp-button--secondary {
                background: var(--button-bg-secondary);
                color: var(--color-brand-active);
                border: 1px solid var(--button-border-secondary);
              }
              .rdp-button--scrollTop, .rdp-button--avatar {
                width: 48px; height: 48px; padding: 0; border-radius: 50%;
              }
              .rdp-button--quit { background: transparent; color: var(--color-content-text); padding: 0; }
              .rdp-button--calendarNav { padding: 0; width: 32px; height: 32px; border-radius: 50%; }
              .rdp-button--form { width: 100%; padding: var(--separation-2); }
            `}</style></button>
        `
    }
  }