<script setup lang="ts">
import Icon from '@design-system/components/Icon.vue';
import spriteUrl from '../src/icons/sprite.svg?url';
</script>
<template>
  <Story title="Atoms/Icon">
    <object :data="spriteUrl" type="image/svg+xml" style="display:none" />
    <Variant title="all glyphs (24px)">
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <Icon name="funding" /><Icon name="github" /><Icon name="heart" /><Icon name="introducing" />
        <Icon name="like-clicked" /><Icon name="like-intent" /><Icon name="like-metric" />
        <Icon name="next-day" /><Icon name="next-item" />
        <Icon name="pick-day" /><Icon name="pick-item" /><Icon name="pick-list" />
        <Icon name="previous-day" /><Icon name="previous-item" />
        <Icon name="reply" /><Icon name="retweet" />
        <Icon name="share" /><Icon name="sharing" /><Icon name="warning" />
      </div>
    </Variant>
    <Variant title="32px">
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <Icon name="next-day" :size="32" /><Icon name="previous-day" :size="32" />
        <Icon name="pick-list" :size="32" /><Icon name="warning" :size="32" />
      </div>
    </Variant>
  </Story>
</template>
