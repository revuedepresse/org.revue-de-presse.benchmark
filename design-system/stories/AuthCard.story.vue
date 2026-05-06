<script setup lang="ts">
import AuthCard from '@design-system/components/AuthCard.vue';
</script>

<template>
  <Story title="Organisms/AuthCard">
    <Variant title="login"><AuthCard flow="login" /></Variant>
    <Variant title="signup"><AuthCard flow="signup" /></Variant>
    <Variant title="reset"><AuthCard flow="reset" /></Variant>
    <Variant title="edit-email"><AuthCard flow="edit-email" /></Variant>
    <Variant title="edit-password (3 fields)"><AuthCard flow="edit-password" /></Variant>
    <Variant title="confirm">
      <AuthCard
        flow="confirm"
        :notice-key="{ headline: 'notice.signup-confirmed.headline', body: 'notice.signup-confirmed.body' }"
      />
    </Variant>
    <Variant title="login with form errors">
      <AuthCard
        flow="login"
        :form-errors="[{ key: 'errors.auth.invalid-credentials' }]"
      />
    </Variant>
  </Story>
</template>
