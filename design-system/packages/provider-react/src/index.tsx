import React, { createContext, useContext, useState } from 'react';
import { t as defaultT, setLocale, type Locale } from '../../../src/utils/i18n';

type DSContext = {
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const Ctx = createContext<DSContext | null>(null);

export function DesignSystemProvider({
  children,
  t,
  locale: initialLocale = 'fr-FR',
}: {
  children: React.ReactNode;
  t?: (key: string, vars?: Record<string, string | number>) => string;
  locale?: Locale;
}) {
  const [locale, _setLocale] = useState<Locale>(initialLocale);
  const value: DSContext = {
    t: t ?? ((key, vars) => defaultT(key, vars, locale)),
    locale,
    setLocale: (l) => {
      setLocale(l);
      _setLocale(l);
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDesignSystem(): DSContext {
  const v = useContext(Ctx);
  if (!v) {
    return { t: defaultT, locale: 'fr-FR', setLocale };
  }
  return v;
}
