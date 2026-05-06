/** @jsx h */
import { h, Fragment } from "preact";

type TextFieldProps = {
  name: string;
  type?: "text" | "email" | "tel" | "url";
  value: string;
  onChange?: (value: string) => void;
  labelKey?: string;
  label?: string;
  placeholder?: string;
  autocomplete?: string;
  error?: boolean;
  required?: boolean;
};
import { t } from "../utils/i18n";

function TextField(props: TextFieldProps) {
  return (
    <div
      className="rdp-textfield"
      data-error={props.error ? "true" : undefined}
    >
      <label className="rdp-textfield__label" htmlFor={`field-${props.name}`}>
        {props.labelKey ? (
          <Fragment>{t(props.labelKey)}</Fragment>
        ) : (
          <Fragment>{props.label ?? ""}</Fragment>
        )}
      </label>
      <input
        id={`field-${props.name}`}
        type={props.type ?? "text"}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        autoComplete={props.autocomplete}
        required={props.required}
        onInput={(event) => props.onChange?.(event.target.value)}
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
        .rdp-textfield input:focus { outline: none; border-color: var(--color-brand-active); }
        .rdp-textfield[data-error="true"] input { border-color: var(--input-border-error); }
      `}</style>
    </div>
  );
}

export default TextField;
