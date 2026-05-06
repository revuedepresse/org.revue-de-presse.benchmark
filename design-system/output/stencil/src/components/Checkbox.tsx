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
  tag: "checkbox",
})
export class Checkbox {
  @Prop() name: any;
  @Prop() checked: any;
  @Prop() disabled: any;
  @Event() change: any;
  @Prop() labelKey: any;
  @Prop() label: any;
  @Prop() labelChildren: any;

  componentDidLoad() {}

  render() {
    return (
      <label class="rdp-checkbox">
        <input
          type="checkbox"
          name={this.name}
          checked={this.checked ?? false}
          disabled={this.disabled}
          onChange={(event) => this.change?.(event.target.checked)}
        />
        <span class="rdp-checkbox__label">
          {this.labelKey ? t(this.labelKey) : this.label ?? ""}
          {this.labelChildren}
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
}
