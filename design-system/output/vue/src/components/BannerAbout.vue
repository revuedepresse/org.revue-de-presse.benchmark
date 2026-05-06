<template>
  <template v-if="!dismissed">
    <aside class="rdp-banner-about" role="region">
      <header class="rdp-banner-about__heading">
        <Icon name="introducing" :size="24"></Icon
        ><span>{{ t("footer.about.heading") }}</span>
      </header>
      <p class="rdp-banner-about__body">
        {{ t(bodyKey ?? "footer.about.body") }}
      </p>
      <template v-if="!!dismissible">
        <button
          type="button"
          class="rdp-banner-about__close"
          :aria-label="t('actions.quit.label')"
          @click="async (event) => dismiss()"
        >
          ×
        </button>
      </template>

      <component :is="'style'">{{
        `
          .rdp-banner-about {
            background: var(--banner-about-bg);
            color: var(--banner-about-fg);
            padding: var(--separation-2);
            border-radius: var(--radius-default);
            font-family: 'Roboto', sans-serif;
            font-size: var(--font-size-content);
            position: relative;
          }
          .rdp-banner-about__heading {
            display: flex;
            align-items: center;
            gap: var(--separation-1);
            font-family: 'Signika', sans-serif;
            font-size: var(--font-size-status-text);
            color: var(--color-brand-active);
            margin-bottom: var(--separation-1);
          }
          .rdp-banner-about__body { margin: 0; }
          .rdp-banner-about__close {
            position: absolute;
            top: var(--separation-1);
            right: var(--separation-1);
            background: transparent;
            border: none;
            color: var(--color-content-font);
            font-size: 24px;
            cursor: pointer;
          }
        `
      }}</component>
    </aside>
  </template>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { t } from "../utils/i18n";
import Icon from "./Icon.vue";

type BannerAboutProps = {
  bodyKey?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
};

const props = defineProps<BannerAboutProps>();
const dismissed = ref(false);

function dismiss() {
  dismissed.value = true;
  props.onDismiss?.();
}
</script>