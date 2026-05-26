import  { t } from '../utils/i18n';



   import { LitElement, html, css } from 'lit';
   import { customElement, property, state, query } from 'lit/decorators';

   export type DiscuterStatus = 'unauthenticated' | 'authenticating' | 'idle' | 'streaming' | 'error'
export type DiscuterErrorCode = 'rate_limited_user' | 'rate_limited_global' | 'providers_exhausted' | 'truncated'
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
}
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
}


   @customElement('discuter-page')
   export default class DiscuterPage extends LitElement {

       createRenderRoot() {
         return this;
       }







     @property() errorCode: any
@property() draft: any
@property() onSend: any
@property() status: any
@property() onLogin: any
@property() turns: any
@property() citations: any
@property() onDraftChange: any
@property() onCancel: any
@property() onRetry: any


        get errorKey() {
 const code = this.errorCode ?? 'providers_exhausted';
 return `discuter.error.${code}`;
}
submit() {
 const text = (this.draft ?? '').trim();
 if (text.length === 0) return;
 this.onSend?.(text);
}






     render() {
       return html`

          <section  data-testid="discuter-page"  aria-labelledby="rdp-discuter-h1" ><header ><h1  id="rdp-discuter-h1" >${t('discuter.title')}</h1>
        <p >${t('discuter.lede')}</p></header>
        ${this.status === 'unauthenticated' ?
              html`<div  role="region" ><p >${t('discuter.unauthenticated.body')}</p>
       <button  type="button"  @click=${(event) => this.onLogin?.()} >${t('discuter.unauthenticated.cta')}</button></div>`
            : null}
        ${this.status === 'authenticating' ?
              html`<div  role="status"  aria-live="polite" ><p >${t('discuter.authenticating')}</p></div>`
            : null}
        ${this.status === 'idle' || this.status === 'streaming' ?
              html`<div ><ol  aria-live="polite" >${this.turns ?? []?.map((turn, index) => (
             html`<li  class={`rdp-discuter__turn rdp-discuter__turn--${turn.role}`}  data-role=${turn.role} ><div >${turn.content}</div></li>`
           ))}
       ${this.status === 'streaming' ?
             html`<li  aria-hidden="true" ><span ></span>
        <span ></span>
        <span ></span></li>`
           : null}</ol>
       ${(this.citations ?? []).length > 0 ?
             html`<aside  aria-labelledby="rdp-discuter-sources-h" ><h2  id="rdp-discuter-sources-h" >${t('discuter.sources.title')}</h2>
        <ol >${this.citations ?? []?.map((citation, index) => (
              html`<li ><a  target="_blank"  rel="noopener noreferrer"  .href=${citation.url} ><span >[
       ${citation.n}
       ]</span>
       <span >${citation.screenName}
        —
       ${citation.snapshotDate}</span>
       <span >${citation.text}</span></a></li>`
            ))}</ol></aside>`
           : null}
       <form  @submit=${(event) => {
         event.preventDefault();
         this.submit();
       }} ><label  for="rdp-discuter-input" >${t('discuter.composer.label')}</label>
       <textarea  id="rdp-discuter-input"  .rows=${3}  .value=${this.draft ?? ''}  .disabled=${this.status === 'streaming'}  .placeholder=${t('discuter.composer.placeholder')}  @input=${(event) => this.onDraftChange?.((event.target as HTMLTextAreaElement).value)} ></textarea>
       <div >${this.status === 'streaming' ?
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
             `}</style></section>
        `
     }
   }