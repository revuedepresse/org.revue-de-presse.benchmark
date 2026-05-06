import { ErrorMessage } from "../types";

import { t } from "../utils/i18n";

import { Fragment, component$, h, useComputed$ } from "@builder.io/qwik";

type FormErrorProps = {
  errors: ErrorMessage[];
};
export const FormError = component$((props: FormErrorProps) => {
  const items = useComputed$(() => {
    return (props.errors ?? []).map((e) => ({
      key: e.key,
      text: t(e.key, e.vars),
    }));
  });
  const prefix = useComputed$(() => {
    return (props.errors ?? []).length > 1 ? "- " : "";
  });
  const state: any = {};

  return (
    <>
      {items.value.length > 0 ? (
        <div class="rdp-form-error" role="alert" aria-live="polite">
          {(items.value || []).map((item) => {
            return (
              <p class="rdp-form-error__item">
                {prefix.value}
                {item.text}
              </p>
            );
          })}
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
      ) : null}
    </>
  );
});

export default FormError;
