import { useStore } from '@builder.io/mitosis';
import { t } from '../utils/i18n';

export type NewsletterEdition = 'fr' | 'coop-medias';

type NewsletterPageProps = {
  // Endpoint of the API's public sign-up route. The form is a plain HTML
  // POST (no fetch) so it works without JavaScript and the API sees the
  // visitor's own IP for rate limiting; the API renders the follow-up page.
  action?: string;
  // Two daily editions share this page and the same sign-up endpoint; the
  // API tells them apart by the hidden `edition` field.
  //  - 'fr' (default): top 10 posts by French media (/lettre-quotidienne)
  //  - 'coop-medias': top 10 posts by Coop Médias members
  //    (/lettre-quotidienne-coop-medias)
  edition?: NewsletterEdition;
  privacyPolicyHref?: string;
  // Link to the other edition's sign-up page, so readers can take both.
  otherEditionHref?: string;
  onOtherEditionClick?: () => void;
};

export default function NewsletterPage(props: NewsletterPageProps) {
  const state = useStore({
    get edition(): NewsletterEdition {
      return props.edition === 'coop-medias' ? 'coop-medias' : 'fr';
    },
    // Getters read props directly rather than each other: Mitosis' Vue
    // emit does not unwrap one computed inside another.
    get otherEdition(): NewsletterEdition {
      return props.edition === 'coop-medias' ? 'fr' : 'coop-medias';
    },
    get otherEditionHref(): string {
      if (props.otherEditionHref) return props.otherEditionHref;
      return props.edition === 'coop-medias'
        ? '/lettre-quotidienne'
        : '/lettre-quotidienne-coop-medias';
    },
    handleOtherEditionClick(event: any) {
      if (props.onOtherEditionClick) {
        event.preventDefault();
        props.onOtherEditionClick();
      }
    },
  });

  return (
    <article class="rdp-newsletter-page" data-edition={state.edition}>
      <h1>{t('newsletter.' + state.edition + '.heading')}</h1>
      <p>{t('newsletter.' + state.edition + '.intro')}</p>

      <form
        class="rdp-newsletter-page__form"
        method="post"
        action={props.action ?? 'https://api.revue-de-presse.org/newsletter/subscribe'}
      >
        <input type="hidden" name="edition" value={state.edition} />
        <label class="rdp-newsletter-page__label" for="newsletter-email">
          {t('newsletter.form.email.label')}
        </label>
        <div class="rdp-newsletter-page__row">
          <input
            id="newsletter-email"
            class="rdp-newsletter-page__input"
            type="email"
            name="email"
            autocomplete="email"
            placeholder={t('newsletter.form.email.placeholder')}
            required
          />
          <button class="rdp-newsletter-page__submit" type="submit">
            {t('newsletter.form.submit')}
          </button>
        </div>
        <div class="rdp-newsletter-page__trap" aria-hidden="true">
          <label for="newsletter-website">{t('newsletter.form.trap.label')}</label>
          <input id="newsletter-website" type="text" name="website" tabindex="-1" autocomplete="off" />
        </div>
      </form>

      <h2>{t('newsletter.how.heading')}</h2>
      <ul>
        <li>{t('newsletter.how.confirm')}</li>
        <li>{t('newsletter.how.delivery')}</li>
        <li>{t('newsletter.how.unsubscribe')}</li>
      </ul>

      <p class="rdp-newsletter-page__other-edition">
        <span class="rdp-newsletter-page__other-edition-pitch">
          {t('newsletter.' + state.edition + '.other-edition.pitch')}
        </span>
        <a
          class="rdp-newsletter-page__other-edition-link"
          href={state.otherEditionHref}
          onClick={(event: any) => state.handleOtherEditionClick(event)}
          data-edition={state.otherEdition}
        >
          {t('newsletter.' + state.edition + '.other-edition.label')}
        </a>
      </p>

      <p class="rdp-newsletter-page__fine-print">
        {t('newsletter.fine-print')}&nbsp;<a href={props.privacyPolicyHref ?? '/mentions-legales'}>{t('newsletter.fine-print.privacy-policy')}</a>.
      </p>

      <style>{`
        .rdp-newsletter-page {
          background: var(--color-white);
          border-radius: var(--radius-default);
          padding: var(--separation-3);
          font-family: Roboto, sans-serif;
          color: var(--color-content-text);
        }
        .rdp-newsletter-page h1 {
          font-family: Signika, sans-serif;
          color: var(--color-brand);
          margin: 0 0 var(--separation-2);
        }
        .rdp-newsletter-page h2 {
          font-family: Signika, sans-serif;
          color: var(--color-brand);
          font-size: var(--font-size-status-text);
          margin: var(--separation-3) 0 var(--separation-1);
        }
        .rdp-newsletter-page p { margin: 0 0 var(--separation-1); }
        .rdp-newsletter-page a { color: var(--color-brand); }
        .rdp-newsletter-page ul { padding-left: var(--separation-3); margin: var(--separation-1) 0; }
        .rdp-newsletter-page li { margin: 0 0 var(--separation-1); }
        .rdp-newsletter-page__form {
          margin: var(--separation-2) 0 0;
          display: flex;
          flex-direction: column;
          gap: var(--separation-0);
        }
        .rdp-newsletter-page__label {
          font-size: var(--font-size-publication-date);
          font-weight: bold;
        }
        .rdp-newsletter-page__row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--separation-1);
        }
        .rdp-newsletter-page__input {
          flex: 1 1 220px;
          min-width: 0;
          padding: var(--separation-1) var(--separation-2);
          border: 1px solid var(--color-light-grey);
          border-radius: var(--radius-default);
          font-size: var(--font-size-content);
          color: var(--color-content-text);
          background: var(--color-white);
        }
        .rdp-newsletter-page__input:focus {
          outline: 2px solid var(--color-brand-active);
          outline-offset: 1px;
        }
        .rdp-newsletter-page__submit {
          flex: 0 0 auto;
          background: var(--color-brand);
          color: var(--color-white);
          border: 0;
          border-radius: var(--radius-default);
          padding: var(--separation-1) var(--separation-3);
          font-family: Signika, sans-serif;
          font-size: var(--font-size-content);
          font-weight: bold;
          cursor: pointer;
        }
        .rdp-newsletter-page__submit:hover,
        .rdp-newsletter-page__submit:focus-visible { background: var(--color-content-background); }
        .rdp-newsletter-page__trap {
          position: absolute;
          left: -10000px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
        .rdp-newsletter-page__other-edition {
          margin: var(--separation-3) 0 0;
          padding: var(--separation-2);
          border-left: 3px solid var(--color-brand);
          background: var(--color-taupe-grey);
          border-radius: var(--radius-default);
        }
        .rdp-newsletter-page__other-edition-pitch { display: block; }
        .rdp-newsletter-page__other-edition-link { font-weight: bold; }
        .rdp-newsletter-page__fine-print {
          font-size: var(--font-size-publication-date);
          color: var(--color-light-grey);
          margin-top: var(--separation-2);
        }
      `}</style>
    </article>
  );
}
