type NewsletterPageProps = {
  // Endpoint of the API's public sign-up route. The form is a plain HTML
  // POST (no fetch) so it works without JavaScript and the API sees the
  // visitor's own IP for rate limiting; the API renders the follow-up page.
  action?: string;
  privacyPolicyHref?: string;
};

export default function NewsletterPage(props: NewsletterPageProps) {
  return (
    <article class="rdp-newsletter-page">
      <h1>La revue de presse dans votre boîte mail</h1>
      <p>
        Chaque matin, recevez par e-mail les 10 publications de la presse française
        les plus relayées sur Bluesky la veille. Une seule lettre par jour, sans
        publicité, à lire en deux minutes.
      </p>

      <form
        class="rdp-newsletter-page__form"
        method="post"
        action={props.action ?? 'https://api.revue-de-presse.org/newsletter/subscribe'}
      >
        <label class="rdp-newsletter-page__label" for="newsletter-email">
          Votre adresse e-mail
        </label>
        <div class="rdp-newsletter-page__row">
          <input
            id="newsletter-email"
            class="rdp-newsletter-page__input"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="vous@example.org"
            required
          />
          <button class="rdp-newsletter-page__submit" type="submit">
            Je m'abonne
          </button>
        </div>
        <div class="rdp-newsletter-page__trap" aria-hidden="true">
          <label for="newsletter-website">Ne pas remplir ce champ</label>
          <input id="newsletter-website" type="text" name="website" tabindex="-1" autocomplete="off" />
        </div>
      </form>

      <h2>Comment ça marche&nbsp;?</h2>
      <ul>
        <li>
          Vous recevez aussitôt un e-mail «&nbsp;Confirmez votre adresse e-mail&nbsp;»&nbsp;:
          cliquez sur «&nbsp;Confirmer mon adresse e-mail&nbsp;». Tant que ce n'est pas fait,
          aucune lettre ne vous est envoyée.
        </li>
        <li>Une fois votre adresse confirmée, la lettre arrive chaque matin avec le top 10 de la veille.</li>
        <li>Un lien en bas de chaque lettre permet de se désabonner en un clic.</li>
      </ul>
      <p class="rdp-newsletter-page__fine-print">
        Votre adresse sert uniquement à l'envoi de cette lettre&nbsp;; elle n'est ni
        partagée ni revendue. Voir la&nbsp;<a href={props.privacyPolicyHref ?? '/mentions-legales'}>politique de confidentialité</a>.
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
        .rdp-newsletter-page__fine-print {
          font-size: var(--font-size-publication-date);
          color: var(--color-light-grey);
          margin-top: var(--separation-2);
        }
      `}</style>
    </article>
  );
}
