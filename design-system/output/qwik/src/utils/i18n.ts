import frFR from '../locales/fr-FR.json';
import enGB from '../locales/en-GB.json';

export type Locale = 'fr-FR' | 'en-GB';

const dicts: Record<Locale, Record<string, string>> = {
  'fr-FR': frFR as Record<string, string>,
  'en-GB': enGB as Record<string, string>,
};

let currentLocale: Locale = 'fr-FR';

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key) => {
    const value = vars[key];
    return value === undefined ? '' : String(value);
  });
}

export function t(
  key: string,
  vars?: Record<string, string | number>,
  locale: Locale = currentLocale
): string {
  const dict = dicts[locale] ?? dicts['fr-FR'];
  const raw = dict[key];
  if (raw === undefined) return key;
  return vars ? interpolate(raw, vars) : raw;
}
