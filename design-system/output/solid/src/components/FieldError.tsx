import { Show } from "solid-js";

type FieldErrorProps = {
  messageKey?: string;
  message?: string;
  vars?: Record<string, string | number>;
};

import { t } from "../utils/i18n";

function FieldError(props: FieldErrorProps) {
  return (
    <>
      <Show when={!!(props.messageKey || props.message)}>
        <p class="rdp-field-error" role="alert">
          <Show fallback={props.message ?? ""} when={props.messageKey}>
            {t(props.messageKey, props.vars)}
          </Show>
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
      </Show>
    </>
  );
}

export default FieldError;
