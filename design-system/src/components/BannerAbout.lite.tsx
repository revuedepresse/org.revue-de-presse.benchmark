import { useStore } from '@builder.io/mitosis';
import { t } from '../utils/i18n';
import Icon from './Icon.lite';

type BannerAboutProps = {
  legalNoticeHref?: string;
  termsOfServiceHref?: string;
  contactHref?: string;
  supportHref?: string;
  sourcesHref?: string;
  subscribeHref?: string;
  onLegalNoticeClick?: () => void;
  onTermsOfServiceClick?: () => void;
  onContactClick?: () => void;
  onSupportClick?: () => void;
  onSourcesClick?: () => void;
};

export default function BannerAbout(props: BannerAboutProps) {
  const state = useStore({
    get year(): number {
      return new Date().getFullYear();
    },
    handleLegalClick(event: any) {
      if (props.onLegalNoticeClick) {
        event.preventDefault();
        props.onLegalNoticeClick();
      }
    },
    handleTermsClick(event: any) {
      if (props.onTermsOfServiceClick) {
        event.preventDefault();
        props.onTermsOfServiceClick();
      }
    },
    handleContactClick(event: any) {
      if (props.onContactClick) {
        event.preventDefault();
        props.onContactClick();
      }
    },
    handleSupportClick(event: any) {
      if (props.onSupportClick) {
        event.preventDefault();
        props.onSupportClick();
      }
    },
    handleSourcesClick(event: any) {
      if (props.onSourcesClick) {
        event.preventDefault();
        props.onSourcesClick();
      }
    },
  });

  return (
    <footer id="project" class="rdp-banner-about">
      <h2 class="rdp-banner-about__title rdp-banner-about__title--sharing">
        <Icon name="sharing" size={24} decorative={true} />
        <span>{t('footer.social.heading')}</span>
      </h2>
      <p class="rdp-banner-about__paragraph rdp-banner-about__paragraph--sharing">
        {t('footer.sharing.body')}
        <br />
        <br />
        <a
          class="rdp-banner-about__subscribe-to"
          href={props.subscribeHref ?? 'https://bsky.app/profile/revue-de-presse.org'}
          rel="noreferrer nofollow noopener"
          target="_blank"
        >
          <span class="rdp-banner-about__subscription-label">{t('footer.subscribe-to.label')}</span>
        </a>
        <a
          class="rdp-banner-about__play-store"
          href="https://play.google.com/store/apps/details?id=org.revue_2_presse"
          rel="noreferrer nofollow noopener"
          target="_blank"
        >
          <img
            class="rdp-banner-about__play-store-badge"
            alt="Disponible sur Google Play"
            width="193"
            height="75"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoYAAAD6CAYAAAA89YbqAAAACXBIWXMAAAsSAAALEgHS3X78AAAgAElEQVR4nO3de1hUdeI/8Ldd1kU0K42ZwNQgY60QMEVR84KwooHiDRUVFYt01X5+dallWcwkloxk3ZS1NG+kCKiJQokrXjJTRHNEawkNCw0aXG0zudSW+fsDx4WZgfnMzDkzZ4b363l6njycOeczlzPnPZ9rm1u3boGIiIiI6C57F4CIiIiIlIHBkIiIiIgAMBgSERER0W0MhkREREQEgMGQiIiIiG5jMCQiIiIiAAyGRERERHQbgyERERERAWAwJCIiIqLbGAyJiIiICACDIRERERHdxmBIRERERAAYDImIiIjoNgZDIiIiIgLAYEhEREREtzEYEhEREREABkMiIiIiuo3BkIiIiIgAMBgSERER0W0MhkREREQEgMGQiIiIiG5jMCQiIiIiAAyGRERERHQbgyERERERAWAwJCIiIqLbGAyJiIiICACDIRERERHdxmBIRERERACAe6Q60KRJkcN/c8+9Pnffc7d727ZtH5XquERERERk6Keffvrq5i83q/77y8/nsrNzDkhxzDa3bt2y+MGzY2LeVatVz3bv7qlu38FVivIQERERkZlqbtTi668varXa6g/Wb9jwnKXHMTsYThg/vptKpdrs37v3YFfXdm0sPTERERERSa+2tu6W5vTpI9XV1TN27NxZYc5jzQqGs2Ni3g0cMCCGgZCIiIhI2Wpr624dP3Zsgzk1iELBcFLkxEFPPflU3mOP97i/pf3OlZxFxaVLuPbdd6iqqhItAxERERGZwd3dHZ0efBDdunaFj2+vFvf98vyF7z/7/LPw7JztR00d12QwnD516sIhw4alNVdLeK7kLI4VHcdpzRnU//STqfMRERERkYRc2rZFb38/DOgf2GxIrK2tu/XRoUOL3tu6dWVLx2oxGM6OiXk3OCR4trG/FR0vwvadO/Hva9fMKTsRERERyeShTp0wcfx49A/sb/TvhfsL17fUtNxsMGwuFGq/rcbGTRtRev68pWUmIiIiIhn1fPxxzJo5C+qHVQZ/aykcGg2GM6KjU0JHhv5Jf/vBAweQvX0Hm4yJiIiIFM6lbVtMmjgBQcOHG/ytYG/B65szMuL1txsEw6jJkycFBQdv0+9TmJ+Xj5z335e6zEREREQk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"
          />
        </a>
      </p>

      <h2 class="rdp-banner-about__title rdp-banner-about__title--introducing">
        <Icon name="introducing" size={24} decorative={true} />
        <span>{t('footer.about.heading')}</span>
      </h2>
      <p class="rdp-banner-about__paragraph">
        <a
          class="rdp-banner-about__outer-link"
          href={props.legalNoticeHref ?? '/mentions-legales'}
          onClick={(event: any) => state.handleLegalClick(event)}
          data-testid="view-button"
          data-view="legal"
        >
          {t('footer.about.privacy-policy')}
        </a>
        <br />
        <a
          class="rdp-banner-about__outer-link"
          href={props.termsOfServiceHref ?? '/conditions-utilisation'}
          onClick={(event: any) => state.handleTermsClick(event)}
          data-testid="view-button"
          data-view="terms"
        >
          {t('footer.about.terms-of-service')}
        </a>
        <br />
        <a
          class="rdp-banner-about__outer-link"
          href={props.contactHref ?? '/nous-contacter'}
          onClick={(event: any) => state.handleContactClick(event)}
          data-testid="view-button"
          data-view="contact"
        >
          {t('footer.about.contact')}
        </a>
        <br />
        <a
          class="rdp-banner-about__outer-link"
          href={props.supportHref ?? '/nous-soutenir'}
          onClick={(event: any) => state.handleSupportClick(event)}
          data-testid="view-button"
          data-view="support"
        >
          {t('footer.about.support')}
        </a>
        <br />
        <a
          class="rdp-banner-about__outer-link"
          href={props.sourcesHref ?? '/sources'}
          onClick={(event: any) => state.handleSourcesClick(event)}
          data-testid="view-button"
          data-view="sources"
        >
          {t('footer.about.sources')}
        </a>
        <br />
      </p>

      <h2 class="rdp-banner-about__title rdp-banner-about__title--funding">
        <Icon name="funding" size={24} decorative={true} />
        <span>{t('footer.pro-bono.heading')}</span>
      </h2>
      <p class="rdp-banner-about__paragraph">
        {t('footer.pro-bono.body.before-author1')}
        <a
          class="rdp-banner-about__outer-link"
          href="https://bsky.app/profile/sylvainegarderet.bsky.social"
          rel="noreferrer nofollow noopener"
          target="_blank"
        >
          @sylvainegarderet.bsky.social
        </a>
        {t('footer.pro-bono.body.between-authors')}
        <a
          class="rdp-banner-about__outer-link"
          href="https://bsky.app/profile/thierry.marianne.io"
          rel="noreferrer nofollow noopener"
          target="_blank"
        >
          @thierry.marianne.io
        </a>
        {t('footer.pro-bono.body.after-author2')}
        <br />
        <img
          class="rdp-banner-about__netlify-mark"
          width="20"
          height="20"
          alt="Netlify"
          src="data:image/png;base64,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"
        />
        <a
          class="rdp-banner-about__outer-link"
          href="https://netlify.com"
          rel="noreferrer nofollow noopener"
          target="_blank"
        >
          Netlify
        </a>
        {t('footer.pro-bono.body.netlify-suffix')}
        <a
          class="rdp-banner-about__outer-link"
          href="https://www.netlify.com/legal/open-source-policy/"
          rel="noreferrer nofollow noopener"
          target="_blank"
        >
          {t('footer.pro-bono.body.netlify-program')}
        </a>
        {t('footer.pro-bono.body.tail')}
      </p>

      <div class="rdp-banner-about__copyright-footer">
        <div class="rdp-banner-about__copyright">
          {t('footer.copyright.prefix', { year: state.year })}
          <a
            class="rdp-banner-about__outer-link"
            href="https://twitter.com/CcelestinC"
            rel="noreferrer nofollow noopener"
            target="_blank"
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
          font-family: Roboto, sans-serif;
          font-size: var(--font-size-footer-paragraph);
          line-height: var(--line-height-base);
          overflow: hidden;
        }
        .rdp-banner-about__title {
          color: var(--color-white);
          display: flex;
          align-items: center;
          gap: var(--separation-1);
          font-family: Signika, sans-serif;
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
          background: transparent;
          border-radius: 4px;
          padding: 5px var(--separation-0) 4px 0;
          margin: var(--separation-0) 0 0 0;
          font-size: var(--font-size-footer-outer-link);
          line-height: var(--line-height-base);
          letter-spacing: 0;
          text-decoration: none;
          color: var(--color-white);
          font-weight: bold;
        }
        .rdp-banner-about__subscription-label { padding-left: 0; }
        .rdp-banner-about__play-store {
          display: inline-block;
          margin-top: var(--separation-1);
          line-height: 0;
        }
        .rdp-banner-about__play-store-badge {
          display: block;
          height: auto;
          max-width: 193px;
        }
        .rdp-banner-about__netlify-mark {
          display: inline-block;
          vertical-align: middle;
          width: 20px;
          height: 20px;
        }
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
}
