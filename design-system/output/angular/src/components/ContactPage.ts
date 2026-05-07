import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type ContactPageProps = {
  email?: string;
};

@Component({
  selector: "contact-page",
  template: `
    <article class="rdp-contact-page">
      <h1>Nous contacter</h1>
      <p>
        Il est possible de prendre contact avec nous à l'adresse suivante :

        <br />
        <a
          class="rdp-contact-page__email"
          [attr.href]="\`mailto:\${email ?? 'contact@revue-de-presse.org'}\`"
          >{{email ?? 'contact@revue-de-presse.org'}}</a
        >
      </p>
      <style>
        {{\`
                .rdp-contact-page {
                  background: var(--color-white);
                  border-radius: var(--radius-default);
                  padding: var(--separation-3);
                  font-family: 'Roboto', sans-serif;
                  color: var(--color-content-text);
                }
                .rdp-contact-page h1 {
                  font-family: 'Signika', sans-serif;
                  color: var(--color-brand);
                  margin: 0 0 var(--separation-2);
                }
                .rdp-contact-page p { margin: 0 0 var(--separation-1); }
                .rdp-contact-page__email { color: var(--color-brand); }
              \`}}
      </style>
    </article>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class ContactPage {
  @Input() email!: ContactPageProps["email"];
}

@NgModule({
  declarations: [ContactPage],
  imports: [CommonModule],
  exports: [ContactPage],
})
export class ContactPageModule {}
