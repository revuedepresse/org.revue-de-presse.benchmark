import  { t } from '../utils/i18n';
import './BlueskyPostCard.ts';
import './BlueskyPostCard.ts';
import type { Locale } from '../utils/i18n';



   import { LitElement, html, css } from 'lit';
   import { customElement, property, state, query } from 'lit/decorators';

   export type DiscuterStatus = 'unauthenticated' | 'authenticating' | 'idle' | 'streaming' | 'error'
export type DiscuterErrorCode = 'rate_limited_user' | 'rate_limited_global' | 'providers_exhausted' | 'truncated' | 'bluesky_login_failed'
export type DiscuterHandleErrorCode = 'handle_not_found' | 'handle_invalid'
export type DiscuterTurn = {
 id: string;
 role: 'user' | 'assistant';
 content: string;
}
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
}
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
}


   @customElement('discuter-page')
   export default class DiscuterPage extends LitElement {

       createRenderRoot() {
         return this;
       }







     @property() errorCode: any
@property() handleErrorCode: any
@property() handleDraft: any
@property() draft: any
@property() onSend: any
@property() onLogin: any
@property() status: any
@property() onHandleDraftChange: any
@property() turns: any
@property() citations: any
@property() locale: any
@property() onDraftChange: any
@property() onClear: any
@property() onCancel: any
@property() onRetry: any


        get errorKey() {
 const code = this.errorCode ?? 'providers_exhausted';
 return `discuter.error.${code}`;
}
get handleErrorKey() {
 const code = this.handleErrorCode;
 if (code === 'handle_not_found') {
   return 'discuter.unauthenticated.error.handleNotFound';
 }
 return 'discuter.unauthenticated.error.handleInvalid';
}
get cleanedHandle() {
 return (this.handleDraft ?? '').trim().replace(/^@/, '');
}
get canSubmitHandle() {
 return this.cleanedHandle.length > 0;
}
submit() {
 const text = (this.draft ?? '').trim();
 if (text.length === 0) return;
 this.onSend?.(text);
}
submitHandle() {
 const handle = this.cleanedHandle;
 if (handle.length === 0) return;
 this.onLogin?.(handle);
}
citationToPost(citation: DiscuterCitation) {
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
     likes: citation.likes ?? 0
   },
   publicationUrl: citation.url
 };
}






     render() {
       return html`

          <section  data-testid="discuter-page"  aria-labelledby="rdp-discuter-h1" ><header ><h1  id="rdp-discuter-h1" >${t('discuter.title')}</h1>
        <p >${t('discuter.lede')}</p></header>
        ${this.status === 'unauthenticated' ?
              html`<div  role="region" ><p >${t('discuter.unauthenticated.body')}</p>
       <form  @submit=${(event) => {
         event.preventDefault();
         this.submitHandle();
       }} ><label  for="rdp-discuter-handle" >${t('discuter.unauthenticated.handleLabel')}</label>
       <div ><input  id="rdp-discuter-handle"  type="text"  autocomplete="username"  autocapitalize="off"  autocorrect="off"  .spellcheck=${false}  .required=${true}  .value=${this.handleDraft ?? ''}  .placeholder=${t('discuter.unauthenticated.handlePlaceholder')}  aria-invalid=${this.handleErrorCode ? 'true' : 'false'}  aria-describedby=${this.handleErrorCode ? 'rdp-discuter-handle-error' : undefined}  @input=${(event) => this.onHandleDraftChange?.((event.target as HTMLInputElement).value)}  />
       <button  type="submit"  .disabled=${!this.canSubmitHandle} >${t('discuter.unauthenticated.cta')}</button></div>
       ${this.handleErrorCode != null ?
             html`<p  id="rdp-discuter-handle-error"  role="alert" >${t(this.handleErrorKey)}</p>`
           : null}</form></div>`
            : null}
        ${this.status === 'authenticating' ?
              html`<div  role="status"  aria-live="polite" ><p >${t('discuter.authenticating')}</p></div>`
            : null}
        ${this.status === 'idle' || this.status === 'streaming' ?
              html`<div ><ol  aria-live="polite" >${this.turns ?? []?.map((turn, index) => (
             html`<li  class={`rdp-discuter__turn rdp-discuter__turn--${turn.role}`}  data-role=${turn.role} ><div >${turn.content}</div>
        ${turn.role === 'user' ?
              html`<button  type="button"  .disabled=${this.status === 'streaming'}  aria-label=${t('discuter.turn.replay')}  @click=${(event) => this.onSend?.(turn.content)} ><svg  width="16"  height="16"  viewBox="0 0 24 24"  aria-hidden="true" ><path  d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"  fill="currentColor" ></path></svg></button>`
            : null}</li>`
           ))}
       ${this.status === 'streaming' ?
             html`<li  aria-hidden="true" ><span ></span>
        <span ></span>
        <span ></span></li>`
           : null}</ol>
       ${(this.citations ?? []).length > 0 ?
             html`<aside  aria-labelledby="rdp-discuter-sources-h" ><h2  id="rdp-discuter-sources-h" >${t('discuter.sources.title')}</h2>
        <ol >${this.citations ?? []?.map((citation, index) => (
              html`<li ><span  aria-hidden="true" >
                               [
       ${citation.n}
       ]
                             </span>
       <bluesky-post-card  .post=${this.citationToPost(citation)}  .locale=${this.locale}  .hideMetrics=${true} ></bluesky-post-card></li>`
            ))}</ol></aside>`
           : null}
       <form  @submit=${(event) => {
         event.preventDefault();
         this.submit();
       }} ><label  for="rdp-discuter-input" >${t('discuter.composer.label')}</label>
       <textarea  id="rdp-discuter-input"  .rows=${3}  .value=${this.draft ?? ''}  .disabled=${this.status === 'streaming'}  .placeholder=${t('discuter.composer.placeholder')}  @input=${(event) => this.onDraftChange?.((event.target as HTMLTextAreaElement).value)}  @keydown=${(event) => {
         // Ctrl/⌘+Enter submits. Plain Enter still inserts a newline
         // so users can compose multi-line questions.
         if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
           event.preventDefault();
           this.submit();
         }
       }} ></textarea>
       <div >${(this.turns ?? []).length > 0 && this.status !== 'streaming' ?
             html`<button  type="button"  @click=${(event) => this.onClear?.()} >${t('discuter.clear')}</button>`
           : null}
       ${this.status === 'streaming' ?
             html`<button  type="button"  @click=${(event) => this.onCancel?.()} >${t('discuter.composer.cancel')}</button>`
           : null}
       ${this.status === 'idle' ?
             html`<button  type="submit" >${t('discuter.composer.send')}</button>`
           : null}</div></form></div>`
            : null}
        ${this.status === 'error' ?
              html`<div  role="alert" ><p >${t(this.errorKey)}</p>
       <button  type="button"  @click=${(event) => this.onRetry?.()} >${t('discuter.error.retry')}</button></div>`
            : null}
        <style >${`
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
               .rdp-discuter__clear {
                 appearance: none;
                 background: transparent;
                 border: 1px solid var(--color-border);
                 border-radius: var(--radius-default);
                 color: var(--color-content-text);
                 font-family: inherit;
                 font-size: var(--font-size-status-text);
                 padding: 4px 10px;
                 cursor: pointer;
                 line-height: 1.2;
               }
               .rdp-discuter__clear:hover { background: var(--color-taupe-grey); }
               .rdp-discuter__clear:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
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
                 font-family: 'Roboto', sans-serif;
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
                 font-family: 'Roboto', sans-serif;
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
                 font-family: 'Signika', sans-serif;
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
             `}</style></section>
        `
     }
   }