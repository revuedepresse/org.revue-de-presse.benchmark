<template>
  <section
    class="rdp-discuter"
    data-testid="discuter-page"
    aria-labelledby="rdp-discuter-h1"
  >
    <header class="rdp-discuter__header">
      <h1 id="rdp-discuter-h1" class="rdp-discuter__title">
        {{ t("discuter.title") }}
      </h1>
      <p class="rdp-discuter__lede">{{ t("discuter.lede") }}</p>
    </header>
    <template v-if="status === 'unauthenticated'">
      <div class="rdp-discuter__panel rdp-discuter__panel--cta" role="region">
        <p class="rdp-discuter__cta-body">
          {{ t("discuter.unauthenticated.body") }}
        </p>
        <form
          class="rdp-discuter__handle-form"
          @submit="
            async (event) => {
              event.preventDefault();
              submitHandle();
            }
          "
        >
          <label class="rdp-discuter__handle-label" for="rdp-discuter-handle">{{
            t("discuter.unauthenticated.handleLabel")
          }}</label>
          <div class="rdp-discuter__handle-row">
            <input
              id="rdp-discuter-handle"
              class="rdp-discuter__handle-input"
              type="text"
              autocomplete="username"
              autocapitalize="off"
              autocorrect="off"
              :spellcheck="false"
              :required="true"
              :value="handleDraft ?? ''"
              :placeholder="t('discuter.unauthenticated.handlePlaceholder')"
              :aria-invalid="handleErrorCode ? 'true' : 'false'"
              :aria-describedby="
                handleErrorCode ? 'rdp-discuter-handle-error' : undefined
              "
              @input="
                async (event) => onHandleDraftChange?.(event.target.value)
              "
            /><button
              type="submit"
              class="rdp-discuter__cta-button"
              :disabled="!canSubmitHandle"
            >
              {{ t("discuter.unauthenticated.cta") }}
            </button>
          </div>
          <template v-if="handleErrorCode != null">
            <p
              id="rdp-discuter-handle-error"
              class="rdp-discuter__handle-error"
              role="alert"
            >
              {{ t(handleErrorKey) }}
            </p>
          </template>
        </form>
      </div>
    </template>

    <template v-if="status === 'authenticating'">
      <div class="rdp-discuter__panel" role="status" aria-live="polite">
        <p class="rdp-discuter__status">{{ t("discuter.authenticating") }}</p>
      </div>
    </template>

    <template v-if="status === 'idle' || status === 'streaming'">
      <div class="rdp-discuter__panel rdp-discuter__panel--chat">
        <ol class="rdp-discuter__turns" aria-live="polite">
          <template :key="index" v-for="(turn, index) in turns ?? []">
            <li
              :class="`rdp-discuter__turn rdp-discuter__turn--${turn.role}`"
              :data-role="turn.role"
            >
              <div class="rdp-discuter__turn-bubble">{{ turn.content }}</div>
              <template v-if="turn.role === 'user'">
                <button
                  type="button"
                  class="rdp-discuter__turn-replay"
                  :disabled="status === 'streaming'"
                  :aria-label="t('discuter.turn.replay')"
                  @click="async (event) => onSend?.(turn.content)"
                >
                  <svg
                    class="rdp-discuter__turn-replay-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </template>
            </li>
          </template>
          <template v-if="status === 'streaming'">
            <li class="rdp-discuter__streaming-indicator" aria-hidden="true">
              <span class="rdp-discuter__dot"></span
              ><span class="rdp-discuter__dot"></span
              ><span class="rdp-discuter__dot"></span>
            </li>
          </template>
        </ol>
        <template v-if="(citations ?? []).length > 0">
          <aside
            class="rdp-discuter__sources"
            aria-labelledby="rdp-discuter-sources-h"
          >
            <h2 id="rdp-discuter-sources-h" class="rdp-discuter__sources-title">
              {{ t("discuter.sources.title") }}
            </h2>
            <ol class="rdp-discuter__sources-list">
              <template
                :key="index"
                v-for="(citation, index) in citations ?? []"
              >
                <li class="rdp-discuter__source">
                  <span class="rdp-discuter__source-n" aria-hidden="true">
                    [{{ citation.n }}] </span
                  ><BlueskyPostCard
                    :post="citationToPost(citation)"
                    :locale="locale"
                    :hideMetrics="true"
                  ></BlueskyPostCard>
                </li>
              </template>
            </ol>
          </aside>
        </template>

        <form
          class="rdp-discuter__composer"
          @submit="
            async (event) => {
              event.preventDefault();
              submit();
            }
          "
        >
          <label
            class="rdp-discuter__composer-label"
            for="rdp-discuter-input"
            >{{ t("discuter.composer.label") }}</label
          ><textarea
            id="rdp-discuter-input"
            class="rdp-discuter__composer-input"
            :rows="3"
            :value="draft ?? ''"
            :disabled="status === 'streaming'"
            :placeholder="t('discuter.composer.placeholder')"
            @input="async (event) => onDraftChange?.(event.target.value)"
            @keydown="
              async (event) => {
                // Ctrl/⌘+Enter submits. Plain Enter still inserts a newline
                // so users can compose multi-line questions.
                if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                  event.preventDefault();
                  submit();
                }
              }
            "
          ></textarea>
          <div class="rdp-discuter__composer-actions">
            <template v-if="(turns ?? []).length > 0 && status !== 'streaming'">
              <button
                type="button"
                class="rdp-discuter__clear"
                @click="async (event) => onClear?.()"
              >
                {{ t("discuter.clear") }}
              </button>
            </template>

            <template v-if="status === 'streaming'">
              <button
                type="button"
                class="rdp-discuter__composer-cancel"
                @click="async (event) => onCancel?.()"
              >
                {{ t("discuter.composer.cancel") }}
              </button>
            </template>

            <template v-if="status === 'idle'">
              <button type="submit" class="rdp-discuter__composer-send">
                {{ t("discuter.composer.send") }}
              </button>
            </template>
          </div>
        </form>
      </div>
    </template>

    <template v-if="status === 'error'">
      <div class="rdp-discuter__panel rdp-discuter__panel--error" role="alert">
        <p class="rdp-discuter__error-body">{{ t(errorKey) }}</p>
        <button
          type="button"
          class="rdp-discuter__error-retry"
          @click="async (event) => onRetry?.()"
        >
          {{ t("discuter.error.retry") }}
        </button>
      </div>
    </template>

    
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { t } from "../utils/i18n";
import BlueskyPostCard from "./BlueskyPostCard.vue";
import type { BlueskyPost } from "./BlueskyPostCard.vue";
import type { Locale } from "../utils/i18n";

export type DiscuterStatus =
  | "unauthenticated"
  | "authenticating"
  | "idle"
  | "streaming"
  | "error";
export type DiscuterErrorCode =
  | "rate_limited_user"
  | "rate_limited_global"
  | "providers_exhausted"
  | "truncated"
  | "bluesky_login_failed";
export type DiscuterHandleErrorCode = "handle_not_found" | "handle_invalid";
export type DiscuterTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
export type DiscuterCitation = {
  n: number;
  publicationId: string;
  screenName: string;
  snapshotDate: string;
  url: string;
  text: string;
  // Optional so the type stays back-compat with older API responses that
  // pre-date the BlueskyPostCard wiring. When undefined the card falls
  // back to handle-as-name, no avatar, zero metrics.
  avatarUrl?: string | null;
  reposts?: number;
  likes?: number;
  replies?: number;
};
type DiscuterPageProps = {
  status: DiscuterStatus;
  turns?: DiscuterTurn[];
  citations?: DiscuterCitation[];
  errorCode?: DiscuterErrorCode;
  draft?: string;
  handleDraft?: string;
  handleErrorCode?: DiscuterHandleErrorCode;
  locale?: Locale;
  onLogin?: (handle: string) => void;
  onHandleDraftChange?: (next: string) => void;
  onDraftChange?: (next: string) => void;
  onSend?: (text: string) => void;
  onCancel?: () => void;
  onRetry?: () => void;
  /** Wipe the conversation locally: clears turns, citations, error, draft, conversation id. */
  onClear?: () => void;
};

const props = defineProps<DiscuterPageProps>();

const errorKey = computed(() => {
  const code = props.errorCode ?? "providers_exhausted";
  return `discuter.error.${code}`;
});
const handleErrorKey = computed(() => {
  const code = props.handleErrorCode;
  if (code === "handle_not_found") {
    return "discuter.unauthenticated.error.handleNotFound";
  }
  return "discuter.unauthenticated.error.handleInvalid";
});
const cleanedHandle = computed(() => {
  return (props.handleDraft ?? "").trim().replace(/^@/, "");
});
const canSubmitHandle = computed(() => {
  return cleanedHandle.length > 0;
});

function submit() {
  const text = (props.draft ?? "").trim();
  if (text.length === 0) return;
  props.onSend?.(text);
}
function submitHandle() {
  const handle = cleanedHandle;
  if (handle.length === 0) return;
  props.onLogin?.(handle);
}
function citationToPost(citation: DiscuterCitation) {
  return {
    id: citation.publicationId,
    authorName: citation.screenName,
    authorHandle: citation.screenName,
    authorAvatarUrl: citation.avatarUrl ?? undefined,
    body: citation.text,
    publishedAt: new Date(`${citation.snapshotDate}T12:00:00Z`),
    metrics: {
      replies: citation.replies ?? 0,
      reposts: citation.reposts ?? 0,
      likes: citation.likes ?? 0,
    },
    publicationUrl: citation.url,
  };
}
</script>