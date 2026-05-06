import type { Locale } from './i18n';

export type DateKind = 'shortDay' | 'longDay' | 'monthYear' | 'iso';

const DATE_OPTIONS: Record<DateKind, Intl.DateTimeFormatOptions> = {
  shortDay: { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' },
  longDay: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  monthYear: { month: 'long', year: 'numeric' },
  iso: { year: 'numeric', month: '2-digit', day: '2-digit' },
};

export function formatDate(date: Date, kind: DateKind, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, DATE_OPTIONS[kind]).format(date);
}

export function formatCount(n: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}
