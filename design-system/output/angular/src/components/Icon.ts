import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type IconProps = {
  name: IconName;
  size?: 24 | 32;
  ariaLabel?: string;
  decorative?: boolean;
};

import type { IconName } from "../types";

@Component({
  selector: "icon",
  template: `
    <svg
      class="rdp-icon"
      viewBox="0 0 24 24"
      [attr.width]="size ?? 24"
      [attr.height]="size ?? 24"
      [attr.aria-hidden]="decorative ?? !ariaLabel ? 'true' : undefined"
      [attr.aria-label]="decorative ?? !ariaLabel ? undefined : ariaLabel"
      [attr.role]="decorative ?? !ariaLabel ? undefined : 'img'"
    >
      <use [attr.href]="\`#\${name}\`"></use>
      <style>
        {{\`
                .rdp-icon { display: inline-block; vertical-align: middle; color: currentColor; }
              \`}}
      </style>
    </svg>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class Icon {
  @Input() size!: IconProps["size"];
  @Input() decorative!: IconProps["decorative"];
  @Input() ariaLabel!: IconProps["ariaLabel"];
  @Input() name!: IconProps["name"];
}

@NgModule({
  declarations: [Icon],
  imports: [CommonModule],
  exports: [Icon],
})
export class IconModule {}
