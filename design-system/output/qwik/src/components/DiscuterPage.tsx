import { Locale, t } from "../utils/i18n";

import { BlueskyPost, default as BlueskyPostCard } from "./BlueskyPostCard.jsx";

import { $, Fragment, component$, h, useComputed$ } from "@builder.io/qwik";

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
export const submit = function submit(
  props,
  state,
  errorKey,
  handleErrorKey,
  cleanedHandle,
  canSubmitHandle
) {
  const text = (props.draft ?? "").trim();
  if (text.length === 0) return;
  props.onSend?.(text);
};
export const submitHandle = function submitHandle(
  props,
  state,
  errorKey,
  handleErrorKey,
  cleanedHandle,
  canSubmitHandle
) {
  const handle = cleanedHandle.value;
  if (handle.length === 0) return;
  props.onLogin?.(handle);
};
export const citationToPost = function citationToPost(
  props,
  state,
  errorKey,
  handleErrorKey,
  cleanedHandle,
  canSubmitHandle,
  citation: DiscuterCitation
) {
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
};
export const DiscuterPage = component$((props: DiscuterPageProps) => {
  const errorKey = useComputed$(() => {
    const code = props.errorCode ?? "providers_exhausted";
    return `discuter.error.${code}`;
  });
  const handleErrorKey = useComputed$(() => {
    const code = props.handleErrorCode;
    if (code === "handle_not_found") {
      return "discuter.unauthenticated.error.handleNotFound";
    }
    return "discuter.unauthenticated.error.handleInvalid";
  });
  const cleanedHandle = useComputed$(() => {
    return (props.handleDraft ?? "").trim().replace(/^@/, "");
  });
  const canSubmitHandle = useComputed$(() => {
    return cleanedHandle.value.length > 0;
  });
  const state: any = {};

  return (
    <section
      class="rdp-discuter"
      data-testid="discuter-page"
      aria-labelledby="rdp-discuter-h1"
    >
      <header class="rdp-discuter__header">
        <h1 id="rdp-discuter-h1" class="rdp-discuter__title">
          {t("discuter.title")}
        </h1>
        <p class="rdp-discuter__lede">{t("discuter.lede")}</p>
      </header>
      {props.status === "unauthenticated" ? (
        <div class="rdp-discuter__panel rdp-discuter__panel--cta" role="region">
          <p class="rdp-discuter__cta-body">
            {t("discuter.unauthenticated.body")}
          </p>
          <form
            class="rdp-discuter__handle-form"
            preventdefault:submit
            onSubmit$={$((event) => {
              submitHandle(
                props,
                state,
                errorKey,
                handleErrorKey,
                cleanedHandle,
                canSubmitHandle
              );
            })}
          >
            <label class="rdp-discuter__handle-label" for="rdp-discuter-handle">
              {t("discuter.unauthenticated.handleLabel")}
            </label>
            <div class="rdp-discuter__handle-row">
              <input
                id="rdp-discuter-handle"
                class="rdp-discuter__handle-input"
                type="text"
                autocomplete="username"
                autocapitalize="off"
                autocorrect="off"
                spellcheck={false}
                required={true}
                value={props.handleDraft ?? ""}
                placeholder={t("discuter.unauthenticated.handlePlaceholder")}
                aria-invalid={props.handleErrorCode ? "true" : "false"}
                aria-describedby={
                  props.handleErrorCode
                    ? "rdp-discuter-handle-error"
                    : undefined
                }
                onInput$={$((event) =>
                  props.onHandleDraftChange?.(
                    (event.target as HTMLInputElement).value
                  )
                )}
              />
              <button
                type="submit"
                class="rdp-discuter__cta-button"
                disabled={(() => {
                  !canSubmitHandle.value;
                })()}
              >
                {t("discuter.unauthenticated.cta")}
              </button>
            </div>
            {props.handleErrorCode != null ? (
              <p
                id="rdp-discuter-handle-error"
                class="rdp-discuter__handle-error"
                role="alert"
              >
                {t(handleErrorKey.value)}
              </p>
            ) : null}
          </form>
        </div>
      ) : null}
      {props.status === "authenticating" ? (
        <div class="rdp-discuter__panel" role="status" aria-live="polite">
          <p class="rdp-discuter__status">{t("discuter.authenticating")}</p>
        </div>
      ) : null}
      {props.status === "idle" || props.status === "streaming" ? (
        <div class="rdp-discuter__panel rdp-discuter__panel--chat">
          <ol class="rdp-discuter__turns" aria-live="polite">
            {(props.turns ?? ([] || [])).map((turn) => {
              return (
                <li
                  class={`rdp-discuter__turn rdp-discuter__turn--${turn.role}`}
                  data-role={turn.role}
                >
                  <div class="rdp-discuter__turn-bubble">{turn.content}</div>
                  {turn.role === "user" ? (
                    <button
                      type="button"
                      class="rdp-discuter__turn-replay"
                      disabled={(() => {
                        props.status === "streaming";
                      })()}
                      aria-label={t("discuter.turn.replay")}
                      onClick$={$((event) => props.onSend?.(turn.content))}
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
                  ) : null}
                </li>
              );
            })}
            {props.status === "streaming" ? (
              <li class="rdp-discuter__streaming-indicator" aria-hidden="true">
                <span class="rdp-discuter__dot"></span>
                <span class="rdp-discuter__dot"></span>
                <span class="rdp-discuter__dot"></span>
              </li>
            ) : null}
          </ol>
          {(props.citations ?? []).length > 0 ? (
            <aside
              class="rdp-discuter__sources"
              aria-labelledby="rdp-discuter-sources-h"
            >
              <h2
                id="rdp-discuter-sources-h"
                class="rdp-discuter__sources-title"
              >
                {t("discuter.sources.title")}
              </h2>
              <ol class="rdp-discuter__sources-list">
                {(props.citations ?? ([] || [])).map((citation) => {
                  return (
                    <li class="rdp-discuter__source">
                      <span class="rdp-discuter__source-n" aria-hidden="true">
                        [{citation.n}]
                      </span>
                      <BlueskyPostCard
                        post={citationToPost(
                          props,
                          state,
                          errorKey,
                          handleErrorKey,
                          cleanedHandle,
                          canSubmitHandle,
                          citation
                        )}
                        locale={props.locale}
                        hideMetrics={true}
                      ></BlueskyPostCard>
                    </li>
                  );
                })}
              </ol>
            </aside>
          ) : null}
          <form
            class="rdp-discuter__composer"
            preventdefault:submit
            onSubmit$={$((event) => {
              submit(
                props,
                state,
                errorKey,
                handleErrorKey,
                cleanedHandle,
                canSubmitHandle
              );
            })}
          >
            <label
              class="rdp-discuter__composer-label"
              for="rdp-discuter-input"
            >
              {t("discuter.composer.label")}
            </label>
            <textarea
              id="rdp-discuter-input"
              class="rdp-discuter__composer-input"
              preventdefault:keydown
              rows={3}
              value={props.draft ?? ""}
              disabled={(() => {
                props.status === "streaming";
              })()}
              placeholder={t("discuter.composer.placeholder")}
              onInput$={$((event) =>
                props.onDraftChange?.(
                  (event.target as HTMLTextAreaElement).value
                )
              )}
              onKeyDown$={$((event) => {
                // Ctrl/⌘+Enter submits. Plain Enter still inserts a newline
                // so users can compose multi-line questions.
                if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                  submit(
                    props,
                    state,
                    errorKey,
                    handleErrorKey,
                    cleanedHandle,
                    canSubmitHandle
                  );
                }
              })}
            ></textarea>
            <div class="rdp-discuter__composer-actions">
              {(props.turns ?? []).length > 0 &&
              props.status !== "streaming" ? (
                <button
                  type="button"
                  class="rdp-discuter__clear"
                  onClick$={$((event) => props.onClear?.())}
                >
                  {t("discuter.clear")}
                </button>
              ) : null}
              {props.status === "streaming" ? (
                <button
                  type="button"
                  class="rdp-discuter__composer-cancel"
                  onClick$={$((event) => props.onCancel?.())}
                >
                  {t("discuter.composer.cancel")}
                </button>
              ) : null}
              {props.status === "idle" ? (
                <button type="submit" class="rdp-discuter__composer-send">
                  {t("discuter.composer.send")}
                </button>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}
      {props.status === "error" ? (
        <div
          class="rdp-discuter__panel rdp-discuter__panel--error"
          role="alert"
        >
          <p class="rdp-discuter__error-body">{t(errorKey.value)}</p>
          <button
            type="button"
            class="rdp-discuter__error-retry"
            onClick$={$((event) => props.onRetry?.())}
          >
            {t("discuter.error.retry")}
          </button>
        </div>
      ) : null}
      <style>{`
        .rdp-discuter {
          background: var(--color-white);
          border-radius: var(--radius-default);
          padding: var(--separation-3);
          font-family: "Roboto", sans-serif;
          color: var(--color-content-text);
          display: flex;
          flex-direction: column;
          gap: var(--separation-2);
        }
        .rdp-discuter__header { display: flex; flex-direction: column; gap: var(--separation-1); }
        .rdp-discuter__clear {
          appearance: none;
          background: var(--color-white);
          border: 1.5px solid var(--color-brand);
          border-radius: var(--radius-default);
          color: var(--color-brand);
          font-family: inherit;
          font-size: var(--font-size-status-text);
          font-weight: 600;
          padding: 8px 14px;
          cursor: pointer;
          line-height: 1.2;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .rdp-discuter__clear:hover,
        .rdp-discuter__clear:focus-visible {
          background: var(--color-brand);
          color: var(--color-white);
        }
        .rdp-discuter__clear:focus-visible {
          outline: 2px solid var(--color-brand-active);
          outline-offset: 2px;
        }
        .rdp-discuter__title {
          font-family: "Signika", sans-serif;
          color: var(--color-brand);
          margin: 0;
        }
        .rdp-discuter__lede { margin: 0; line-height: var(--line-height-base); }
        .rdp-discuter__panel {
          background: var(--color-taupe-grey);
          border-radius: var(--radius-default);
          padding: var(--separation-2);
          display: flex;
          flex-direction: column;
          gap: var(--separation-2);
        }
        .rdp-discuter__panel--cta {
          align-items: stretch;
        }
        .rdp-discuter__cta-body { margin: 0; }
        .rdp-discuter__handle-form {
          display: flex;
          flex-direction: column;
          gap: var(--separation-1);
        }
        .rdp-discuter__handle-label {
          font-size: 0.85em;
          color: var(--color-content-text);
        }
        .rdp-discuter__handle-row {
          display: flex;
          gap: var(--separation-1);
          flex-wrap: wrap;
        }
        .rdp-discuter__handle-input {
          flex: 1 1 240px;
          min-width: 0;
          padding: var(--separation-1);
          font-family: "Roboto", sans-serif;
          font-size: var(--font-size-content);
          line-height: var(--line-height-base);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-default);
          background: var(--color-white);
          box-sizing: border-box;
        }
        .rdp-discuter__handle-input[aria-invalid='true'] {
          border-color: var(--color-brand);
        }
        .rdp-discuter__handle-error {
          margin: 0;
          font-size: 0.85em;
          color: var(--color-brand);
        }
        .rdp-discuter__cta-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .rdp-discuter__cta-button,
        .rdp-discuter__composer-send,
        .rdp-discuter__error-retry {
          background: var(--button-bg-primary);
          color: var(--button-fg-primary);
          border: none;
          border-radius: var(--radius-default);
          padding: var(--separation-1) var(--separation-2);
          font-family: "Roboto", sans-serif;
          font-size: var(--font-size-content);
          cursor: pointer;
          transition: filter 160ms ease, background 160ms ease;
        }
        .rdp-discuter__composer-send:hover,
        .rdp-discuter__error-retry:hover {
          background: var(--button-bg-primary-hover);
        }
        /* CTA: keep the deep-teal brand colour, just darken slightly on hover
           so the entry-point button gives interaction feedback without
           flashing to the brighter active shade. */
        .rdp-discuter__cta-button:hover {
          background: var(--button-bg-primary);
          filter: brightness(0.92);
        }
        .rdp-discuter__cta-button:focus-visible {
          outline: 2px solid var(--button-bg-primary-hover);
          outline-offset: 2px;
        }
        .rdp-discuter__composer-cancel {
          background: var(--button-bg-secondary);
          color: var(--color-brand-active);
          border: 1px solid var(--button-border-secondary);
          border-radius: var(--radius-default);
          padding: var(--separation-1) var(--separation-2);
          font-family: "Roboto", sans-serif;
          font-size: var(--font-size-content);
          cursor: pointer;
        }
        .rdp-discuter__status {
          margin: 0;
          font-style: italic;
        }
        .rdp-discuter__turns {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--separation-1);
        }
        .rdp-discuter__turn {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 90%;
        }
        .rdp-discuter__turn--user { align-self: flex-end; align-items: flex-end; }
        .rdp-discuter__turn--assistant { align-self: flex-start; align-items: flex-start; }
        .rdp-discuter__turn-bubble {
          padding: var(--separation-1) var(--separation-2);
          border-radius: var(--radius-default);
          background: var(--color-white);
          line-height: var(--line-height-base);
          white-space: pre-wrap;
        }
        .rdp-discuter__turn--user .rdp-discuter__turn-bubble {
          background: var(--color-brand);
          color: var(--color-white);
        }
        .rdp-discuter__turn-replay {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-brand);
          border-radius: var(--radius-default);
          padding: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          transition: background 160ms ease, opacity 160ms ease;
        }
        .rdp-discuter__turn-replay:hover { background: var(--color-taupe-grey); }
        .rdp-discuter__turn-replay:focus-visible {
          outline: 2px solid var(--button-bg-primary-hover);
          outline-offset: 2px;
        }
        .rdp-discuter__turn-replay:disabled { opacity: 0.4; cursor: not-allowed; }
        .rdp-discuter__streaming-indicator {
          align-self: flex-start;
          display: inline-flex;
          gap: 4px;
          padding: var(--separation-1);
        }
        .rdp-discuter__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-brand);
          animation: rdp-discuter-pulse 1s ease-in-out infinite;
        }
        .rdp-discuter__dot:nth-child(2) { animation-delay: 0.15s; }
        .rdp-discuter__dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes rdp-discuter-pulse {
          0%, 60%, 100% { opacity: 0.25; }
          30% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rdp-discuter__dot { animation: none; opacity: 0.5; }
          .rdp-discuter__turn-replay { transition: none; }
        }
        .rdp-discuter__sources {
          border-top: 1px solid var(--color-border);
          padding-top: var(--separation-2);
          display: flex;
          flex-direction: column;
          gap: var(--separation-1);
        }
        .rdp-discuter__sources-title {
          font-family: "Signika", sans-serif;
          font-size: var(--font-size-status-text);
          color: var(--color-brand);
          margin: 0;
        }
        .rdp-discuter__sources-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--separation-2);
        }
        .rdp-discuter__source {
          display: flex;
          flex-direction: column;
          gap: var(--separation-1);
        }
        .rdp-discuter__source-n {
          font-weight: bold;
          color: var(--color-brand);
          font-family: "Signika", sans-serif;
          font-size: var(--font-size-status-text);
        }
        .rdp-discuter__composer {
          display: flex;
          flex-direction: column;
          gap: var(--separation-1);
        }
        .rdp-discuter__composer-label {
          font-size: 0.85em;
          color: var(--color-content-text);
        }
        .rdp-discuter__composer-input {
          width: 100%;
          padding: var(--separation-1);
          font-family: "Roboto", sans-serif;
          font-size: var(--font-size-content);
          line-height: var(--line-height-base);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-default);
          background: var(--color-white);
          resize: vertical;
          box-sizing: border-box;
        }
        .rdp-discuter__composer-input:disabled {
          background: var(--button-bg-disabled);
          cursor: not-allowed;
        }
        .rdp-discuter__composer-actions {
          display: flex;
          gap: var(--separation-1);
          justify-content: flex-end;
        }
        .rdp-discuter__panel--error { background: var(--color-white); border: 1px solid var(--color-brand); }
        .rdp-discuter__error-body { margin: 0; }
      `}</style>
    </section>
  );
});

export default DiscuterPage;
