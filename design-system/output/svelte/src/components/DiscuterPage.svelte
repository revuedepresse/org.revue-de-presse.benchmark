<script context='module' lang='ts'>
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
}

type DiscuterPageProps = {
status: DiscuterStatus;
turns?: DiscuterTurn[];
citations?: DiscuterCitation[];
errorCode?: DiscuterErrorCode;
draft?: string;
handleDraft?: string;
handleErrorCode?: DiscuterHandleErrorCode;
onLogin?: (handle: string) => void;
onHandleDraftChange?: (next: string) => void;
onDraftChange?: (next: string) => void;
onSend?: (text: string) => void;
onCancel?: () => void;
onRetry?: () => void;
}

    </script>
    

    
<script lang='ts'>




  import  { t } from '../utils/i18n';





    export let errorCode: DiscuterPageProps['errorCode']= undefined;
export let handleErrorCode: DiscuterPageProps['handleErrorCode']= undefined;
export let handleDraft: DiscuterPageProps['handleDraft']= undefined;
export let draft: DiscuterPageProps['draft']= undefined;
export let onSend: DiscuterPageProps['onSend']= undefined;
export let onLogin: DiscuterPageProps['onLogin']= undefined;
export let status: DiscuterPageProps['status'];
export let onHandleDraftChange: DiscuterPageProps['onHandleDraftChange']= undefined;
export let turns: DiscuterPageProps['turns']= undefined;
export let citations: DiscuterPageProps['citations']= undefined;
export let onDraftChange: DiscuterPageProps['onDraftChange']= undefined;
export let onCancel: DiscuterPageProps['onCancel']= undefined;
export let onRetry: DiscuterPageProps['onRetry']= undefined;



    function submit() {
const text = (draft ?? '').trim();
if (text.length === 0) return;
onSend?.(text);
}
function submitHandle() {
const handle = cleanedHandle();
if (handle.length === 0) return;
onLogin?.(handle);
}
    $: errorKey = () => {
const code = errorCode ?? 'providers_exhausted';
return `discuter.error.${code}`;
};
$: handleErrorKey = () => {
const code = handleErrorCode;
if (code === 'handle_not_found') {
  return 'discuter.unauthenticated.error.handleNotFound';
}
return 'discuter.unauthenticated.error.handleInvalid';
};
$: cleanedHandle = () => {
return (handleDraft ?? '').trim().replace(/^@/, '');
};
$: canSubmitHandle = () => {
return cleanedHandle().length > 0;
};













  </script>

  <section  class="rdp-discuter"  data-testid="discuter-page"  aria-labelledby="rdp-discuter-h1" ><header  class="rdp-discuter__header" ><h1  id="rdp-discuter-h1"  class="rdp-discuter__title" >{t('discuter.title')}</h1><p  class="rdp-discuter__lede" >{t('discuter.lede')}</p></header>
{#if status === 'unauthenticated' }
<div  class="rdp-discuter__panel rdp-discuter__panel--cta"  role="region" ><p  class="rdp-discuter__cta-body" >{t('discuter.unauthenticated.body')}</p><form  class="rdp-discuter__handle-form"  on:submit="{(event) => {
event.preventDefault();
submitHandle();
}}" ><label  class="rdp-discuter__handle-label"  for="rdp-discuter-handle" >{t('discuter.unauthenticated.handleLabel')}</label><div  class="rdp-discuter__handle-row" ><input  id="rdp-discuter-handle"  class="rdp-discuter__handle-input"  type="text"  autocomplete="username"  autocapitalize="off"  autocorrect="off"  spellcheck={false}  required={true}  value={handleDraft ?? ''}  placeholder={t('discuter.unauthenticated.handlePlaceholder')}  aria-invalid={handleErrorCode ? 'true' : 'false'}  aria-describedby={handleErrorCode ? 'rdp-discuter-handle-error' : undefined}  on:input="{(event) => {onHandleDraftChange?.(event.target.value)}}"  /><button  type="submit"  class="rdp-discuter__cta-button"  disabled={!canSubmitHandle()} >{t('discuter.unauthenticated.cta')}</button></div>
{#if handleErrorCode != null }
<p  id="rdp-discuter-handle-error"  class="rdp-discuter__handle-error"  role="alert" >{t(handleErrorKey())}</p>


{/if}</form></div>


{/if}
{#if status === 'authenticating' }
<div  class="rdp-discuter__panel"  role="status"  aria-live="polite" ><p  class="rdp-discuter__status" >{t('discuter.authenticating')}</p></div>


{/if}
{#if status === 'idle' || status === 'streaming' }
<div  class="rdp-discuter__panel rdp-discuter__panel--chat" ><ol  class="rdp-discuter__turns"  aria-live="polite" >
{#each turns ?? [] as turn }
<li  class={`rdp-discuter__turn rdp-discuter__turn--${turn.role}`}  data-role={turn.role} ><div  class="rdp-discuter__turn-body" >{turn.content}</div></li>
{/each}

{#if status === 'streaming' }
<li  class="rdp-discuter__streaming-indicator"  aria-hidden="true" ><span  class="rdp-discuter__dot" ></span><span  class="rdp-discuter__dot" ></span><span  class="rdp-discuter__dot" ></span></li>


{/if}</ol>
{#if (citations ?? []).length > 0 }
<aside  class="rdp-discuter__sources"  aria-labelledby="rdp-discuter-sources-h" ><h2  id="rdp-discuter-sources-h"  class="rdp-discuter__sources-title" >{t('discuter.sources.title')}</h2><ol  class="rdp-discuter__sources-list" >
{#each citations ?? [] as citation }
<li  class="rdp-discuter__source" ><a  class="rdp-discuter__source-link"  target="_blank"  rel="noopener noreferrer"  href={citation.url} ><span  class="rdp-discuter__source-n" >[{citation.n}]</span><span  class="rdp-discuter__source-meta" >{citation.screenName} — {citation.snapshotDate}</span><span  class="rdp-discuter__source-text" >{citation.text}</span></a></li>
{/each}
</ol></aside>


{/if}<form  class="rdp-discuter__composer"  on:submit="{(event) => {
event.preventDefault();
submit();
}}" ><label  class="rdp-discuter__composer-label"  for="rdp-discuter-input" >{t('discuter.composer.label')}</label><textarea  id="rdp-discuter-input"  class="rdp-discuter__composer-input"  rows={3}  value={draft ?? ''}  disabled={status === 'streaming'}  placeholder={t('discuter.composer.placeholder')}  on:input="{(event) => {onDraftChange?.(event.target.value)}}" ></textarea><div  class="rdp-discuter__composer-actions" >
{#if status === 'streaming' }
<button  type="button"  class="rdp-discuter__composer-cancel"  on:click="{(event) => {onCancel?.()}}" >{t('discuter.composer.cancel')}</button>


{/if}
{#if status === 'idle' }
<button  type="submit"  class="rdp-discuter__composer-send" >{t('discuter.composer.send')}</button>


{/if}</div></form></div>


{/if}
{#if status === 'error' }
<div  class="rdp-discuter__panel rdp-discuter__panel--error"  role="alert" ><p  class="rdp-discuter__error-body" >{t(errorKey())}</p><button  type="button"  class="rdp-discuter__error-retry"  on:click="{(event) => {onRetry?.()}}" >{t('discuter.error.retry')}</button></div>


{/if}</section>