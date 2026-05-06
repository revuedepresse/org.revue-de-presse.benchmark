import { Component, h, Host, Prop, Watch } from '@stencil/core';
import { t as defaultT, setLocale, type Locale } from '../../../src/utils/i18n';

declare global {
  // eslint-disable-next-line no-var
  var __rdp_t: ((k: string, vars?: Record<string, string | number>) => string) | undefined;
  // eslint-disable-next-line no-var
  var __rdp_locale: Locale | undefined;
}

if (!globalThis.__rdp_t) globalThis.__rdp_t = defaultT;
if (!globalThis.__rdp_locale) globalThis.__rdp_locale = 'fr-FR';

@Component({ tag: 'rdp-design-system-provider', shadow: true })
export class RdpDesignSystemProvider {
  @Prop() locale: Locale = 'fr-FR';

  @Watch('locale')
  onLocaleChange(newValue: Locale) {
    setLocale(newValue);
    globalThis.__rdp_locale = newValue;
    document.dispatchEvent(
      new CustomEvent('design-system-locale-changed', { detail: { locale: newValue } })
    );
  }

  componentWillLoad() {
    setLocale(this.locale);
    globalThis.__rdp_locale = this.locale;
  }

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
