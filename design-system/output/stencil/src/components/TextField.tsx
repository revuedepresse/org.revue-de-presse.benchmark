import { t } from "../utils/i18n";

import {
  Component,
  h,
  Fragment,
  Event,
  EventEmitter,
  Prop,
} from "@stencil/core";

@Component({
  tag: "text-field",
})
export class TextField {
  @Prop() error: any;
  @Prop() name: any;
  @Prop() labelKey: any;
  @Prop() label: any;
  @Prop() type: any;
  @Prop() value: any;
  @Prop() placeholder: any;
  @Prop() autocomplete: any;
  @Prop() required: any;
  @Event() change: any;

  componentDidLoad() {}

  render() {
    return (
      <div class="rdp-textfield" data-error={this.error ? "true" : undefined}>
        <label class="rdp-textfield__label" for={`field-${this.name}`}>
          {this.labelKey ? t(this.labelKey) : this.label ?? ""}
        </label>
        <input
          id={`field-${this.name}`}
          type={this.type ?? "text"}
          name={this.name}
          value={this.value}
          placeholder={this.placeholder}
          autocomplete={this.autocomplete}
          required={this.required}
          onInput={(event) => this.change?.(event.target.value)}
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
}
