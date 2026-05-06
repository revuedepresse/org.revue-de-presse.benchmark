<script setup lang="ts">
import DateGrid from '@design-system/components/DateGrid.vue';
</script>

<template>
  <Story title="Molecules/DateGrid">
    <Variant title="April 2021, day 6 selected">
      <DateGrid :year="2021" :month="3" :selected-date="new Date(2021, 3, 6)" locale="fr-FR" />
    </Variant>
  </Story>
</template>
