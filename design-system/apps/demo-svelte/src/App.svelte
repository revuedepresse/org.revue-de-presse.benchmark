<script lang="ts">
  import Button from '@design-system/components/Button.svelte';
  import spriteUrl from '@icons/sprite.svg?url';
</script>

<main>
  <object data={spriteUrl} type="image/svg+xml" style="display:none" title="Icon sprite" />
  <h2>Svelte</h2>
  <Button variant="primary" label="Ven. 2 avr. 2021" icon="pick-day" />
</main>

<style>
  main {
    padding: 24px;
    background: var(--color-taupe-grey);
    min-height: 100vh;
  }
</style>
