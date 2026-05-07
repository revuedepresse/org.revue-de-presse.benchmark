<script setup lang="ts">
import App from '@design-system/components/App.vue';

const lists = [
  { id: 'agile', label: 'Agile' },
  { id: 'medias-francais', label: 'Médias français' },
  { id: 'machine-learning', label: 'Machine learning' },
];

const baseDate = new Date(2021, 3, 6);

const posts = [
  {
    id: 'post-1',
    authorName: 'Le Monde',
    authorHandle: 'lemonde.fr',
    body: 'Une analyse approfondie de la situation politique européenne après les dernières élections.',
    publishedAt: baseDate,
    metrics: { replies: 124, reposts: 532, likes: 1240 },
    hasMedia: true,
  },
  {
    id: 'post-2',
    authorName: 'Mediapart',
    authorHandle: 'mediapart.fr',
    body: "Enquête exclusive sur les coulisses d'une décision controversée du gouvernement.",
    publishedAt: baseDate,
    metrics: { replies: 89, reposts: 412, likes: 980 },
    hasMedia: false,
  },
];

const yearRange = { min: 2018, max: 2026 };
</script>

<template>
  <Story title="Organisms/App">
    <Variant title="default">
      <App
        layout="desktop"
        :authenticated="false"
        :posts="posts"
        :picked-date="baseDate"
        :lists="lists"
        selected-list-id="medias-francais"
        :year-range="yearRange"
        locale="fr-FR"
      />
    </Variant>

    <Variant title="empty">
      <App
        layout="desktop"
        :authenticated="false"
        :posts="[]"
        :picked-date="baseDate"
        :lists="lists"
        selected-list-id="medias-francais"
        :year-range="yearRange"
        locale="fr-FR"
      />
    </Variant>

    <Variant title="mobile">
      <App
        layout="mobile"
        :authenticated="false"
        :posts="posts"
        :picked-date="baseDate"
        :lists="lists"
        selected-list-id="medias-francais"
        :year-range="yearRange"
        locale="fr-FR"
      />
    </Variant>
  </Story>
</template>
