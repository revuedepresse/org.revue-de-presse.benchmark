import { t } from "../utils/i18n";
import "./Icon.ts";

import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators";

type BannerAboutProps = {
  legalNoticeHref?: string;
  contactHref?: string;
  supportHref?: string;
  sourcesHref?: string;
  subscribeHref?: string;
};

@customElement("banner-about")
export default class BannerAbout extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() subscribeHref: any;
  @property() legalNoticeHref: any;
  @property() onLegalNoticeClick: any;
  @property() contactHref: any;
  @property() onContactClick: any;
  @property() supportHref: any;
  @property() onSupportClick: any;
  @property() sourcesHref: any;
  @property() onSourcesClick: any;

  get year() {
    return new Date().getFullYear();
  }

  render() {
    return html`

          <footer  id="project" ><h2 ><my-icon  name="sharing"  .size=${24}  .decorative=${true} ></my-icon>
        <span >${t("footer.social.heading")}</span></h2>
        <p >${t("footer.sharing.body")}
        <br  />
        <br  />
        <a  rel="noreferrer nofollow noopener"  .href=${
          this.subscribeHref ??
          "https://bsky.app/profile/revue-de-presse.bsky.social"
        } ><span >${t("footer.subscribe-to.label")}</span></a></p>
        <h2 ><my-icon  name="introducing"  .size=${24}  .decorative=${true} ></my-icon>
        <span >${t("footer.about.heading")}</span></h2>
        <p ><a  .href=${this.legalNoticeHref ?? "/mentions-legales"}  @click=${(
      event
    ) => {
      if (this.onLegalNoticeClick) {
        event.preventDefault();
        this.onLegalNoticeClick();
      }
    }} >${t("footer.about.privacy-policy")}</a>
        <br  />
        <a  .href=${this.contactHref ?? "/nous-contacter"}  @click=${(
      event
    ) => {
      if (this.onContactClick) {
        event.preventDefault();
        this.onContactClick();
      }
    }} >${t("footer.about.contact")}</a>
        <br  />
        <a  .href=${this.supportHref ?? "/nous-soutenir"}  @click=${(event) => {
      if (this.onSupportClick) {
        event.preventDefault();
        this.onSupportClick();
      }
    }} >${t("footer.about.support")}</a>
        <br  />
        <a  .href=${this.sourcesHref ?? "/sources"}  @click=${(event) => {
      if (this.onSourcesClick) {
        event.preventDefault();
        this.onSourcesClick();
      }
    }} >${t("footer.about.sources")}</a>
        <br  /></p>
        <h2 ><my-icon  name="funding"  .size=${24}  .decorative=${true} ></my-icon>
        <span >${t("footer.pro-bono.heading")}</span></h2>
        <p >${t("footer.pro-bono.body.before-author1")}
        <a  href="https://bsky.app/profile/sylvainegarderet.bsky.social"  rel="noreferrer nofollow noopener" >
                  @sylvainegarderet.bsky.social
                </a>
        ${t("footer.pro-bono.body.between-authors")}
        <a  href="https://bsky.app/profile/thierry.marianne.io"  rel="noreferrer nofollow noopener" >
                  @thierry.marianne.io
                </a>
        ${t("footer.pro-bono.body.after-author2")}
        <br  />
        <a  href="https://netlify.com" >
                  Netlify
                </a>
        ${t("footer.pro-bono.body.netlify-suffix")}
        <a  href="https://www.netlify.com/legal/open-source-policy/" >${t(
          "footer.pro-bono.body.netlify-program"
        )}</a>
        ${t("footer.pro-bono.body.tail")}</p>
        <div ><div >${t("footer.copyright.prefix", {
          year: this.year,
        })}
        <a  href="https://twitter.com/CcelestinC"  rel="noreferrer nofollow noopener" >
                    @CcelestinC
                  </a></div></div>
        <style >${`
              .rdp-banner-about {
                background: var(--color-content-background);
                color: var(--color-content-font);
                border: none;
                border-radius: var(--radius-default);
                padding: var(--separation-2);
                padding-bottom: var(--separation-3);
                width: 100%;
                margin: 0;
                box-sizing: border-box;
                font-family: 'Roboto', sans-serif;
                font-size: var(--font-size-footer-paragraph);
                line-height: var(--line-height-base);
                overflow: hidden;
              }
              .rdp-banner-about__title {
                color: var(--color-white);
                display: flex;
                align-items: center;
                gap: var(--separation-1);
                font-family: 'Signika', sans-serif;
                font-size: var(--font-size-footer-title);
                line-height: 30px;
                margin: calc(3 * var(--separation-1)) 0 var(--separation-1);
                white-space: nowrap;
                min-width: 0;
              }
              .rdp-banner-about__title > span {
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .rdp-banner-about__title:first-child { margin-top: 0; }
              .rdp-banner-about__paragraph { font-size: 1em; margin: 0 0 var(--separation-1); }
              .rdp-banner-about__paragraph--sharing { margin-bottom: 0; }
              .rdp-banner-about a {
                color: var(--color-white);
                text-decoration: underline;
              }
              .rdp-banner-about__subscribe-to {
                display: inline-flex;
                background: var(--color-brand-bluesky);
                border-radius: 4px;
                padding: 5px var(--separation-0) 4px;
                margin-top: var(--separation-0);
                font-size: var(--font-size-footer-outer-link);
                line-height: var(--line-height-base);
                letter-spacing: 0;
                text-decoration: none;
                color: var(--color-white);
                font-weight: bold;
              }
              .rdp-banner-about__subscription-label { padding-left: var(--separation-0); }
              .rdp-banner-about__copyright-footer {
                color: var(--color-white);
                display: flex;
                width: 100%;
                font-size: var(--font-size-footer-copyright);
                line-height: var(--line-height-base);
                text-align: center;
                margin-top: calc(3 * var(--separation-1));
              }
              .rdp-banner-about__copyright {
                margin: auto;
                margin-bottom: var(--separation-2);
              }
              .rdp-banner-about__copyright .rdp-banner-about__outer-link,
              .rdp-banner-about__copyright-footer .rdp-banner-about__outer-link {
                display: inline-flex;
                margin: auto;
                align-self: center;
                color: var(--color-white);
              }
            `}</style></footer>
        `;
  }
}
