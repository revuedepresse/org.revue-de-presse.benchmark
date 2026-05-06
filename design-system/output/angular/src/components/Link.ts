import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type LinkProps = {
  href: string;
  labelKey?: string;
  label?: string;
  external?: boolean;
  variant?: "underline" | "inline" | "plain";
};

import { t } from "../utils/i18n";

@Component({
  selector: "link",
  template: `
    <a
      [class]="\`rdp-link rdp-link--\${variant ?? 'underline'}\`"
      [attr.href]="href"
      [attr.target]="external ? '_blank' : undefined"
      [attr.rel]="external ? 'noopener noreferrer' : undefined"
      ><ng-container *ngIf="labelKey">{{t(labelKey)}}</ng-container
      ><ng-container *ngIf="!(labelKey)">{{label ?? ''}}</ng-container>
      <style>
        {{\`
                .rdp-link {
                  color: var(--color-brand-active);
                  text-decoration: none;
                  font-family: 'Roboto', sans-serif;
                }
                .rdp-link--underline { text-decoration: underline; }
                .rdp-link--plain { color: inherit; }
                .rdp-link:hover { color: var(--color-brand); }
              \`}}
      </style></a
    >
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class Link {
  t = t;

  @Input() variant!: LinkProps["variant"];
  @Input() href!: LinkProps["href"];
  @Input() external!: LinkProps["external"];
  @Input() labelKey!: LinkProps["labelKey"];
  @Input() label!: LinkProps["label"];
}

@NgModule({
  declarations: [Link],
  imports: [CommonModule],
  exports: [Link],
})
export class LinkModule {}
