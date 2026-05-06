import { defineComponent, h, provide, inject, ref, type InjectionKey, type Ref } from 'vue';
import { t as defaultT, setLocale, type Locale } from '../../../src/utils/i18n';

export type DSContext = {
  t: (key: string, vars?: Record<string, string | number>) => string;
  locale: Ref<Locale>;
  setLocale: (l: Locale) => void;
};

const KEY: InjectionKey<DSContext> = Symbol('design-system');

export const DesignSystemProvider = defineComponent({
  name: 'DesignSystemProvider',
  props: {
    locale: { type: String as () => Locale, default: 'fr-FR' },
    t: { type: Function as unknown as () => DSContext['t'], default: null },
  },
  setup(props, { slots }) {
    const locale = ref<Locale>(props.locale);
    const ctx: DSContext = {
      t: props.t ?? ((k, v) => defaultT(k, v, locale.value)),
      locale,
      setLocale: (l) => {
        setLocale(l);
        locale.value = l;
      },
    };
    provide(KEY, ctx);
    return () => slots.default?.();
  },
});

export function useDesignSystem(): DSContext {
  const v = inject(KEY);
  if (!v) {
    return { t: defaultT, locale: ref<Locale>('fr-FR'), setLocale };
  }
  return v;
}
