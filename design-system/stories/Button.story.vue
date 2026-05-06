<script setup lang="ts">
import Button from '@design-system/components/Button.vue';
</script>

<template>
  <Story title="Atoms/Button">
    <Variant title="primary"><Button variant="primary" label="Ven. 2 avr. 2021" /></Variant>
    <Variant title="secondary"><Button variant="secondary" label="Avril 2021" /></Variant>
    <Variant title="form"><Button variant="form" label="Connexion" /></Variant>
    <Variant title="quit"><Button variant="quit" label="Quitter" icon-after="x" /></Variant>
    <Variant title="scrollTop"><Button variant="scrollTop" icon="chevron-up" aria-label="Remonter" /></Variant>
    <Variant title="avatar"><Button variant="avatar" icon="user" aria-label="Compte" /></Variant>
    <Variant title="calendarNav"><Button variant="calendarNav" icon="chevron-left" aria-label="Précédent" /></Variant>
    <Variant title="disabled"><Button variant="form" label="Connexion" disabled /></Variant>
    <Variant title="loading"><Button variant="form" label="Connexion" loading /></Variant>
  </Story>
</template>
