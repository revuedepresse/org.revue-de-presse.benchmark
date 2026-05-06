import { createContext, useContext, createSignal, type JSX, type ParentProps } from 'solid-js';
import { t as defaultT, setLocale as defaultSetLocale, type Locale } from '../../../src/utils/i18n';

type DSContext = {
  t: (k: string, vars?: Record<string, string | number>) => string;
  locale: () => Locale;
  setLocale: (l: Locale) => void;
};

const Ctx = createContext<DSContext>();

export function DesignSystemProvider(
  props: ParentProps<{ locale?: Locale; t?: DSContext['t'] }>
): JSX.Element {
  const [locale, setLocaleSignal] = createSignal<Locale>(props.locale ?? 'fr-FR');
  const ctx: DSContext = {
    t: props.t ?? ((k, v) => defaultT(k, v, locale())),
    locale,
    setLocale: (l) => {
      defaultSetLocale(l);
      setLocaleSignal(l);
    },
  };
  return <Ctx.Provider value={ctx}>{props.children}</Ctx.Provider>;
}

export function useDesignSystem(): DSContext {
  const v = useContext(Ctx);
  if (!v) {
    return { t: defaultT, locale: () => 'fr-FR', setLocale: defaultSetLocale };
  }
  return v;
}
