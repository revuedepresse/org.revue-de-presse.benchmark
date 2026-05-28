<template>
  <template v-if="items.length > 0">
    <div class="rdp-form-error" role="alert" aria-live="polite">
      <template :key="index" v-for="(item, index) in items">
        <p class="rdp-form-error__item">
          {{ prefix }}{{ item.text }}
        </p> </template
      >
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { t } from "../utils/i18n";
import type { ErrorMessage } from "../types";

type FormErrorProps = {
  errors: ErrorMessage[];
};

const props = defineProps<FormErrorProps>();

const items = computed(() => {
  return (props.errors ?? []).map((e) => ({
    key: e.key,
    text: t(e.key, e.vars),
  }));
});
const prefix = computed(() => {
  return (props.errors ?? []).length > 1 ? "- " : "";
});
</script>