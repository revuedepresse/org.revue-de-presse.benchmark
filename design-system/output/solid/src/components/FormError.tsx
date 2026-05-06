import { Show, For, createSignal, createMemo } from "solid-js";

type FormErrorProps = {
  errors: ErrorMessage[];
};

import { t } from "../utils/i18n";
import type { ErrorMessage } from "../types";

function FormError(props: FormErrorProps) {
  const items = createMemo(() => {
    return (props.errors ?? []).map((e) => ({
      key: e.key,
      text: t(e.key, e.vars),
    }));
  });

  const prefix = createMemo(() => {
    return (props.errors ?? []).length > 1 ? "- " : "";
  });

  return (
    <>
      <Show when={items().length > 0}>
        <div class="rdp-form-error" role="alert" aria-live="polite">
          <For each={items()}>
            {(item, _index) => {
              const index = _index();
              return (
                <p class="rdp-form-error__item">
                  {prefix()}
                  {item.text}
                </p>
              );
            }}
          </For>
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
    </>
  );
}

export default FormError;
