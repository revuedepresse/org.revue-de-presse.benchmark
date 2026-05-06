import type { Alpine } from 'alpinejs';
import { t as defaultT, setLocale, type Locale } from '../../../src/utils/i18n';

let currentLocale: Locale = 'fr-FR';
let customT: ((k: string, vars?: Record<string, string | number>) => string) | null = null;

export default function plugin(Alpine: Alpine) {
  Alpine.magic('rdp', () => ({
    t: (key: string, vars?: Record<string, string | number>) =>
      customT ? customT(key, vars) : defaultT(key, vars, currentLocale),
    locale: () => currentLocale,
    setLocale: (l: Locale) => {
      setLocale(l);
      currentLocale = l;
      document.dispatchEvent(
        new CustomEvent('design-system-locale-changed', { detail: { locale: l } })
      );
    },
    setT: (t: (k: string, vars?: Record<string, string | number>) => string) => {
      customT = t;
    },
  }));
}
