import { Injectable, signal, type WritableSignal } from '@angular/core';
import { t as defaultT, setLocale, type Locale } from '../../../src/utils/i18n';

@Injectable({ providedIn: 'root' })
export class DesignSystemService {
  readonly locale: WritableSignal<Locale> = signal<Locale>('fr-FR');
  private customT: ((k: string, vars?: Record<string, string | number>) => string) | null = null;

  setLocale(l: Locale): void {
    setLocale(l);
    this.locale.set(l);
  }

  setT(t: (k: string, vars?: Record<string, string | number>) => string): void {
    this.customT = t;
  }

  t(key: string, vars?: Record<string, string | number>): string {
    return this.customT ? this.customT(key, vars) : defaultT(key, vars, this.locale());
  }
}
