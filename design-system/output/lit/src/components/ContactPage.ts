import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type ContactPageProps = {
  email?: string;
};

@customElement("contact-page")
export default class ContactPage extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() email: any;

  render() {
    return html`

          <article ><h1 >Nous contacter</h1>
        <p >
                Il est possible de prendre contact avec nous à l'adresse suivante :

        <br  />
        <a  .href=${`mailto:${this.email ?? "contact@revue-de-presse.org"}`} >${
      this.email ?? "contact@revue-de-presse.org"
    }</a></p>
        <style >${`
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
            `}</style></article>
        `;
  }
}
