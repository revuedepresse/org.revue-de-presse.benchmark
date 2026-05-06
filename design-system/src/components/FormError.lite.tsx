import { useStore } from '@builder.io/mitosis';
import { t } from '../utils/i18n';
import type { ErrorMessage } from '../types';

type FormErrorProps = {
  errors: ErrorMessage[];
};

export default function FormError(props: FormErrorProps) {
  const state = useStore({
    get items() {
      return (props.errors ?? []).map((e) => ({ key: e.key, text: t(e.key, e.vars) }));
    },
    get prefix() {
      return (props.errors ?? []).length > 1 ? '- ' : '';
    },
  });

  return (
    <Show when={state.items.length > 0}>
      <div class="rdp-form-error" role="alert" aria-live="polite">
        <For each={state.items}>{(item) => (
          <p class="rdp-form-error__item">
            {state.prefix}{item.text}
          </p>
        )}</For>
        <style>{`
          .rdp-form-error {
            color: var(--form-error-fg);
            font-size: var(--font-size-publication-date);
            font-family: 'Roboto', sans-serif;
            margin-top: var(--separation-1);
          }
          .rdp-form-error__item { margin: 0; }
        `}</style>
      </div>
    </Show>
  );
}
