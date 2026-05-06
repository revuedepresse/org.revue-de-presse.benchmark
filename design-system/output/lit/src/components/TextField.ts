import { t } from "../utils/i18n";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

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

@customElement("text-field")
export default class TextField extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() error: any;
  @property() name: any;
  @property() labelKey: any;
  @property() label: any;
  @property() type: any;
  @property() value: any;
  @property() placeholder: any;
  @property() autocomplete: any;
  @property() required: any;
  @property() onChange: any;

  render() {
    return html`

          <div  data-error=${
            this.error ? "true" : undefined
          } ><label  .for=${`field-${this.name}`} >${
      this.labelKey ? html`${t(this.labelKey)}` : html`${this.label ?? ""}`
    }</label>
        <input  .id=${`field-${this.name}`}  .type=${
      this.type ?? "text"
    }  .name=${this.name}  .value=${this.value}  .placeholder=${
      this.placeholder
    }  .autocomplete=${this.autocomplete}  .required=${
      this.required
    }  @input=${(event) => this.onChange?.(event.target.value)}  />
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
              .rdp-textfield input:focus { outline: none; border-color: var(--color-brand-active); }
              .rdp-textfield[data-error="true"] input { border-color: var(--input-border-error); }
            `}</style></div>
        `;
  }
}
