import  { t } from '../utils/i18n';
import './Logo.ts';
import './Icon.ts';



  import { LitElement, html, css } from 'lit';
  import { customElement, property, state, query } from 'lit/decorators';

  type AppHeaderProps = {
layout: 'mobile' | 'desktop';
authenticated: boolean;
showAccountControls?: boolean;
onAccountClick?: () => void;
onMySpaceClick?: () => void;
}


  @customElement('app-header')
  export default class AppHeader extends LitElement {

      createRenderRoot() {
        return this;
      }







    @property() layout: any
@property() showAccountControls: any
@property() authenticated: any
@property() onMySpaceClick: any
@property() onAccountClick: any








    render() {
      return html`

          <header  class={`rdp-app-header rdp-app-header--${props.layout}`} ><my-logo  .showWordmark=${true}  .size=${this.layout === 'mobile' ? 'sm' : 'md'} ></my-logo>
        ${this.showAccountControls === true && this.layout === 'desktop' ?
              html`<a  href="#"  aria-disabled=${!this.authenticated ? 'true' : undefined}  @click=${(event) => {
        if (!this.authenticated) {
          event.preventDefault();
          return;
        }
        this.onMySpaceClick?.();
      }} >${t('header.my-space')}</a>`
            : null}
        ${this.showAccountControls === true ?
              html`<button  type="button"  aria-label=${t('header.my-account.aria-label')}  @click=${(event) => this.onAccountClick?.()} ><my-icon  name="pick-item"  .size=${32}  .decorative=${true} ></my-icon></button>`
            : null}
        <style >${`
              .rdp-app-header {
                display: flex;
                align-items: center;
                gap: var(--separation-2);
                padding: var(--separation-1) var(--separation-2);
                background: var(--color-white);
                border-bottom: 1px solid var(--color-border);
                font-family: 'Signika', sans-serif;
              }
              .rdp-app-header--desktop { padding: var(--separation-1) var(--separation-3); }
              .rdp-app-header__myspace {
                margin-left: auto;
                color: var(--color-brand-active);
                text-decoration: none;
                font-family: 'Roboto', sans-serif;
                font-size: var(--font-size-content);
              }
              .rdp-app-header__myspace[aria-disabled="true"] {
                color: var(--color-light-grey);
                cursor: not-allowed;
                pointer-events: none;
              }
              .rdp-app-header__account {
                background: transparent;
                border: none;
                cursor: pointer;
                width: 40px;
                height: 40px;
                margin-left: auto;
                color: var(--color-content-text);
              }
              .rdp-app-header--desktop .rdp-app-header__account { margin-left: 0; }
            `}</style></header>
        `
    }
  }