import  { t } from '../utils/i18n';



  import { LitElement, html, css } from 'lit';
  import { customElement, property, state, query } from 'lit/decorators';

  type LinkProps = {
href: string;
labelKey?: string;
label?: string;
external?: boolean;
variant?: 'underline' | 'inline' | 'plain';
}


  @customElement('my-link')
  export default class Link extends LitElement {

      createRenderRoot() {
        return this;
      }







    @property() variant: any
@property() href: any
@property() external: any
@property() labelKey: any
@property() label: any








    render() {
      return html`

          <a  class={`rdp-link rdp-link--${props.variant ?? 'underline'}`}  .href=${this.href}  .target=${this.external ? '_blank' : undefined}  .rel=${this.external ? 'noopener noreferrer' : undefined} >${this.labelKey ?
              html`${t(this.labelKey)}`
            : html`${this.label ?? ''}`}
        <style >${`
              .rdp-link {
                color: var(--color-brand-active);
                text-decoration: none;
                font-family: 'Roboto', sans-serif;
              }
              .rdp-link--underline { text-decoration: underline; }
              .rdp-link--plain { color: inherit; }
              .rdp-link:hover { color: var(--color-brand); }
            `}</style></a>
        `
    }
  }