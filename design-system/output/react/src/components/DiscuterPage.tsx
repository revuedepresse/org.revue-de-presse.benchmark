"use client";
import * as React from "react";

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
  | "truncated";
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
};
type DiscuterPageProps = {
  status: DiscuterStatus;
  turns?: DiscuterTurn[];
  citations?: DiscuterCitation[];
  errorCode?: DiscuterErrorCode;
  draft?: string;
  onLogin?: () => void;
  onDraftChange?: (next: string) => void;
  onSend?: (text: string) => void;
  onCancel?: () => void;
  onRetry?: () => void;
};
import { t } from "../utils/i18n";

function DiscuterPage(props: DiscuterPageProps) {
  function errorKey() {
    const code = props.errorCode ?? "providers_exhausted";
    return `discuter.error.${code}`;
  }

  function submit() {
    const text = (props.draft ?? "").trim();
    if (text.length === 0) return;
    props.onSend?.(text);
  }

  return (
    <section
      className="rdp-discuter"
      data-testid="discuter-page"
      aria-labelledby="rdp-discuter-h1"
    >
      <header className="rdp-discuter__header">
        <h1 id="rdp-discuter-h1" className="rdp-discuter__title">
          {t("discuter.title")}
        </h1>
        <p className="rdp-discuter__lede">{t("discuter.lede")}</p>
      </header>
      {props.status === "unauthenticated" ? (
        <div
          className="rdp-discuter__panel rdp-discuter__panel--cta"
          role="region"
        >
          <p className="rdp-discuter__cta-body">
            {t("discuter.unauthenticated.body")}
          </p>
          <button
            type="button"
            className="rdp-discuter__cta-button"
            onClick={(event) => props.onLogin?.()}
          >
            {t("discuter.unauthenticated.cta")}
          </button>
        </div>
      ) : null}
      {props.status === "authenticating" ? (
        <div className="rdp-discuter__panel" role="status" aria-live="polite">
          <p className="rdp-discuter__status">{t("discuter.authenticating")}</p>
        </div>
      ) : null}
      {props.status === "idle" || props.status === "streaming" ? (
        <div className="rdp-discuter__panel rdp-discuter__panel--chat">
          <ol className="rdp-discuter__turns" aria-live="polite">
            {props.turns ??
              []?.map((turn) => (
                <li
                  className={`rdp-discuter__turn rdp-discuter__turn--${turn.role}`}
                  data-role={turn.role}
                >
                  <div className="rdp-discuter__turn-body">{turn.content}</div>
                </li>
              ))}
            {props.status === "streaming" ? (
              <li
                className="rdp-discuter__streaming-indicator"
                aria-hidden="true"
              >
                <span className="rdp-discuter__dot" />
                <span className="rdp-discuter__dot" />
                <span className="rdp-discuter__dot" />
              </li>
            ) : null}
          </ol>
          {(props.citations ?? []).length > 0 ? (
            <aside
              className="rdp-discuter__sources"
              aria-labelledby="rdp-discuter-sources-h"
            >
              <h2
                id="rdp-discuter-sources-h"
                className="rdp-discuter__sources-title"
              >
                {t("discuter.sources.title")}
              </h2>
              <ol className="rdp-discuter__sources-list">
                {props.citations ??
                  []?.map((citation) => (
                    <li className="rdp-discuter__source">
                      <a
                        className="rdp-discuter__source-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={citation.url}
                      >
                        <span className="rdp-discuter__source-n">
                          [{citation.n}]
                        </span>
                        <span className="rdp-discuter__source-meta">
                          {citation.screenName} — {citation.snapshotDate}
                        </span>
                        <span className="rdp-discuter__source-text">
                          {citation.text}
                        </span>
                      </a>
                    </li>
                  ))}
              </ol>
            </aside>
          ) : null}
          <form
            className="rdp-discuter__composer"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <label
              className="rdp-discuter__composer-label"
              htmlFor="rdp-discuter-input"
            >
              {t("discuter.composer.label")}
            </label>
            <textarea
              id="rdp-discuter-input"
              className="rdp-discuter__composer-input"
              rows={3}
              value={props.draft ?? ""}
              disabled={props.status === "streaming"}
              placeholder={t("discuter.composer.placeholder")}
              onInput={(event) =>
                props.onDraftChange?.(
                  (event.target as HTMLTextAreaElement).value
                )
              }
            />
            <div className="rdp-discuter__composer-actions">
              {props.status === "streaming" ? (
                <button
                  type="button"
                  className="rdp-discuter__composer-cancel"
                  onClick={(event) => props.onCancel?.()}
                >
                  {t("discuter.composer.cancel")}
                </button>
              ) : null}
              {props.status === "idle" ? (
                <button type="submit" className="rdp-discuter__composer-send">
                  {t("discuter.composer.send")}
                </button>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}
      {props.status === "error" ? (
        <div
          className="rdp-discuter__panel rdp-discuter__panel--error"
          role="alert"
        >
          <p className="rdp-discuter__error-body">{t(errorKey())}</p>
          <button
            type="button"
            className="rdp-discuter__error-retry"
            onClick={(event) => props.onRetry?.()}
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
          font-family: 'Roboto', sans-serif;
          color: var(--color-content-text);
          display: flex;
          flex-direction: column;
          gap: var(--separation-2);
        }
        .rdp-discuter__header { display: flex; flex-direction: column; gap: var(--separation-1); }
        .rdp-discuter__title {
          font-family: 'Signika', sans-serif;
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
          align-items: flex-start;
        }
        .rdp-discuter__cta-body { margin: 0; }
        .rdp-discuter__cta-button,
        .rdp-discuter__composer-send,
        .rdp-discuter__error-retry {
          background: var(--button-bg-primary);
          color: var(--button-fg-primary);
          border: none;
          border-radius: var(--radius-default);
          padding: var(--separation-1) var(--separation-2);
          font-family: 'Roboto', sans-serif;
          font-size: var(--font-size-content);
          cursor: pointer;
        }
        .rdp-discuter__cta-button:hover,
        .rdp-discuter__composer-send:hover,
        .rdp-discuter__error-retry:hover {
          background: var(--button-bg-primary-hover);
        }
        .rdp-discuter__composer-cancel {
          background: var(--button-bg-secondary);
          color: var(--color-brand-active);
          border: 1px solid var(--button-border-secondary);
          border-radius: var(--radius-default);
          padding: var(--separation-1) var(--separation-2);
          font-family: 'Roboto', sans-serif;
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
          padding: var(--separation-1) var(--separation-2);
          border-radius: var(--radius-default);
          background: var(--color-white);
          max-width: 90%;
          line-height: var(--line-height-base);
        }
        .rdp-discuter__turn--user {
          align-self: flex-end;
          background: var(--color-brand);
          color: var(--color-white);
        }
        .rdp-discuter__turn--assistant { align-self: flex-start; }
        .rdp-discuter__turn-body { white-space: pre-wrap; }
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
        }
        .rdp-discuter__sources {
          border-top: 1px solid var(--color-border);
          padding-top: var(--separation-2);
          display: flex;
          flex-direction: column;
          gap: var(--separation-1);
        }
        .rdp-discuter__sources-title {
          font-family: 'Signika', sans-serif;
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
          gap: var(--separation-1);
        }
        .rdp-discuter__source-link {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: var(--separation-1);
          background: var(--color-white);
          border-radius: var(--radius-default);
          text-decoration: none;
          color: var(--color-content-text);
        }
        .rdp-discuter__source-link:hover { background: var(--color-taupe-grey); }
        .rdp-discuter__source-n { font-weight: bold; color: var(--color-brand); }
        .rdp-discuter__source-meta { font-size: 0.85em; color: var(--color-content-text); }
        .rdp-discuter__source-text { line-height: var(--line-height-base); }
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
          font-family: 'Roboto', sans-serif;
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
}

export default DiscuterPage;
