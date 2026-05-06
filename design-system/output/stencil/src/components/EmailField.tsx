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
  tag: "email-field",
})
export class EmailField {
  @Prop() error: any;
  @Prop() name: any;
  @Prop() labelKey: any;
  @Prop() value: any;
  @Prop() required: any;
  @Event() change: any;

  componentDidLoad() {}

  render() {
    return (
      <div class="rdp-textfield" data-error={this.error ? "true" : undefined}>
        <label class="rdp-textfield__label" for={`field-${this.name}`}>
          {t(this.labelKey ?? "auth.email-label")}
        </label>
        <input
          type="email"
          autocomplete="email"
          id={`field-${this.name}`}
          name={this.name}
          value={this.value}
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
        .rdp-textfield[data-error="true"] input { border-color: var(--input-border-error); }
      `}</style>
      </div>
    );
  }
}
