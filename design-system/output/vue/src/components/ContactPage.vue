<template>
  <article class="rdp-contact-page">
    <h1>Nous contacter</h1>
    <p>
      Il est possible de prendre contact avec nous à l'adresse suivante&nbsp;:
      <br /><a
        class="rdp-contact-page__email"
        :href="`mailto:${email ?? 'contact@revue-de-presse.org'}`"
        >{{ email ?? "contact@revue-de-presse.org" }}</a
      >
    </p>
    
  </article>
</template>

<script setup lang="ts">
type ContactPageProps = {
  email?: string;
};

const props = defineProps<ContactPageProps>();
</script>