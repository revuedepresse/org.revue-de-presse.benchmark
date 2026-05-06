<script lang="ts" context="module">
  import { writable, type Writable } from 'svelte/store';
  import { setContext, getContext } from 'svelte';
  import { t as defaultT, setLocale as defaultSetLocale, type Locale } from '../../../src/utils/i18n';

  const KEY = Symbol('design-system');
  export type DSContext = {
    t: (k: string, vars?: Record<string, string | number>) => string;
    locale: Writable<Locale>;
    setLocale: (l: Locale) => void;
  };

  export function useDesignSystem(): DSContext {
    return getContext<DSContext>(KEY) ?? {
      t: defaultT,
      locale: writable<Locale>('fr-FR'),
      setLocale: defaultSetLocale,
    };
  }

  export const PROVIDER_KEY = KEY;
</script>

<script lang="ts">
  export let locale: Locale = 'fr-FR';
  export let t: ((k: string, vars?: Record<string, string | number>) => string) | null = null;

  const localeStore = writable<Locale>(locale);
  let currentLocale: Locale = locale;
  localeStore.subscribe((x) => (currentLocale = x));

  const ctx: DSContext = {
    t: t ?? ((k, v) => defaultT(k, v, currentLocale)),
    locale: localeStore,
    setLocale: (l) => {
      defaultSetLocale(l);
      localeStore.set(l);
    },
  };
  setContext(PROVIDER_KEY, ctx);
</script>

<slot />
