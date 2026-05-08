<script context='module' lang='ts'>
      type SnapshotItem = {
id: string;
label: string;
}

type ViewKey = 'main' | 'legal' | 'contact' | 'support' | 'sources'

type AppProps = {
layout?: 'mobile' | 'desktop';
authenticated?: boolean;
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
onAccountClick?: () => void;
onMySpaceClick?: () => void;
onListSelect?: (id: string) => void;
onDateSelect?: (date: Date) => void;
onLogoClick?: () => void;
onViewChange?: (view: ViewKey) => void;
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
import  ContactPage from './ContactPage.svelte';
import  SupportPage from './SupportPage.svelte';
import  SourcesPage from './SourcesPage.svelte';
import  IntroCard from './IntroCard.svelte';
import  Spinner from './Spinner.svelte';
import type { BlueskyPost } from './BlueskyPostCard.svelte';
import type { Locale } from '../utils/i18n';





    export let pickedDate: AppProps['pickedDate'];
export let initialView: AppProps['initialView']= undefined;
export let locale: AppProps['locale']= undefined;
export let onViewChange: AppProps['onViewChange']= undefined;
export let onDateSelect: AppProps['onDateSelect']= undefined;
export let onLogoClick: AppProps['onLogoClick']= undefined;
export let minDate: AppProps['minDate']= undefined;
export let layout: AppProps['layout']= undefined;
export let authenticated: AppProps['authenticated']= undefined;
export let onAccountClick: AppProps['onAccountClick']= undefined;
export let onMySpaceClick: AppProps['onMySpaceClick']= undefined;
export let showPopularNews: AppProps['showPopularNews']= undefined;
export let lists: AppProps['lists'];
export let selectedListId: AppProps['selectedListId']= undefined;
export let yearRange: AppProps['yearRange'];
export let onListSelect: AppProps['onListSelect']= undefined;
export let loading: AppProps['loading']= undefined;
export let posts: AppProps['posts'];
export let emptyMessageKey: AppProps['emptyMessageKey']= undefined;



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

  <div  class={`rdp-app rdp-app--${layout ?? 'desktop'}`} ><div  class="rdp-app__header-ribbon" ><div  class="rdp-app__header-inner" ><AppHeader  layout={layout ?? 'desktop'}  authenticated={authenticated ?? false}  onAccountClick={(event) => onAccountClick?.()} onMySpaceClick={(event) => onMySpaceClick?.()} onLogoClick={(event) => goHome()}></AppHeader></div></div>
{#if showPopularNews === true }
<p  class="rdp-app__popular-news" >{popularNewsLine()}</p>


{/if}
{#if (layout ?? 'desktop') === 'desktop' }
<div  class="rdp-app__content" ><aside  class="rdp-app__column" ><Sidebar  lists={lists}  selectedListId={selectedListId}  selectedDate={pickedDate}  yearRange={yearRange}  minDate={minDate}  locale={locale}  onListSelect={(id) => onListSelect?.(id)} onDateSelect={(d) => selectFromSidebar(d)} onLegalNoticeClick={(event) => goTo('legal')} onContactClick={(event) => goTo('contact')} onSupportClick={(event) => goTo('support')} onSourcesClick={(event) => goTo('sources')}></Sidebar></aside><main  class="rdp-app__main"  aria-busy={loading ? 'true' : undefined} >
{#if currentView !== 'main' }
<button  type="button"  class="rdp-app__back"  on:click="{(event) => {goTo('main')}}" >
              ← Retour aux publications
            </button>


{/if}
{#if currentView === 'main' }
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
{#if currentView === 'main' }
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
{#if currentView === 'contact' }
<ContactPage ></ContactPage>


{/if}
{#if currentView === 'support' }
<SupportPage ></SupportPage>


{/if}
{#if currentView === 'sources' }
<SourcesPage ></SourcesPage>


{/if}<BannerAbout  onLegalNoticeClick={(event) => goTo('legal')} onContactClick={(event) => goTo('contact')} onSupportClick={(event) => goTo('support')} onSourcesClick={(event) => goTo('sources')}></BannerAbout></main>

{#if isCalendarOpen }
<Calendar  presentation="sheet"  selectedDate={focusedDate}  locale={locale}  yearRange={yearRange}  minDate={minDate}  onSelect={(d) => pickFromCalendar(d)} onDismiss={(event) => closeCalendar()}></Calendar>


{/if}
<div  class="rdp-app__mobile-dock" ><CalendarActionBar  position="bottom"  date={focusedDate}  locale={locale}  onPillClick={(event) => openCalendar()} onPrev={(event) => prevDay()} onNext={(event) => nextDay()} prevDisabled={prevDayDisabled()}  nextDisabled={nextDayDisabled()} ></CalendarActionBar></div>


{/if}</div>