<template>
  <div class="rdp-notice" role="status">
    <h2 class="rdp-notice__headline">{{ t(headlineKey, headlineVars) }}</h2>
    <p class="rdp-notice__body">{{ t(bodyKey, bodyVars) }}</p>
    
  </div>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";

type NoticeProps = {
  headlineKey: string;
  bodyKey: string;
  headlineVars?: Record<string, string | number>;
  bodyVars?: Record<string, string | number>;
};

const props = defineProps<NoticeProps>();
</script>