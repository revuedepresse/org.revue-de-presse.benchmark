<script setup lang="ts">
/**
 * OAuth redirect target for the Bluesky posting bot (social/bluesky).
 *
 * This URL is listed as `redirect_uris` in
 * public/bluesky-client-metadata.json. It exists because a *confidential*
 * atproto client cannot use a loopback redirect — loopback is native-only, and
 * native clients are barred from `private_key_jwt` — so the authorization
 * server needs a real HTTPS destination to send the operator to.
 *
 * The page is intentionally inert: it never transmits the authorization code
 * anywhere. `make bluesky-bootstrap` runs on the deploy host and waits for the
 * operator to paste this URL back into that terminal, so all this page has to
 * do is show the value and make it easy to copy.
 */
const fullUrl = ref('')
const copied = ref(false)
const hasCode = computed(() => fullUrl.value.includes('code='))

onMounted(() => {
  fullUrl.value = window.location.href
})

async function copy() {
  try {
    await navigator.clipboard.writeText(fullUrl.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Clipboard access is denied in some browsers; the textarea is selectable.
    copied.value = false
  }
}

useHead({
  title: 'Bluesky — autorisation',
  // Nothing here is useful to a search engine, and the URL carries a one-time code.
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>

<template>
  <main class="callback">
    <h1>Autorisation Bluesky</h1>

    <template v-if="hasCode">
      <p>
        Autorisation reçue. Copiez l’URL complète ci-dessous et collez-la dans le
        terminal où <code>make bluesky-bootstrap</code> est en attente.
      </p>

      <textarea
        :value="fullUrl"
        readonly
        rows="4"
        aria-label="URL de redirection complète"
        @focus="($event.target as HTMLTextAreaElement).select()"
      />

      <button type="button" @click="copy">
        {{ copied ? 'Copié ✓' : 'Copier l’URL' }}
      </button>

      <p class="note">
        Ce code est à usage unique et expire rapidement. Cette page ne l’envoie
        nulle part&nbsp;: elle se contente de l’afficher.
      </p>
    </template>

    <p v-else class="note">
      Cette page est la cible de redirection OAuth du robot Bluesky. Elle n’a
      d’utilité qu’à la fin d’un <code>make bluesky-bootstrap</code>.
    </p>
  </main>
</template>

<style scoped>
.callback {
  max-width: 42rem;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: #fff;
  font-family: 'Roboto', sans-serif;
  line-height: 1.5;
}
h1 {
  font-family: 'Signika', sans-serif;
  font-size: 1.5rem;
}
textarea {
  width: 100%;
  box-sizing: border-box;
  font-family: ui-monospace, monospace;
  font-size: 0.8rem;
  padding: 0.5rem;
  word-break: break-all;
}
button {
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  font: inherit;
  cursor: pointer;
}
.note {
  font-size: 0.875rem;
  opacity: 0.8;
}
code {
  font-family: ui-monospace, monospace;
}
</style>
