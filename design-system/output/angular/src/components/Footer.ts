import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component } from "@angular/core";

import { t } from "../utils/i18n";

@Component({
  selector: "footer",
  template: `
    <footer class="rdp-footer">
      <section class="rdp-footer__section">
        <h3>{{t('footer.about.heading')}}</h3>
        <p>{{t('footer.about.body')}}</p>
      </section>
      <section class="rdp-footer__section">
        <h3>{{t('footer.social.heading')}}</h3>
        <p>{{t('footer.social.body')}}</p>
      </section>
      <section class="rdp-footer__section">
        <h3>{{t('footer.pro-bono.heading')}}</h3>
        <p>{{t('footer.pro-bono.body')}}</p>
      </section>
      <p class="rdp-footer__copyright">
        {{t('footer.copyright', { year: year })}}
      </p>
      <style>
        {{\`
                .rdp-footer {
                  background: var(--banner-about-bg);
                  color: var(--banner-about-fg);
                  padding: var(--separation-2);
                  font-family: 'Roboto', sans-serif;
                  font-size: var(--font-size-footer-paragraph);
                  display: grid;
                  gap: var(--separation-2);
                }
                .rdp-footer__section h3 {
                  font-family: 'Signika', sans-serif;
                  font-size: var(--font-size-footer-title);
                  color: var(--color-brand-active);
                  margin: 0 0 var(--separation-1);
                }
                .rdp-footer__section p { margin: 0; }
                .rdp-footer__copyright {
                  font-size: var(--font-size-footer-copyright);
                  text-align: center;
                  margin: 0;
                  color: var(--color-content-font);
                }
              \`}}
      </style>
    </footer>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class Footer {
  t = t;

  get year() {
    return new Date().getFullYear();
  }
}

@NgModule({
  declarations: [Footer],
  imports: [CommonModule],
  exports: [Footer],
})
export class FooterModule {}
