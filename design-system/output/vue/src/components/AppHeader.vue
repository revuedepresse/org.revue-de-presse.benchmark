<template>
  <header :class="`rdp-app-header rdp-app-header--${layout}`">
    <button
      type="button"
      class="rdp-app-header__home"
      aria-label="Revue de presse"
      @click="async (event) => onLogoClick?.()"
    >
      <Logo
        :showWordmark="true"
        :size="layout === 'mobile' ? 'sm' : 'md'"
      ></Logo>
    </button>
    <template v-if="showAccountControls === true && layout === 'desktop'">
      <a
        href="#"
        class="rdp-app-header__myspace"
        :aria-disabled="!authenticated ? 'true' : undefined"
        @click="
          async (event) => {
            if (!authenticated) {
              event.preventDefault();
              return;
            }
            onMySpaceClick?.();
          }
        "
        >{{ t("header.my-space") }}</a
      >
    </template>

    <template v-if="showAccountControls === true">
      <button
        type="button"
        class="rdp-app-header__account"
        :aria-label="t('header.my-account.aria-label')"
        @click="async (event) => onAccountClick?.()"
      >
        <Icon name="pick-item" :size="32" :decorative="true"></Icon>
      </button>
    </template>

    
  </header>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";
import Logo from "./Logo.vue";
import Icon from "./Icon.vue";

type AppHeaderProps = {
  layout: "mobile" | "desktop";
  authenticated: boolean;
  showAccountControls?: boolean;
  onAccountClick?: () => void;
  onMySpaceClick?: () => void;
  onLogoClick?: () => void;
};

const props = defineProps<AppHeaderProps>();
</script>