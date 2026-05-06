<template>
  <div
    :class="`rdp-snapshots-list rdp-snapshots-list--${
      presentation ?? 'inline'
    }`"
  >
    <template v-if="presentation === 'sheet'">
      <div
        class="rdp-snapshots-list__scrim"
        aria-hidden="true"
        @click="async (event) => onDismiss?.()"
      ></div>
    </template>

    <div class="rdp-snapshots-list__panel">
      <header class="rdp-snapshots-list__header">
        <Icon name="pick-list" :size="24" :decorative="true"></Icon
        ><span>{{ t("snapshots-list.heading") }}</span>
      </header>
      <template v-if="items.length === 0">
        <p class="rdp-snapshots-list__empty">{{ t("snapshots-list.empty") }}</p>
      </template>

      <template v-if="items.length > 0">
        <ul class="rdp-snapshots-list__items" role="listbox">
          <template :key="index" v-for="(item, index) in items">
            <li
              role="option"
              :aria-selected="item.id === selectedId ? 'true' : 'false'"
              :class="`rdp-snapshots-list__item${
                item.id === selectedId
                  ? ' rdp-snapshots-list__item--selected'
                  : ''
              }`"
              @click="async (event) => onSelect?.(item.id)"
            >
              {{ item.label }}
            </li>
          </template>
        </ul>
      </template>
    </div>
    <component :is="'style'">{{
      `
        .rdp-snapshots-list {
          background: var(--color-white);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-default);
          font-family: 'Roboto', sans-serif;
        }
        .rdp-snapshots-list--sheet { position: fixed; inset: 0; display: grid; align-items: end; }
        .rdp-snapshots-list__scrim { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); }
        .rdp-snapshots-list__header {
          display: flex;
          align-items: center;
          gap: var(--separation-1);
          padding: var(--separation-1) var(--separation-2);
          background: var(--color-brand-active);
          color: var(--color-white);
          border-radius: var(--radius-default) var(--radius-default) 0 0;
          font-size: var(--font-size-content);
        }
        .rdp-snapshots-list__items {
          list-style: none;
          margin: 0;
          padding: 0;
          font-size: var(--font-size-content);
        }
        .rdp-snapshots-list__item {
          padding: var(--separation-1) var(--separation-2);
          border-bottom: 1px solid var(--color-border);
          color: var(--color-content-text);
          cursor: pointer;
        }
        .rdp-snapshots-list__item:last-child { border-bottom: none; }
        .rdp-snapshots-list__item--selected {
          background: var(--color-brand-active);
          color: var(--color-white);
        }
        .rdp-snapshots-list__empty {
          padding: var(--separation-2);
          color: var(--color-light-grey);
          font-size: var(--font-size-content);
          margin: 0;
        }
      `
    }}</component>
  </div>
</template>

<script setup lang="ts">
import { t } from "../utils/i18n";
import Icon from "./Icon.vue";

type ListItem = {
  id: string;
  label: string;
};
type SnapshotsListProps = {
  items: ListItem[];
  selectedId?: string;
  presentation?: "inline" | "sheet";
  onSelect?: (id: string) => void;
  onDismiss?: () => void;
};

const props = defineProps<SnapshotsListProps>();
</script>