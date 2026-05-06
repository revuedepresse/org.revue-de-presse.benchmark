import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { t as defaultT, setLocale as defaultSetLocale, type Locale } from '../../../src/utils/i18n';

declare global {
  // eslint-disable-next-line no-var
  var __rdp_t: ((k: string, vars?: Record<string, string | number>) => string) | undefined;
  // eslint-disable-next-line no-var
  var __rdp_locale: Locale | undefined;
}

if (!globalThis.__rdp_t) globalThis.__rdp_t = defaultT;
if (!globalThis.__rdp_locale) globalThis.__rdp_locale = 'fr-FR';

@customElement('rdp-design-system-provider')
export class DesignSystemProvider extends LitElement {
  @property({ type: String }) locale: Locale = 'fr-FR';
  @property({ attribute: false }) t?: (
    k: string,
    vars?: Record<string, string | number>
  ) => string;

  static styles = css`
    :host {
      display: contents;
    }
  `;

  updated(): void {
    globalThis.__rdp_t = this.t ?? ((k, v) => defaultT(k, v, this.locale));
    globalThis.__rdp_locale = this.locale;
    defaultSetLocale(this.locale);
    this.dispatchEvent(
      new CustomEvent('design-system-locale-changed', {
        detail: { locale: this.locale },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`<slot></slot>`;
  }
}
