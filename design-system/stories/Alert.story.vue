<script setup lang="ts">
import Alert from '@design-system/components/Alert.vue';
</script>

<template>
  <Story title="Molecules/Alert">
    <Variant title="empty">
      <Alert variant="empty" message-key="alert.empty.no-content-for-date" />
    </Variant>
    <Variant title="info">
      <Alert variant="info" message-key="alert.empty.no-content-for-date" />
    </Variant>
    <Variant title="warning">
      <Alert variant="warning" message-key="errors.password.breached" />
    </Variant>
  </Story>
</template>
