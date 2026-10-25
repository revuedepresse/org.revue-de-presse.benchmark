import { onUpdate, Show, useStore } from '@builder.io/mitosis';
import { t } from '../utils/i18n';

export type NewsletterEdition = 'fr' | 'coop-medias' | 'fr-coop-medias' | 'both';

type NewsletterPageProps = {
  // Endpoint of the API's public sign-up route. The form is a plain HTML
  // POST (no fetch) so it works without JavaScript and the API sees the
  // visitor's own IP for rate limiting; the API renders the follow-up page.
  action?: string;
  // Letter checked when the page opens; the reader picks another one with
  // the radio buttons, posted as the `edition` field:
  //  - 'fr': top 10 posts by French media
  //  - 'coop-medias': top 10 posts by Coop Médias members
  //    (preselected on /lettre-quotidienne-coop-medias)
  //  - 'fr-coop-medias': one letter, the top 10 of both lists together
  //  - 'both' (default, /lettre-quotidienne): both letters, two a day,
  //    confirmed with a single email
  edition?: NewsletterEdition;
  privacyPolicyHref?: string;
  // The French media letter alone: no choice of letters, and no other list
  // named, for visitors who are not previewing the other lists.
  frenchMediaOnly?: boolean;
};

const EDITIONS: NewsletterEdition[] = ['fr', 'coop-medias', 'fr-coop-medias', 'both'];

export default function NewsletterPage(props: NewsletterPageProps) {
  const state = useStore({
    choice: (props.edition && EDITIONS.includes(props.edition) ? props.edition : 'both') as NewsletterEdition,
    editions: EDITIONS,
    choose(edition: NewsletterEdition) {
      state.choice = edition;
    },
  });

  onUpdate(() => {
    if (props.edition && EDITIONS.includes(props.edition)) {
      state.choice = props.edition;
    }
  }, [props.edition]);

  return (
    <article class="rdp-newsletter-page" data-edition={props.frenchMediaOnly ? 'fr' : state.choice}>
      <h1>{t(props.frenchMediaOnly ? 'newsletter.fr-only.heading' : 'newsletter.heading')}</h1>
      <p>{t(props.frenchMediaOnly ? 'newsletter.fr-only.intro' : 'newsletter.intro')}</p>

      <form
        class="rdp-newsletter-page__form"
        method="post"
        action={props.action ?? 'https://api.revue-de-presse.org/newsletter/subscribe'}
      >
        <Show when={props.frenchMediaOnly}>
          <input type="hidden" name="edition" value="fr" />
        </Show>
        <Show when={!props.frenchMediaOnly}>
          <fieldset class="rdp-newsletter-page__choice">
            <legend class="rdp-newsletter-page__label">{t('newsletter.choice.legend')}</legend>
            <For each={state.editions}>
              {(edition: NewsletterEdition) => (
                <label class="rdp-newsletter-page__option" key={edition}>
                  <input
                    class="rdp-newsletter-page__radio"
                    type="radio"
                    name="edition"
                    value={edition}
                    checked={state.choice === edition}
                    onChange={() => state.choose(edition)}
                  />
                  <span class="rdp-newsletter-page__option-text">
                    <span class="rdp-newsletter-page__option-label">{t('newsletter.choice.' + edition)}</span>
                    <span class="rdp-newsletter-page__option-hint">{t('newsletter.choice.' + edition + '.hint')}</span>
                  </span>
                </label>
              )}
            </For>
          </fieldset>
          {/* Every choice's details share one grid cell, so the block keeps the
              height of the longest and choosing never shifts the layout. */}
          <div class="rdp-newsletter-page__details" aria-live="polite">
            <For each={state.editions}>
              {(edition: NewsletterEdition) => (
                <p
                  class="rdp-newsletter-page__detail"
                  key={edition}
                  data-edition={edition}
                  aria-hidden={state.choice === edition ? 'false' : 'true'}
                >
                  {t('newsletter.' + edition + '.details')}
                </p>
              )}
            </For>
          </div>
        </Show>
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
        <li>{t(props.frenchMediaOnly ? 'newsletter.fr-only.how.confirm' : 'newsletter.how.confirm')}</li>
        <li>{t(props.frenchMediaOnly ? 'newsletter.fr-only.how.delivery' : 'newsletter.how.delivery')}</li>
        <li>{t(props.frenchMediaOnly ? 'newsletter.fr-only.how.unsubscribe' : 'newsletter.how.unsubscribe')}</li>
      </ul>

      <p class="rdp-newsletter-page__fine-print">
        {t(props.frenchMediaOnly ? 'newsletter.fr-only.fine-print' : 'newsletter.fine-print')}&nbsp;<a href={props.privacyPolicyHref ?? '/mentions-legales'}>{t('newsletter.fine-print.privacy-policy')}</a>.
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
        .rdp-newsletter-page__choice {
          border: 0;
          margin: 0 0 var(--separation-2);
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--separation-1);
        }
        .rdp-newsletter-page__choice legend { padding: 0; margin: 0 0 var(--separation-1); }
        .rdp-newsletter-page__option {
          display: flex;
          align-items: flex-start;
          gap: var(--separation-1);
          padding: var(--separation-1) var(--separation-2);
          border: 1px solid var(--color-light-grey);
          border-radius: var(--radius-default);
          cursor: pointer;
        }
        .rdp-newsletter-page__option:has(input:checked) {
          border-color: var(--color-brand);
          background: var(--color-taupe-grey);
        }
        .rdp-newsletter-page__radio {
          margin: 3px 0 0;
          accent-color: var(--color-brand);
        }
        .rdp-newsletter-page__option-text { display: flex; flex-direction: column; }
        .rdp-newsletter-page__option-label { font-weight: bold; }
        .rdp-newsletter-page__option-hint {
          font-size: var(--font-size-publication-date);
          color: var(--color-light-grey);
        }
        .rdp-newsletter-page__details {
          display: grid;
          margin: 0 0 var(--separation-2);
        }
        .rdp-newsletter-page__detail {
          grid-area: 1 / 1;
          margin: 0;
          visibility: hidden;
        }
        .rdp-newsletter-page[data-edition='fr'] .rdp-newsletter-page__detail[data-edition='fr'],
        .rdp-newsletter-page[data-edition='coop-medias'] .rdp-newsletter-page__detail[data-edition='coop-medias'],
        .rdp-newsletter-page[data-edition='fr-coop-medias'] .rdp-newsletter-page__detail[data-edition='fr-coop-medias'],
        .rdp-newsletter-page[data-edition='both'] .rdp-newsletter-page__detail[data-edition='both'] {
          visibility: visible;
        }
        .rdp-newsletter-page__fine-print {
          font-size: var(--font-size-publication-date);
          color: var(--color-light-grey);
          margin-top: var(--separation-2);
        }
      `}</style>
    </article>
  );
}
