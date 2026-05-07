import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

@customElement("sources-page")
export default class SourcesPage extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`

          <article>
          <h1>Sources des brèves</h1>
          <p>
            Les sources des brèves de publications
            <a href="#rdp-sources-page-footnote"> triées par popularité </a>

            en fin de chaque journée proviennent des comptes Bluesky de médias Français.
          </p>
          <p id="rdp-sources-page-footnote">
            La popularité est déduite des partages des publications depuis Bluesky.
          </p>
          <style>
            ${`
                .rdp-sources-page {
                  background: var(--color-white);
                  border-radius: var(--radius-default);
                  padding: var(--separation-3);
                  font-family: 'Roboto', sans-serif;
                  color: var(--color-content-text);
                }
                .rdp-sources-page h1 {
                  font-family: 'Signika', sans-serif;
                  color: var(--color-brand);
                  margin: 0 0 var(--separation-2);
                }
                .rdp-sources-page p { margin: 0 0 var(--separation-1); }
                .rdp-sources-page__internal-link { color: var(--color-brand); }
                .rdp-sources-page__footnote {
                  font-size: var(--font-size-publication-date);
                  color: var(--color-light-grey);
                  border-top: 1px solid var(--color-border);
                  padding-top: var(--separation-1);
                  margin-top: var(--separation-2);
                }
              `}
          </style>
        </article>

        `;
  }
}
