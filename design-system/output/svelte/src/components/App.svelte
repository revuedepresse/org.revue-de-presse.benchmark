<script context='module' lang='ts'>
       type MainSubView = 'publications' | 'summary';

/** Initial sub-view for the day-page, when entered via a URL like
*  /YYYY-MM-DD/synthese-des-actus-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
*  Nuxt so the route is the source of truth. */

/** Initial sub-view for the day-page, when entered via a URL like
*  /YYYY-MM-DD/synthese-des-actus-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
*  Nuxt so the route is the source of truth. */
type InitialMainSubView = MainSubView

/** Initial sub-view for the day-page, when entered via a URL like
*  /YYYY-MM-DD/synthese-des-actus-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
*  Nuxt so the route is the source of truth. */

type SnapshotItem = {
 id: string;
 label: string;
}

/** Initial sub-view for the day-page, when entered via a URL like
*  /YYYY-MM-DD/synthese-des-actus-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
*  Nuxt so the route is the source of truth. */

type ViewKey = 'main' | 'legal' | 'terms' | 'contact' | 'support' | 'sources'

/** Initial sub-view for the day-page, when entered via a URL like
*  /YYYY-MM-DD/synthese-des-actus-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
*  Nuxt so the route is the source of truth. */

type AppProps = {
 layout?: 'mobile' | 'desktop';
 posts: BlueskyPost[];
 pickedDate: Date;
 lists: SnapshotItem[];
 selectedListId?: string;
 yearRange: {
   min: number;
   max: number;
 };
 minDate?: Date;
 loading?: boolean;
 emptyMessageKey?: string;
 showPopularNews?: boolean;
 locale?: Locale;
 initialView?: ViewKey;
 onListSelect?: (id: string) => void;
 onDateSelect?: (date: Date) => void;
 onLogoClick?: () => void;
 onViewChange?: (view: ViewKey) => void;
 captureMode?: boolean;
 /** Day-page sub-view toggle: 'publications' (default) or 'summary'. */
 mainSubView?: MainSubView;
 /** Boot-time sub-view from the URL (synthese-des-actus-du-… vs actualites-du-…).
  *  AppShell uses it to set mainSubView on mount + when the prop changes. */
 initialMainSubView?: InitialMainSubView;
 /** Whether the summary fetch is in flight for the current date. */
 summaryLoading?: boolean;
 /** Pre-parsed summary blocks; empty array when the day has no summary. */
 summaryBlocks?: SummaryBlock[];
 onMainSubViewChange?: (next: MainSubView) => void;
}

     </script>
     

     
<script lang='ts'>
    import { onMount } from 'svelte'



  import  { t } from '../utils/i18n';
import  { formatLegacyShortDay } from '../utils/intl';
import  AppHeader from './AppHeader.svelte';
import  BlueskyPostCard from './BlueskyPostCard.svelte';
import  Alert from './Alert.svelte';
import  Sidebar from './Sidebar.svelte';
import  BannerAbout from './BannerAbout.svelte';
import  Calendar from './Calendar.svelte';
import  CalendarActionBar from './CalendarActionBar.svelte';
import  LegalNoticePage from './LegalNoticePage.svelte';
import  TermsOfServicePage from './TermsOfServicePage.svelte';
import  ContactPage from './ContactPage.svelte';
import  SupportPage from './SupportPage.svelte';
import  SourcesPage from './SourcesPage.svelte';
import  IntroCard from './IntroCard.svelte';
import  Spinner from './Spinner.svelte';
import type { BlueskyPost } from './BlueskyPostCard.svelte';
import type { SummaryBlock, SummaryInlineSegment } from '../utils/summary-blocks';
import type { Locale } from '../utils/i18n';





    export let pickedDate: AppProps['pickedDate'];
export let initialView: AppProps['initialView']= undefined;
export let locale: AppProps['locale']= undefined;
export let onViewChange: AppProps['onViewChange']= undefined;
export let onDateSelect: AppProps['onDateSelect']= undefined;
export let onLogoClick: AppProps['onLogoClick']= undefined;
export let minDate: AppProps['minDate']= undefined;
export let layout: AppProps['layout']= undefined;
export let showPopularNews: AppProps['showPopularNews']= undefined;
export let mainSubView: AppProps['mainSubView']= undefined;
export let captureMode: AppProps['captureMode']= undefined;
export let lists: AppProps['lists'];
export let selectedListId: AppProps['selectedListId']= undefined;
export let yearRange: AppProps['yearRange'];
export let onListSelect: AppProps['onListSelect']= undefined;
export let loading: AppProps['loading']= undefined;
export let posts: AppProps['posts'];
export let emptyMessageKey: AppProps['emptyMessageKey']= undefined;
export let onMainSubViewChange: AppProps['onMainSubViewChange']= undefined;
export let summaryLoading: AppProps['summaryLoading']= undefined;
export let summaryBlocks: AppProps['summaryBlocks']= undefined;



    function prevDay() {
const next = new Date(focusedDate);
next.setDate(next.getDate() - 1);
focusedDate = next;
currentView = 'main';
onViewChange?.('main');
onDateSelect?.(next);
}
function nextDay() {
const next = new Date(focusedDate);
next.setDate(next.getDate() + 1);
focusedDate = next;
currentView = 'main';
onViewChange?.('main');
onDateSelect?.(next);
}
function openCalendar() {
isCalendarOpen = true;
}
function closeCalendar() {
isCalendarOpen = false;
}
function pickFromCalendar(d: Date) {
focusedDate = d;
isCalendarOpen = false;
currentView = 'main';
onViewChange?.('main');
onDateSelect?.(d);
}
function selectFromSidebar(d: Date) {
focusedDate = d;
currentView = 'main';
onViewChange?.('main');
onDateSelect?.(d);
}
function goTo(view: ViewKey) {
currentView = view;
onViewChange?.(view);
}
function goHome() {
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(0, 0, 0, 0);
focusedDate = yesterday;
currentView = 'main';
onViewChange?.('main');
onDateSelect?.(yesterday);
onLogoClick?.();
}
    $: popularNewsLine = () => {
return t('header.popular-news', {
  date: formatLegacyShortDay(pickedDate, locale ?? 'fr-FR')
}, locale ?? 'fr-FR');
};
$: synthesisHeadline = () => {
return t('header.synthesis', {
  date: formatLegacyShortDay(pickedDate, locale ?? 'fr-FR')
}, locale ?? 'fr-FR');
};
$: prevDayDisabled = () => {
if (!minDate) return false;
const cur = new Date(focusedDate.getFullYear(), focusedDate.getMonth(), focusedDate.getDate());
const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
return cur.getTime() <= min.getTime();
};
$: nextDayDisabled = () => {
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(0, 0, 0, 0);
const cur = new Date(focusedDate.getFullYear(), focusedDate.getMonth(), focusedDate.getDate());
return cur.getTime() >= yesterday.getTime();
};



    let focusedDate = new Date();
let isCalendarOpen = false;
let currentView = 'main';
let initialised = false;


    onMount(() => { focusedDate = pickedDate;
if (initialView) {
currentView = initialView;
}
initialised = true; });






  </script>

  <div  data-testid="app-shell"  class={`rdp-app rdp-app--${layout ?? 'desktop'}`} ><div  class="rdp-app__header-ribbon" ><div  class="rdp-app__header-inner" ><AppHeader  layout={layout ?? 'desktop'}  authenticated={false}  onLogoClick={(event) => goHome()}></AppHeader></div></div>
{#if showPopularNews === true && mainSubView !== 'summary' }
<p  class="rdp-app__popular-news" >{popularNewsLine()}</p>


{/if}
{#if (layout ?? 'desktop') === 'desktop' }
<div  class="rdp-app__content" >
{#if !captureMode }
<aside  class="rdp-app__column" ><Sidebar  lists={lists}  selectedListId={selectedListId}  selectedDate={pickedDate}  yearRange={yearRange}  minDate={minDate}  locale={locale}  onListSelect={(id) => onListSelect?.(id)} onDateSelect={(d) => selectFromSidebar(d)} onLegalNoticeClick={(event) => goTo('legal')} onTermsOfServiceClick={(event) => goTo('terms')} onContactClick={(event) => goTo('contact')} onSupportClick={(event) => goTo('support')} onSourcesClick={(event) => goTo('sources')}></Sidebar></aside>


{/if}<main  class="rdp-app__main"  aria-busy={loading ? 'true' : undefined} >
{#if currentView !== 'main' }
<button  type="button"  class="rdp-app__back"  on:click="{(event) => {goTo('main')}}" >
              ← Retour aux publications
            </button>


{/if}
{#if !captureMode && currentView === 'main' }
<IntroCard ></IntroCard>


{/if}
{#if currentView === 'main' && loading === true }
<Spinner ></Spinner>


{/if}
{#if currentView === 'main' && !loading && posts.length === 0 }
<Alert  variant="empty"  messageKey={emptyMessageKey ?? 'alert.empty.no-content-for-date'} ></Alert>


{/if}
{#if currentView === 'main' && !loading && posts.length > 0 }
<div  class="rdp-app__main-toggle"  role="tablist"  aria-label={t('day.toggle.ariaLabel')} ><button  type="button"  role="tab"  aria-selected={(mainSubView ?? 'publications') === 'publications'}  class={(mainSubView ?? 'publications') === 'publications' ? 'rdp-app__main-toggle-btn rdp-app__main-toggle-btn--active' : 'rdp-app__main-toggle-btn'}  on:click="{(event) => {onMainSubViewChange?.('publications')}}" >{t('day.toggle.publications')}</button><button  type="button"  role="tab"  aria-selected={mainSubView === 'summary'}  class={mainSubView === 'summary' ? 'rdp-app__main-toggle-btn rdp-app__main-toggle-btn--active' : 'rdp-app__main-toggle-btn'}  on:click="{(event) => {onMainSubViewChange?.('summary')}}" >{t('day.toggle.summary')}</button></div>

{#if (mainSubView ?? 'publications') === 'publications' }
<ol  class="rdp-app__post-list" >
{#each posts as post }
<li  class="rdp-app__post-item" ><BlueskyPostCard  post={post}  locale={locale} ></BlueskyPostCard></li>
{/each}
</ol>


{/if}

{#if mainSubView === 'summary' }
<h1  class="rdp-app__synthesis-title" >{synthesisHeadline()}</h1>

{#if !!summaryLoading }
<Spinner ></Spinner>


{/if}

{#if !summaryLoading && (summaryBlocks ?? []).length === 0 }
<Alert  variant="empty"  messageKey="day.summary.empty" ></Alert>


{/if}

{#if !summaryLoading && (summaryBlocks ?? []).length > 0 }
<article  class="rdp-app__summary" >
{#each summaryBlocks ?? [] as block }

{#if block.kind === 'paragraph' }
<p  class="rdp-app__summary-p" >
{#each block.segments as seg }

{#if seg.kind === 'text' }
{seg.value}


{/if}

{#if seg.kind === 'bold' }
<strong >{seg.value}</strong>


{/if}

{#if seg.kind === 'handle' }
<a  class="rdp-app__summary-handle"  target="_blank"  rel="noreferrer noopener"  href={`https://bsky.app/profile/${seg.value}`} >
                                      @{seg.value}</a>


{/if}
{/each}
</p>


{/if}

{#if block.kind === 'bullets' }
<ul  class="rdp-app__summary-ul" >
{#each block.items as item }
<li >
{#each item as seg }

{#if seg.kind === 'text' }
{seg.value}


{/if}

{#if seg.kind === 'bold' }
<strong >{seg.value}</strong>


{/if}

{#if seg.kind === 'handle' }
<a  class="rdp-app__summary-handle"  target="_blank"  rel="noreferrer noopener"  href={`https://bsky.app/profile/${seg.value}`} >{seg.value}</a>


{/if}
{/each}
</li>
{/each}
</ul>


{/if}
{/each}
</article>


{/if}


{/if}


{/if}
{#if currentView === 'legal' }
<LegalNoticePage ></LegalNoticePage>


{/if}
{#if currentView === 'terms' }
<TermsOfServicePage ></TermsOfServicePage>


{/if}
{#if currentView === 'contact' }
<ContactPage ></ContactPage>


{/if}
{#if currentView === 'support' }
<SupportPage ></SupportPage>


{/if}
{#if currentView === 'sources' }
<SourcesPage ></SourcesPage>


{/if}</main></div>


{/if}
{#if (layout ?? 'desktop') === 'mobile' }
<main  class="rdp-app__mobile-main"  aria-busy={loading ? 'true' : undefined} >
{#if currentView !== 'main' }
<button  type="button"  class="rdp-app__back"  on:click="{(event) => {goTo('main')}}" >
            ← Retour aux publications
          </button>


{/if}
{#if !captureMode && currentView === 'main' }
<IntroCard ></IntroCard>


{/if}
{#if currentView === 'main' && loading === true }
<Spinner ></Spinner>


{/if}
{#if currentView === 'main' && !loading && posts.length === 0 }
<Alert  variant="empty"  messageKey={emptyMessageKey ?? 'alert.empty.no-content-for-date'} ></Alert>


{/if}
{#if currentView === 'main' && !loading && posts.length > 0 }
<ol  class="rdp-app__post-list" >
{#each posts as post }
<li  class="rdp-app__post-item" ><BlueskyPostCard  post={post}  locale={locale} ></BlueskyPostCard></li>
{/each}
</ol>


{/if}
{#if currentView === 'legal' }
<LegalNoticePage ></LegalNoticePage>


{/if}
{#if currentView === 'terms' }
<TermsOfServicePage ></TermsOfServicePage>


{/if}
{#if currentView === 'contact' }
<ContactPage ></ContactPage>


{/if}
{#if currentView === 'support' }
<SupportPage ></SupportPage>


{/if}
{#if currentView === 'sources' }
<SourcesPage ></SourcesPage>


{/if}
{#if !captureMode }
<BannerAbout  onLegalNoticeClick={(event) => goTo('legal')} onTermsOfServiceClick={(event) => goTo('terms')} onContactClick={(event) => goTo('contact')} onSupportClick={(event) => goTo('support')} onSourcesClick={(event) => goTo('sources')}></BannerAbout>


{/if}</main>

{#if isCalendarOpen }
<Calendar  presentation="sheet"  selectedDate={focusedDate}  locale={locale}  yearRange={yearRange}  minDate={minDate}  onSelect={(d) => pickFromCalendar(d)} onDismiss={(event) => closeCalendar()}></Calendar>


{/if}
<div  class="rdp-app__mobile-dock" ><CalendarActionBar  position="bottom"  date={focusedDate}  locale={locale}  onPillClick={(event) => openCalendar()} onPrev={(event) => prevDay()} onNext={(event) => nextDay()} prevDisabled={prevDayDisabled()}  nextDisabled={nextDayDisabled()} ></CalendarActionBar></div>


{/if}</div>