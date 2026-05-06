import { t } from "../utils/i18n";

import { Component, h, Fragment, Prop } from "@stencil/core";

@Component({
  tag: "link",
})
export class Link {
  @Prop() variant: any;
  @Prop() href: any;
  @Prop() external: any;
  @Prop() labelKey: any;
  @Prop() label: any;

  componentDidLoad() {}

  render() {
    return (
      <a
        class={`rdp-link rdp-link--${this.variant ?? "underline"}`}
        href={this.href}
        target={this.external ? "_blank" : undefined}
        rel={this.external ? "noopener noreferrer" : undefined}
      >
        {this.labelKey ? t(this.labelKey) : this.label ?? ""}
        <style>{`
        .rdp-link {
          color: var(--color-brand-active);
          text-decoration: none;
          font-family: 'Roboto', sans-serif;
        }
        .rdp-link--underline { text-decoration: underline; }
        .rdp-link--plain { color: inherit; }
        .rdp-link:hover { color: var(--color-brand); }
      `}</style>
      </a>
    );
  }
}
