import { createContext, type ComponentChildren } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { t as defaultT, setLocale, type Locale } from '../../../src/utils/i18n';

type DSContext = {
  t: (k: string, vars?: Record<string, string | number>) => string;
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const Ctx = createContext<DSContext | null>(null);

export function DesignSystemProvider(props: { children: ComponentChildren; locale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(props.locale ?? 'fr-FR');
  const value: DSContext = {
    t: (k, v) => defaultT(k, v, locale),
    locale,
    setLocale: (l) => {
      setLocale(l);
      setLocaleState(l);
    },
  };
  return <Ctx.Provider value={value}>{props.children}</Ctx.Provider>;
}

export function useDesignSystem(): DSContext {
  const v = useContext(Ctx);
  if (!v) return { t: defaultT, locale: 'fr-FR', setLocale };
  return v;
}
