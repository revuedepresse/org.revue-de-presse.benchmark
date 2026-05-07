import { t } from "../utils/i18n";

import Icon from "./Icon.jsx";

import { $, Fragment, component$, h, useComputed$ } from "@builder.io/qwik";

type BannerAboutProps = {
  legalNoticeHref?: string;
  contactHref?: string;
  supportHref?: string;
  sourcesHref?: string;
  subscribeHref?: string;
  onLegalNoticeClick?: () => void;
  onContactClick?: () => void;
  onSupportClick?: () => void;
  onSourcesClick?: () => void;
};
export const handleLegalClick = function handleLegalClick(
  props,
  state,
  year,
  event: any
) {
  if (props.onLegalNoticeClick) {
    event.preventDefault();
    props.onLegalNoticeClick();
  }
};
export const handleContactClick = function handleContactClick(
  props,
  state,
  year,
  event: any
) {
  if (props.onContactClick) {
    event.preventDefault();
    props.onContactClick();
  }
};
export const handleSupportClick = function handleSupportClick(
  props,
  state,
  year,
  event: any
) {
  if (props.onSupportClick) {
    event.preventDefault();
    props.onSupportClick();
  }
};
export const handleSourcesClick = function handleSourcesClick(
  props,
  state,
  year,
  event: any
) {
  if (props.onSourcesClick) {
    event.preventDefault();
    props.onSourcesClick();
  }
};
export const BannerAbout = component$((props: BannerAboutProps) => {
  const year = useComputed$(() => {
    return new Date().getFullYear();
  });
  const state: any = {};

  return (
    <footer id="project" class="rdp-banner-about">
      <h2 class="rdp-banner-about__title rdp-banner-about__title--sharing">
        <Icon name="sharing" size={24} decorative={true}></Icon>
        <span>{t("footer.social.heading")}</span>
      </h2>
      <p class="rdp-banner-about__paragraph rdp-banner-about__paragraph--sharing">
        {t("footer.sharing.body")}
        <br />
        <br />
        <a
          class="rdp-banner-about__subscribe-to"
          rel="noreferrer nofollow noopener"
          href={
            props.subscribeHref ??
            "https://bsky.app/profile/revue-de-presse.bsky.social"
          }
        >
          <span class="rdp-banner-about__subscription-label">
            {t("footer.subscribe-to.label")}
          </span>
        </a>
      </p>
      <h2 class="rdp-banner-about__title rdp-banner-about__title--introducing">
        <Icon name="introducing" size={24} decorative={true}></Icon>
        <span>{t("footer.about.heading")}</span>
      </h2>
      <p class="rdp-banner-about__paragraph">
        <a
          class="rdp-banner-about__outer-link"
          href={props.legalNoticeHref ?? "/mentions-legales"}
          onClick$={$((event) => handleLegalClick(props, state, year, event))}
        >
          {t("footer.about.privacy-policy")}
        </a>
        <br />
        <a
          class="rdp-banner-about__outer-link"
          href={props.contactHref ?? "/nous-contacter"}
          onClick$={$((event) => handleContactClick(props, state, year, event))}
        >
          {t("footer.about.contact")}
        </a>
        <br />
        <a
          class="rdp-banner-about__outer-link"
          href={props.supportHref ?? "/nous-soutenir"}
          onClick$={$((event) => handleSupportClick(props, state, year, event))}
        >
          {t("footer.about.support")}
        </a>
        <br />
        <a
          class="rdp-banner-about__outer-link"
          href={props.sourcesHref ?? "/sources"}
          onClick$={$((event) => handleSourcesClick(props, state, year, event))}
        >
          {t("footer.about.sources")}
        </a>
        <br />
      </p>
      <h2 class="rdp-banner-about__title rdp-banner-about__title--funding">
        <Icon name="funding" size={24} decorative={true}></Icon>
        <span>{t("footer.pro-bono.heading")}</span>
      </h2>
      <p class="rdp-banner-about__paragraph">
        {t("footer.pro-bono.body.before-author1")}
        <a
          class="rdp-banner-about__outer-link"
          href="https://bsky.app/profile/sylvainegarderet.bsky.social"
          rel="noreferrer nofollow noopener"
        >
          @sylvainegarderet.bsky.social
        </a>
        {t("footer.pro-bono.body.between-authors")}
        <a
          class="rdp-banner-about__outer-link"
          href="https://bsky.app/profile/thierry.marianne.io"
          rel="noreferrer nofollow noopener"
        >
          @thierry.marianne.io
        </a>
        {t("footer.pro-bono.body.after-author2")}
        <br />
        <a class="rdp-banner-about__outer-link" href="https://netlify.com">
          Netlify
        </a>
        {t("footer.pro-bono.body.netlify-suffix")}
        <a
          class="rdp-banner-about__outer-link"
          href="https://www.netlify.com/legal/open-source-policy/"
        >
          {t("footer.pro-bono.body.netlify-program")}
        </a>
        {t("footer.pro-bono.body.tail")}
      </p>
      <div class="rdp-banner-about__copyright-footer">
        <div class="rdp-banner-about__copyright">
          {t("footer.copyright.prefix", {
            year: year.value,
          })}
          <a
            class="rdp-banner-about__outer-link"
            href="https://twitter.com/CcelestinC"
            rel="noreferrer nofollow noopener"
          >
            @CcelestinC
          </a>
        </div>
      </div>
      <style>{`
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
      `}</style>
    </footer>
  );
});

export default BannerAbout;
