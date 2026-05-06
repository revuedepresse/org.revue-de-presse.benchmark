import {
  component$,
  createContextId,
  Slot,
  useContext,
  useContextProvider,
  useSignal,
  type Signal,
} from '@builder.io/qwik';
import { t as defaultT, setLocale as defaultSetLocale, type Locale } from '../../../src/utils/i18n';

type DSContext = {
  locale: Signal<Locale>;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

export const DesignSystemContext = createContextId<DSContext>('design-system');

type ProviderProps = { initialLocale?: Locale };

export const DesignSystemProvider = component$<ProviderProps>(({ initialLocale }) => {
  const locale = useSignal<Locale>(initialLocale ?? 'fr-FR');
  const ctx: DSContext = {
    locale,
    setLocale: (l: Locale) => {
      defaultSetLocale(l);
      locale.value = l;
    },
    t: (k, v) => defaultT(k, v, locale.value),
  };
  useContextProvider(DesignSystemContext, ctx);
  return <Slot />;
});

export function useDesignSystem(): DSContext {
  return useContext(DesignSystemContext);
}
