<script setup lang="ts">
import Icon from '@design-system/components/Icon.vue';
import spriteUrl from '../src/icons/sprite.svg?url';
</script>
<template>
  <Story title="Atoms/Icon">
    <object :data="spriteUrl" type="image/svg+xml" style="display:none" />
    <Variant title="all glyphs">
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <Icon name="chevron-up" /><Icon name="chevron-down" /><Icon name="chevron-left" /><Icon name="chevron-right" />
        <Icon name="eye" /><Icon name="share" /><Icon name="heart" /><Icon name="bell" /><Icon name="x" /><Icon name="user" />
      </div>
    </Variant>
    <Variant title="32px">
      <Icon name="user" :size="32" />
    </Variant>
  </Story>
</template>
