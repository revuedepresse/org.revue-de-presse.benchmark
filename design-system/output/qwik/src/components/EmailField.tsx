import { t } from "../utils/i18n";

import { $, Fragment, component$, h } from "@builder.io/qwik";

type EmailFieldProps = {
  name: string;
  value: string;
  onChange?: (value: string) => void;
  labelKey?: string;
  error?: boolean;
  required?: boolean;
};
export const EmailField = component$((props: EmailFieldProps) => {
  return (
    <div class="rdp-textfield" data-error={props.error ? "true" : undefined}>
      <label class="rdp-textfield__label" for={`field-${props.name}`}>
        {t(props.labelKey ?? "auth.email-label")}
      </label>
      <input
        type="email"
        autocomplete="email"
        id={`field-${props.name}`}
        name={props.name}
        value={props.value}
        required={props.required}
        onInput$={$((event) => props.onChange?.(event.target.value))}
      />
      <style>{`
        .rdp-textfield { display: flex; flex-direction: column; gap: 4px; font-family: 'Roboto', sans-serif; }
        .rdp-textfield__label {
          font-size: var(--font-size-publication-date);
          color: var(--color-content-text);
          padding-left: var(--separation-1);
        }
        .rdp-textfield input {
          padding: var(--separation-1) var(--separation-2);
          border: 1px solid var(--input-border-default);
          background: var(--input-bg-default);
          color: var(--input-fg-default);
          border-radius: var(--radius-default);
          font-size: var(--font-size-content);
        }
        .rdp-textfield[data-error="true"] input { border-color: var(--input-border-error); }
      `}</style>
    </div>
  );
});

export default EmailField;
