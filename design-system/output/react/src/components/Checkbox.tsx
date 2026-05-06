"use client";
import * as React from "react";

type CheckboxProps = {
  name: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  labelKey?: string;
  label?: string;
  labelChildren?: any;
  disabled?: boolean;
};
import { t } from "../utils/i18n";

function Checkbox(props: CheckboxProps) {
  return (
    <label className="rdp-checkbox">
      <input
        type="checkbox"
        name={props.name}
        checked={props.checked ?? false}
        disabled={props.disabled}
        onChange={(event) => props.onChange?.(event.target.checked)}
      />
      <span className="rdp-checkbox__label">
        {props.labelKey ? <>{t(props.labelKey)}</> : <>{props.label ?? ""}</>}
        {props.labelChildren}
      </span>
      <style>{`
        .rdp-checkbox {
          display: inline-flex;
          align-items: center;
          gap: var(--separation-1);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
          color: var(--color-content-text);
          cursor: pointer;
        }
        .rdp-checkbox__label { display: inline-flex; gap: 4px; align-items: baseline; }
        .rdp-checkbox input { accent-color: var(--color-brand-active); }
        .rdp-checkbox input:disabled + .rdp-checkbox__label { opacity: 0.5; }
      `}</style>
    </label>
  );
}

export default Checkbox;
