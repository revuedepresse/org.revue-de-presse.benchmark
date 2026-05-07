<template>
  <article class="rdp-contact-page">
    <h1>Nous contacter</h1>
    <p>
      Il est possible de prendre contact avec nous à l'adresse suivante :
      <br /><a
        class="rdp-contact-page__email"
        :href="`mailto:${email ?? 'contact@revue-de-presse.org'}`"
        >{{ email ?? "contact@revue-de-presse.org" }}</a
      >
    </p>
    <component :is="'style'">{{
      `
        .rdp-contact-page {
          background: var(--color-white);
          border-radius: var(--radius-default);
          padding: var(--separation-3);
          font-family: 'Roboto', sans-serif;
          color: var(--color-content-text);
        }
        .rdp-contact-page h1 {
          font-family: 'Signika', sans-serif;
          color: var(--color-brand);
          margin: 0 0 var(--separation-2);
        }
        .rdp-contact-page p { margin: 0 0 var(--separation-1); }
        .rdp-contact-page__email { color: var(--color-brand); }
      `
    }}</component>
  </article>
</template>

<script setup lang="ts">
type ContactPageProps = {
  email?: string;
};

const props = defineProps<ContactPageProps>();
</script>