import { t } from "../utils/i18n";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type CheckboxProps = {
  name: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  labelKey?: string;
  label?: string;
  labelChildren?: any;
  disabled?: boolean;
};

@customElement("my-checkbox")
export default class Checkbox extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() name: any;
  @property() checked: any;
  @property() disabled: any;
  @property() onChange: any;
  @property() labelKey: any;
  @property() label: any;
  @property() labelChildren: any;

  render() {
    return html`

          <label
          ><input type="checkbox" .name=${this.name} .checked=${
      this.checked ?? false
    }
          .disabled=${this.disabled} @change=${(event) =>
      this.onChange?.(event.target.checked)} />
          <span
            >${
              this.labelKey
                ? html`${t(this.labelKey)}`
                : html`${this.label ?? ""}`
            }
            ${this.labelChildren}</span
          >
          <style>
            ${`
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
                `}
          </style></label
        >

        `;
  }
}
