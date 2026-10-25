<template>
  <article class="rdp-sources-page">
    <h1>Sources des brèves</h1>
    <p>
      Les brèves de publications sont&nbsp;
      <a
        class="rdp-sources-page__internal-link"
        href="#rdp-sources-page-footnote"
        >triées par popularité</a
      >, au choix en fin de journée ou à leur première mesure. Elles proviennent

      <template v-if="!sources.originLink">{{ sources.origin + "." }}</template>

      <template v-if="sources.originLink">
        {{ sources.origin }}
        <a
          class="rdp-sources-page__external-link"
          rel="noreferrer noopener"
          target="_blank"
          :href="sources.originLink?.href"
          >{{ sources.originLink?.label }}</a
        >
        <span>.</span>
      </template>
    </p>
    <ul class="rdp-sources-page__list" role="list">
      <template :key="index" v-for="(row, index) in sortedRoster">
        <li class="rdp-sources-page__item">
          <a
            class="rdp-sources-page__row"
            rel="noreferrer nofollow noopener"
            target="_blank"
            :href="`https://bsky.app/profile/${row.handle}`"
            ><img
              class="rdp-sources-page__avatar"
              alt=""
              width="48"
              height="48"
              loading="lazy"
              :src="row.avatar"
            /><span class="rdp-sources-page__meta"
              ><span class="rdp-sources-page__name">{{ row.displayName }}</span
              ><span class="rdp-sources-page__handle"
                >@{{ row.handle }}</span
              ></span
            ></a
          >
        </li>
      </template>
    </ul>
    <p id="rdp-sources-page-footnote" class="rdp-sources-page__footnote">
      La popularité est déduite des partages des publications sur Bluesky : «
      Fin de journée » compte ceux de toute la journée de publication, «
      Première mesure » ceux relevés à la première collecte de chaque
      publication.
    </p>
    
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { sourcesOf, SourceRow } from "../utils/sources";

type SourcesPageProps = {
  // Publisher list whose sources are shown; French media when absent.
  listId?: string;
};

const props = defineProps<SourcesPageProps>();

const sources = computed(() => {
  return sourcesOf(props.listId);
});
const sortedRoster = computed(() => {
  return sourcesOf(props.listId).roster;
});
</script>