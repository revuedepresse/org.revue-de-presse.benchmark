import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type AppHeaderProps = {
  layout: "mobile" | "desktop";
  authenticated: boolean;
  onAccountClick?: () => void;
  onMySpaceClick?: () => void;
};

import { t } from "../utils/i18n";

@Component({
  selector: "app-header",
  template: `
    <header [class]="\`rdp-app-header rdp-app-header--\${layout}\`">
      <logo
        [showWordmark]="true"
        [size]="layout === 'mobile' ? 'sm' : 'md'"
      ></logo>
      <ng-container *ngIf="layout === 'desktop'"
        ><a
          href="#"
          class="rdp-app-header__myspace"
          [attr.aria-disabled]="!authenticated ? 'true' : undefined"
          (click)="
          if (!authenticated) {
            $event.preventDefault();
            return;
          }
          onMySpaceClick?.();
        "
          >{{t('header.my-space')}}</a
        ></ng-container
      >
      <button
        type="button"
        class="rdp-app-header__account"
        [attr.aria-label]="t('header.my-account.aria-label')"
        (click)="onAccountClick?.()"
      >
        <icon name="pick-item" [size]="32" [decorative]="true"></icon>
      </button>
      <style>
        {{\`
                .rdp-app-header {
                  display: flex;
                  align-items: center;
                  gap: var(--separation-2);
                  padding: var(--separation-1) var(--separation-2);
                  background: var(--color-white);
                  border-bottom: 1px solid var(--color-border);
                  font-family: 'Signika', sans-serif;
                }
                .rdp-app-header--desktop { padding: var(--separation-1) var(--separation-3); }
                .rdp-app-header__myspace {
                  margin-left: auto;
                  color: var(--color-brand-active);
                  text-decoration: none;
                  font-family: 'Roboto', sans-serif;
                  font-size: var(--font-size-content);
                }
                .rdp-app-header__myspace[aria-disabled=&quot;true&quot;] {
                  color: var(--color-light-grey);
                  cursor: not-allowed;
                  pointer-events: none;
                }
                .rdp-app-header__account {
                  background: transparent;
                  border: none;
                  cursor: pointer;
                  width: 40px;
                  height: 40px;
                  margin-left: auto;
                  color: var(--color-content-text);
                }
                .rdp-app-header--desktop .rdp-app-header__account { margin-left: 0; }
              \`}}
      </style>
    </header>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class AppHeader {
  t = t;

  @Input() layout!: AppHeaderProps["layout"];
  @Input() authenticated!: AppHeaderProps["authenticated"];
  @Input() onMySpaceClick!: AppHeaderProps["onMySpaceClick"];
  @Input() onAccountClick!: AppHeaderProps["onAccountClick"];
}

@NgModule({
  declarations: [AppHeader],
  imports: [CommonModule, LogoModule, IconModule],
  exports: [AppHeader],
})
export class AppHeaderModule {}
