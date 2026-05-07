<template>
  <header :class="`rdp-app-header rdp-app-header--${layout}`">
    <Logo :showWordmark="true" :size="layout === 'mobile' ? 'sm' : 'md'"></Logo>
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

    <component :is="'style'">{{
      `
        .rdp-app-header {
          display: flex;
          align-items: center;
          gap: var(--separation-2);
          padding: var(--separation-1) var(--separation-2);
          background: var(--color-white);
          border-bottom: 1px solid var(--color-border);
          font-family: 'Signika', sans-serif;
        }
        .rdp-app-header--desktop { padding: var(--separation-1) var(--separation-3); }
        .rdp-app-header__myspace {
          margin-left: auto;
          color: var(--color-brand-active);
          text-decoration: none;
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
        }
        .rdp-app-header__myspace[aria-disabled="true"] {
          color: var(--color-light-grey);
          cursor: not-allowed;
          pointer-events: none;
        }
        .rdp-app-header__account {
          background: transparent;
          border: none;
          cursor: pointer;
          width: 40px;
          height: 40px;
          margin-left: auto;
          color: var(--color-content-text);
        }
        .rdp-app-header--desktop .rdp-app-header__account { margin-left: 0; }
      `
    }}</component>
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
};

const props = defineProps<AppHeaderProps>();
</script>