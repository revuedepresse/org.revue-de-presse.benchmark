<script setup lang="ts">
import { ref } from 'vue';
import Logo from '@design-system/components/Logo.vue';
import Icon from '@design-system/components/Icon.vue';
import Button from '@design-system/components/Button.vue';
import Link from '@design-system/components/Link.vue';
import Checkbox from '@design-system/components/Checkbox.vue';
import TextField from '@design-system/components/TextField.vue';
import EmailField from '@design-system/components/EmailField.vue';
import PasswordField from '@design-system/components/PasswordField.vue';
import FieldError from '@design-system/components/FieldError.vue';
import FormError from '@design-system/components/FormError.vue';
import MediaPlaceholder from '@design-system/components/MediaPlaceholder.vue';
import spriteUrl from '@icons/sprite.svg?url';

const email = ref('');
const password = ref('');
const tos = ref(false);
const showError = ref(false);
</script>

<template>
  <main>
    <object :data="spriteUrl" type="image/svg+xml" style="display:none" />

    <header><Logo show-wordmark /></header>

    <section>
      <h2>Buttons</h2>
      <Button variant="primary" label="Connexion" />
      <Button variant="secondary" label="Avril 2021" />
      <Button variant="form" label="S'inscrire" />
      <Button variant="quit" label="Quitter" icon-after="x" />
      <Button variant="scrollTop" icon="chevron-up" aria-label="Remonter" />
    </section>

    <section>
      <h2>Form</h2>
      <EmailField name="email" :value="email" @change="email = $event" />
      <PasswordField name="password" :value="password" mode="login" @change="password = $event" />
      <Checkbox name="tos" :checked="tos" @change="tos = $event" label-key="auth.tos.checkbox-label" />
      <FormError v-if="showError" :errors="[
        { key: 'errors.password.too-short', vars: { min: 15 } },
        { key: 'errors.tos.not-accepted' }
      ]" />
      <Button variant="form" label="Tester l'erreur" @click="showError = true" />
    </section>

    <section>
      <h2>Misc</h2>
      <Link href="https://revue-de-presse.org" external label="revue-de-presse.org" />
      <Icon name="heart" />
      <Icon name="share" />
      <FieldError message-key="errors.email.invalid" />
      <MediaPlaceholder :width="270" :height="160" />
    </section>
  </main>
</template>

<style>
body { margin: 0; background: var(--color-taupe-grey); font-family: 'Roboto', sans-serif; }
main { padding: var(--separation-3); display: grid; gap: var(--separation-3); }
section { display: flex; flex-direction: column; gap: var(--separation-2); align-items: flex-start; }
h2 { margin: 0; font-family: 'Signika', sans-serif; color: var(--color-content-text); }
</style>
