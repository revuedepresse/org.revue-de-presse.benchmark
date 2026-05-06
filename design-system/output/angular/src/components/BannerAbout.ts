import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type BannerAboutProps = {
  bodyKey?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
};

import { t } from "../utils/i18n";

@Component({
  selector: "banner-about",
  template: `
    <ng-container *ngIf="!dismissed"
      ><aside class="rdp-banner-about" role="region">
        <header class="rdp-banner-about__heading">
          <icon name="introducing" [size]="24"></icon>
          <span>{{t('footer.about.heading')}}</span>
        </header>
        <p class="rdp-banner-about__body">
          {{t(bodyKey ?? 'footer.about.body')}}
        </p>
        <ng-container *ngIf="!!dismissible"
          ><button
            type="button"
            class="rdp-banner-about__close"
            [attr.aria-label]="t('actions.quit.label')"
            (click)="dismiss()"
          >
            ×
          </button></ng-container
        >
        <style>
          {{\`
                    .rdp-banner-about {
                      background: var(--banner-about-bg);
                      color: var(--banner-about-fg);
                      padding: var(--separation-2);
                      border-radius: var(--radius-default);
                      font-family: 'Roboto', sans-serif;
                      font-size: var(--font-size-content);
                      position: relative;
                    }
                    .rdp-banner-about__heading {
                      display: flex;
                      align-items: center;
                      gap: var(--separation-1);
                      font-family: 'Signika', sans-serif;
                      font-size: var(--font-size-status-text);
                      color: var(--color-brand-active);
                      margin-bottom: var(--separation-1);
                    }
                    .rdp-banner-about__body { margin: 0; }
                    .rdp-banner-about__close {
                      position: absolute;
                      top: var(--separation-1);
                      right: var(--separation-1);
                      background: transparent;
                      border: none;
                      color: var(--color-content-font);
                      font-size: 24px;
                      cursor: pointer;
                    }
                  \`}}
        </style>
      </aside></ng-container
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
export default class BannerAbout {
  t = t;

  @Input() onDismiss!: BannerAboutProps["onDismiss"];
  @Input() bodyKey!: BannerAboutProps["bodyKey"];
  @Input() dismissible!: BannerAboutProps["dismissible"];

  dismissed = false;
  dismiss() {
    this.dismissed = true;
    this.onDismiss?.();
  }
}

@NgModule({
  declarations: [BannerAbout],
  imports: [CommonModule, IconModule],
  exports: [BannerAbout],
})
export class BannerAboutModule {}
