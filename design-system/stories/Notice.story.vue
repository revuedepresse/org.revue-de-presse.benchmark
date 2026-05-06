<script setup lang="ts">
import Notice from '@design-system/components/Notice.vue';
</script>

<template>
  <Story title="Molecules/Notice">
    <Variant title="signup confirmed">
      <Notice headline-key="notice.signup-confirmed.headline" body-key="notice.signup-confirmed.body" />
    </Variant>
    <Variant title="email changed">
      <Notice headline-key="notice.email-changed.headline" body-key="notice.email-changed.body" />
    </Variant>
  </Story>
</template>
