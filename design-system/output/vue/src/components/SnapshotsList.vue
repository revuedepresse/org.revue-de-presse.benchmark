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
        <ol class="rdp-snapshots-list__items" role="listbox">
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
              <span class="rdp-snapshots-list__item-rank">{{ index + 1 }}.</span
              ><span class="rdp-snapshots-list__item-label">{{
                item.label
              }}</span>
            </li>
          </template>
        </ol>
      </template>
    </div>
    
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