<template>
  <article class="rdp-newsletter-page" :data-edition="choice">
    <h1>{{ t("newsletter." + choice + ".heading") }}</h1>
    <p>{{ t("newsletter." + choice + ".intro") }}</p>
    <form
      class="rdp-newsletter-page__form"
      method="post"
      :action="action ?? 'https://api.revue-de-presse.org/newsletter/subscribe'"
    >
      <fieldset class="rdp-newsletter-page__choice">
        <legend class="rdp-newsletter-page__label">
          {{ t("newsletter.choice.legend") }}
        </legend>
        <template :key="edition" v-for="(edition, index) in editions">
          <label class="rdp-newsletter-page__option"
            ><input
              class="rdp-newsletter-page__radio"
              type="radio"
              name="edition"
              :value="edition"
              :checked="choice === edition"
              @change="async (event) => choose(edition)"
            /><span class="rdp-newsletter-page__option-text"
              ><span class="rdp-newsletter-page__option-label">{{
                t("newsletter.choice." + edition)
              }}</span
              ><span class="rdp-newsletter-page__option-hint">{{
                t("newsletter.choice." + edition + ".hint")
              }}</span></span
            ></label
          >
        </template>
      </fieldset>
      <label class="rdp-newsletter-page__label" for="newsletter-email">{{
        t("newsletter.form.email.label")
      }}</label>
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
    <p class="rdp-newsletter-page__fine-print">
      {{ t("newsletter.fine-print") }}&nbsp;<a
        :href="privacyPolicyHref ?? '/mentions-legales'"
        >{{ t("newsletter.fine-print.privacy-policy") }}</a
      >.
    </p>
    
  </article>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import { t } from "../utils/i18n";
const EDITIONS: NewsletterEdition[] = ["fr", "coop-medias", "both"];

export type NewsletterEdition = "fr" | "coop-medias" | "both";
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
  //  - 'both' (default, /lettre-quotidienne): both letters, two a day,
  //    confirmed with a single email
  edition?: NewsletterEdition;
  privacyPolicyHref?: string;
};

const props = defineProps<NewsletterPageProps>();
const choice = ref(
  props.edition && EDITIONS.includes(props.edition) ? props.edition : "both"
);
const editions = ref(EDITIONS);

watch(
  () => [props.edition],
  () => {
    if (props.edition && EDITIONS.includes(props.edition)) {
      choice.value = props.edition;
    }
  },
  { immediate: true }
);
function choose(edition: NewsletterEdition) {
  choice.value = edition;
}
</script>