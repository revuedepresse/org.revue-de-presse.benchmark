import { t } from './i18n';
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

const WEEKDAY_KEYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

const MONTH_KEYS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

export function localizedWeekdayShort(date: Date, locale: Locale): string {
  return t(`calendar.weekdays.short.${WEEKDAY_KEYS[date.getDay()]}`, undefined, locale);
}

export function localizedMonthShort(monthIndex: number, locale: Locale): string {
  return t(`calendar.months.short.${MONTH_KEYS[monthIndex]}`, undefined, locale);
}

export function localizedMonthLong(monthIndex: number, locale: Locale): string {
  return t(`calendar.months.long.${MONTH_KEYS[monthIndex]}`, undefined, locale);
}

// Legacy "Ven. 2 Avr. 2021" composition — sourced from locale.json so the
// abbreviations and casing match the legacy revue-de-presse.org rendering.
export function formatLegacyShortDay(date: Date, locale: Locale): string {
  const weekday = localizedWeekdayShort(date, locale);
  const month = localizedMonthShort(date.getMonth(), locale);
  return `${weekday} ${date.getDate()} ${month} ${date.getFullYear()}`;
}
