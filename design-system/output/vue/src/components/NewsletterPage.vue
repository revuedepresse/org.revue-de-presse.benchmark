<template>
  <article class="rdp-newsletter-page">
    <h1>La revue de presse dans votre boîte mail</h1>
    <p>
      Chaque matin, recevez par e-mail les 10 publications de la presse
      française les plus relayées sur Bluesky la veille. Une seule lettre par
      jour, sans publicité, à lire en deux minutes.
    </p>
    <form
      class="rdp-newsletter-page__form"
      method="post"
      :action="action ?? 'https://api.revue-de-presse.org/newsletter/subscribe'"
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
          :required="true"
        /><button class="rdp-newsletter-page__submit" type="submit">
          Je m'abonne
        </button>
      </div>
      <div class="rdp-newsletter-page__trap" aria-hidden="true">
        <label for="newsletter-website">Ne pas remplir ce champ</label
        ><input
          id="newsletter-website"
          type="text"
          name="website"
          tabindex="-1"
          autocomplete="off"
        />
      </div>
    </form>
    <h2>Comment ça marche&nbsp;?</h2>
    <ul>
      <li>
        Un e-mail de confirmation vous est envoyé&nbsp;: cliquez sur son lien
        pour activer l'abonnement.
      </li>
      <li>
        La lettre arrive ensuite chaque matin avec le top 10 de la veille.
      </li>
      <li>
        Un lien en bas de chaque lettre permet de se désabonner en un clic.
      </li>
    </ul>
    <p class="rdp-newsletter-page__fine-print">
      Votre adresse sert uniquement à l'envoi de cette lettre&nbsp;; elle n'est
      ni partagée ni revendue. Voir la&nbsp;<a
        :href="privacyPolicyHref ?? '/mentions-legales'"
        >politique de confidentialité</a
      >.
    </p>
    
  </article>
</template>

<script setup lang="ts">
type NewsletterPageProps = {
  // Endpoint of the API's public sign-up route. The form is a plain HTML
  // POST (no fetch) so it works without JavaScript and the API sees the
  // visitor's own IP for rate limiting; the API renders the follow-up page.
  action?: string;
  privacyPolicyHref?: string;
};

const props = defineProps<NewsletterPageProps>();
</script>