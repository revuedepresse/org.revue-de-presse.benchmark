import type { IconName } from "../types";

import { Component, h, Fragment, Prop } from "@stencil/core";

@Component({
  tag: "icon",
})
export class Icon {
  @Prop() size: any;
  @Prop() decorative: any;
  @Prop() ariaLabel: any;
  @Prop() name: any;

  componentDidLoad() {}

  render() {
    return (
      <svg
        class="rdp-icon"
        viewBox="0 0 24 24"
        width={this.size ?? 24}
        height={this.size ?? 24}
        aria-hidden={this.decorative ?? !this.ariaLabel ? "true" : undefined}
        aria-label={
          this.decorative ?? !this.ariaLabel ? undefined : this.ariaLabel
        }
        role={this.decorative ?? !this.ariaLabel ? undefined : "img"}
      >
        <use href={`#${this.name}`}></use>
        <style>{`
        .rdp-icon { display: inline-block; vertical-align: middle; color: currentColor; }
      `}</style>
      </svg>
    );
  }
}
