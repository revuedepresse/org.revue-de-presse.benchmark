<template>
  <article
    class="rdp-newsletter-page"
    :data-edition="frenchMediaOnly ? 'fr' : choice"
  >
    <h1>
      {{
        t(frenchMediaOnly ? "newsletter.fr-only.heading" : "newsletter.heading")
      }}
    </h1>
    <p>
      {{ t(frenchMediaOnly ? "newsletter.fr-only.intro" : "newsletter.intro") }}
    </p>
    <form
      class="rdp-newsletter-page__form"
      method="post"
      :action="action ?? 'https://api.revue-de-presse.org/newsletter/subscribe'"
    >
      <template v-if="frenchMediaOnly">
        <input type="hidden" name="edition" value="fr" />
      </template>

      <template v-if="!frenchMediaOnly">
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
        <div class="rdp-newsletter-page__details" aria-live="polite">
          <template :key="edition" v-for="(edition, index) in editions">
            <p
              class="rdp-newsletter-page__detail"
              :data-edition="edition"
              :aria-hidden="choice === edition ? 'false' : 'true'"
            >
              {{ t("newsletter." + edition + ".details") }}
            </p>
          </template>
        </div>
      </template>

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
      <li>
        {{
          t(
            frenchMediaOnly
              ? "newsletter.fr-only.how.confirm"
              : "newsletter.how.confirm"
          )
        }}
      </li>
      <li>
        {{
          t(
            frenchMediaOnly
              ? "newsletter.fr-only.how.delivery"
              : "newsletter.how.delivery"
          )
        }}
      </li>
      <li>
        {{
          t(
            frenchMediaOnly
              ? "newsletter.fr-only.how.unsubscribe"
              : "newsletter.how.unsubscribe"
          )
        }}
      </li>
    </ul>
    <p class="rdp-newsletter-page__fine-print">
      {{
        t(
          frenchMediaOnly
            ? "newsletter.fr-only.fine-print"
            : "newsletter.fine-print"
        )
      }}&nbsp;<a :href="privacyPolicyHref ?? '/mentions-legales'">{{
        t("newsletter.fine-print.privacy-policy")
      }}</a
      >.
    </p>
    
  </article>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import { t } from "../utils/i18n";
const EDITIONS: NewsletterEdition[] = [
  "fr",
  "coop-medias",
  "fr-coop-medias",
  "both",
];

export type NewsletterEdition =
  | "fr"
  | "coop-medias"
  | "fr-coop-medias"
  | "both";
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