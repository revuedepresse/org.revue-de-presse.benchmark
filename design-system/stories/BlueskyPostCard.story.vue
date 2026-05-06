<script setup lang="ts">
import BlueskyPostCard from '@design-system/components/BlueskyPostCard.vue';

const post = {
  id: 'mock-1',
  authorName: 'Le Monde',
  authorHandle: 'lemonde.fr',
  body: 'Voici un exemple de post Bluesky pour la démo. Le post utilise la maquette du design system.',
  publishedAt: new Date('2021-04-02T17:55:00Z'),
  metrics: { replies: 182, reposts: 36000, likes: 35200 },
  hasMedia: true,
};
</script>

<template>
  <Story title="Organisms/BlueskyPostCard">
    <Variant title="with media">
      <BlueskyPostCard :post="post" locale="fr-FR" />
    </Variant>
    <Variant title="text only">
      <BlueskyPostCard :post="{ ...post, hasMedia: false }" locale="fr-FR" />
    </Variant>
  </Story>
</template>
