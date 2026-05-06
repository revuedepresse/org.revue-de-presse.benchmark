<script setup lang="ts">
import MonthPicker from '@design-system/components/MonthPicker.vue';
</script>

<template>
  <Story title="Molecules/MonthPicker">
    <Variant title="2021, April selected">
      <MonthPicker :year="2021" :selected-month="3" locale="fr-FR" />
    </Variant>
    <Variant title="en-GB">
      <MonthPicker :year="2021" :selected-month="3" locale="en-GB" />
    </Variant>
  </Story>
</template>
