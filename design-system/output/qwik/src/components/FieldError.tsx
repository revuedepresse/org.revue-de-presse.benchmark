import { t } from "../utils/i18n";

import { Fragment, component$, h } from "@builder.io/qwik";

type FieldErrorProps = {
  messageKey?: string;
  message?: string;
  vars?: Record<string, string | number>;
};
export const FieldError = component$((props: FieldErrorProps) => {
  return (
    <>
      {!!(props.messageKey || props.message) ? (
        <p class="rdp-field-error" role="alert">
          {props.messageKey ? (
            <>{t(props.messageKey, props.vars)}</>
          ) : (
            <>{props.message ?? ""}</>
          )}
          <style>{`
          .rdp-field-error {
            font-size: var(--font-size-publication-date);
            color: var(--form-error-fg);
            margin: 0;
            padding-left: var(--separation-1);
            font-family: 'Roboto', sans-serif;
          }
        `}</style>
        </p>
      ) : null}
    </>
  );
});

export default FieldError;
