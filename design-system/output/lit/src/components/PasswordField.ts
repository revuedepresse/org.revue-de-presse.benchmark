import { t } from "../utils/i18n";
import { MIN_LENGTH_NO_MFA } from "../utils/password";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type PasswordFieldProps = {
  name: string;
  value: string;
  onChange?: (value: string) => void;
  mode: "login" | "new";
  labelKey?: string;
  error?: boolean;
  showHelper?: boolean;
};

@customElement("password-field")
export default class PasswordField extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() error: any;
  @property() name: any;
  @property() labelKey: any;
  @property() mode: any;
  @property() value: any;
  @property() onChange: any;
  @property() showHelper: any;

  render() {
    return html`

          <div  data-error=${
            this.error ? "true" : undefined
          } ><label  .for=${`field-${this.name}`} >${t(
      this.labelKey ?? "auth.password-label"
    )}</label>
        <input  type="password"  .id=${`field-${this.name}`}  .autocomplete=${
      this.mode === "new" ? "new-password" : "current-password"
    }  .name=${this.name}  .value=${this.value}  @input=${(event) =>
      this.onChange?.(event.target.value)}  />
        ${
          this.showHelper ?? this.mode === "new"
            ? html`<p >${t("auth.password.helper-text", {
                min: MIN_LENGTH_NO_MFA,
              })}</p>`
            : null
        }
        <style >${`
              .rdp-textfield { display: flex; flex-direction: column; gap: 4px; font-family: 'Roboto', sans-serif; }
              .rdp-textfield__label {
                font-size: var(--font-size-publication-date);
                color: var(--color-content-text);
                padding-left: var(--separation-1);
              }
              .rdp-textfield__helper {
                font-size: var(--font-size-publication-date);
                color: var(--color-light-grey);
                padding-left: var(--separation-1);
                margin: 0;
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
            `}</style></div>
        `;
  }
}
