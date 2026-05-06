import { t } from "../utils/i18n";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type EmailFieldProps = {
  name: string;
  value: string;
  onChange?: (value: string) => void;
  labelKey?: string;
  error?: boolean;
  required?: boolean;
};

@customElement("email-field")
export default class EmailField extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() error: any;
  @property() name: any;
  @property() labelKey: any;
  @property() value: any;
  @property() required: any;
  @property() onChange: any;

  render() {
    return html`

          <div  data-error=${
            this.error ? "true" : undefined
          } ><label  .for=${`field-${this.name}`} >${t(
      this.labelKey ?? "auth.email-label"
    )}</label>
        <input  type="email"  autocomplete="email"  .id=${`field-${this.name}`}  .name=${
      this.name
    }  .value=${this.value}  .required=${this.required}  @input=${(event) =>
      this.onChange?.(event.target.value)}  />
        <style >${`
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
            `}</style></div>
        `;
  }
}
