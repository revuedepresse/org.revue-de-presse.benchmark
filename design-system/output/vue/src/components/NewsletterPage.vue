<template>
  <article class="rdp-newsletter-page" :data-edition="edition">
    <h1>{{ t("newsletter." + edition + ".heading") }}</h1>
    <p>{{ t("newsletter." + edition + ".intro") }}</p>
    <form
      class="rdp-newsletter-page__form"
      method="post"
      :action="action ?? 'https://api.revue-de-presse.org/newsletter/subscribe'"
    >
      <input type="hidden" name="edition" :value="edition" /><label
        class="rdp-newsletter-page__label"
        for="newsletter-email"
        >{{ t("newsletter.form.email.label") }}</label
      >
      <div class="rdp-newsletter-page__row">
        <input
          id="newsletter-email"
          class="rdp-newsletter-page__input"
          type="email"
          name="email"
          autocomplete="email"
          :placeholder="t('newsletter.form.email.placeholder')"
          :required="true"
        /><button class="rdp-newsletter-page__submit" type="submit">
          {{ t("newsletter.form.submit") }}
        </button>
      </div>
      <div class="rdp-newsletter-page__trap" aria-hidden="true">
        <label for="newsletter-website">{{
          t("newsletter.form.trap.label")
        }}</label
        ><input
          id="newsletter-website"
          type="text"
          name="website"
          tabindex="-1"
          autocomplete="off"
        />
      </div>
    </form>
    <h2>{{ t("newsletter.how.heading") }}</h2>
    <ul>
      <li>{{ t("newsletter.how.confirm") }}</li>
      <li>{{ t("newsletter.how.delivery") }}</li>
      <li>{{ t("newsletter.how.unsubscribe") }}</li>
    </ul>
    <p class="rdp-newsletter-page__other-edition">
      <span class="rdp-newsletter-page__other-edition-pitch">{{
        t("newsletter." + edition + ".other-edition.pitch")
      }}</span
      ><a
        class="rdp-newsletter-page__other-edition-link"
        :href="otherEditionHref"
        @click="async (event) => handleOtherEditionClick(event)"
        :data-edition="otherEdition"
        >{{ t("newsletter." + edition + ".other-edition.label") }}</a
      >
    </p>
    <p class="rdp-newsletter-page__fine-print">
      {{ t("newsletter.fine-print") }}&nbsp;<a
        :href="privacyPolicyHref ?? '/mentions-legales'"
        >{{ t("newsletter.fine-print.privacy-policy") }}</a
      >.
    </p>
    
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { t } from "../utils/i18n";

export type NewsletterEdition = "fr" | "coop-medias";
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

const props = defineProps<NewsletterPageProps>();

const edition = computed(() => {
  return props.edition === "coop-medias" ? "coop-medias" : "fr";
});
const otherEdition = computed(() => {
  return props.edition === "coop-medias" ? "fr" : "coop-medias";
});
const otherEditionHref = computed(() => {
  if (props.otherEditionHref) return props.otherEditionHref;
  return props.edition === "coop-medias"
    ? "/lettre-quotidienne"
    : "/lettre-quotidienne-coop-medias";
});

function handleOtherEditionClick(event: any) {
  if (props.onOtherEditionClick) {
    event.preventDefault();
    props.onOtherEditionClick();
  }
}
</script>