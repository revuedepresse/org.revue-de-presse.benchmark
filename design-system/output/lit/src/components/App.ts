import  { t } from '../utils/i18n';
import  { formatLegacyShortDay } from '../utils/intl';
import './AppHeader.ts';
import './BlueskyPostCard.ts';
import './Alert.ts';
import './Sidebar.ts';
import './BannerAbout.ts';
import './Calendar.ts';
import './CalendarActionBar.ts';
import './LegalNoticePage.ts';
import './TermsOfServicePage.ts';
import './ContactPage.ts';
import './SupportPage.ts';
import './SourcesPage.ts';
import './DiscuterPage.ts';
import './IntroCard.ts';
import './Spinner.ts';
import './BlueskyPostCard.ts';
import type { SummaryBlock, SummaryInlineSegment } from '../utils/summary-blocks';
import type { Locale } from '../utils/i18n';
import './DiscuterPage.ts';



   import { LitElement, html, css } from 'lit';
   import { customElement, property, state, query } from 'lit/decorators';

   type MainSubView = 'publications' | 'summary'
type SnapshotItem = {
 id: string;
 label: string;
}
type ViewKey = 'main' | 'legal' | 'terms' | 'contact' | 'support' | 'sources' | 'discuter'
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
 captureMode?: boolean;
 discuterStatus?: DiscuterStatus;
 discuterTurns?: DiscuterTurn[];
 discuterCitations?: DiscuterCitation[];
 discuterErrorCode?: DiscuterErrorCode;
 discuterDraft?: string;
 discuterHandleDraft?: string;
 discuterHandleErrorCode?: DiscuterHandleErrorCode;
 onDiscuterLogin?: (handle: string) => void;
 onDiscuterHandleDraftChange?: (next: string) => void;
 onDiscuterDraftChange?: (next: string) => void;
 onDiscuterSend?: (text: string) => void;
 onDiscuterCancel?: () => void;
 onDiscuterClear?: () => void;
 onDiscuterRetry?: () => void;
 /** Day-page sub-view toggle: 'publications' (default) or 'summary'. */
 mainSubView?: MainSubView;
 /** Whether the summary fetch is in flight for the current date. */
 summaryLoading?: boolean;
 /** Pre-parsed summary blocks; empty array when the day has no summary. */
 summaryBlocks?: SummaryBlock[];
 onMainSubViewChange?: (next: MainSubView) => void;
}


   @customElement('my-app')
   export default class App extends LitElement {

       createRenderRoot() {
         return this;
       }







     @property() pickedDate: any
@property() initialView: any
@property() locale: any
@property() onViewChange: any
@property() onDateSelect: any
@property() onLogoClick: any
@property() minDate: any
@property() layout: any
@property() authenticated: any
@property() onAccountClick: any
@property() onMySpaceClick: any
@property() showPopularNews: any
@property() captureMode: any
@property() lists: any
@property() selectedListId: any
@property() yearRange: any
@property() onListSelect: any
@property() loading: any
@property() posts: any
@property() emptyMessageKey: any
@property() mainSubView: any
@property() onMainSubViewChange: any
@property() summaryLoading: any
@property() summaryBlocks: any
@property() discuterStatus: any
@property() discuterTurns: any
@property() discuterCitations: any
@property() discuterErrorCode: any
@property() discuterDraft: any
@property() discuterHandleDraft: any
@property() discuterHandleErrorCode: any
@property() onDiscuterLogin: any
@property() onDiscuterHandleDraftChange: any
@property() onDiscuterDraftChange: any
@property() onDiscuterSend: any
@property() onDiscuterCancel: any
@property() onDiscuterClear: any
@property() onDiscuterRetry: any

       @state()  focusedDate= new Date()
@state()  isCalendarOpen= false
@state()  currentView= 'main'
@state()  initialised= false

        get popularNewsLine() {
 return t('header.popular-news', {
   date: formatLegacyShortDay(this.pickedDate, this.locale ?? 'fr-FR')
 }, this.locale ?? 'fr-FR');
}
prevDay() {
 const next = new Date(this.focusedDate);
 next.setDate(next.getDate() - 1);
 this.focusedDate = next;
 this.currentView = 'main';
 this.onViewChange?.('main');
 this.onDateSelect?.(next);
}
nextDay() {
 const next = new Date(this.focusedDate);
 next.setDate(next.getDate() + 1);
 this.focusedDate = next;
 this.currentView = 'main';
 this.onViewChange?.('main');
 this.onDateSelect?.(next);
}
openCalendar() {
 this.isCalendarOpen = true;
}
closeCalendar() {
 this.isCalendarOpen = false;
}
pickFromCalendar(d: Date) {
 this.focusedDate = d;
 this.isCalendarOpen = false;
 this.currentView = 'main';
 this.onViewChange?.('main');
 this.onDateSelect?.(d);
}
selectFromSidebar(d: Date) {
 this.focusedDate = d;
 this.currentView = 'main';
 this.onViewChange?.('main');
 this.onDateSelect?.(d);
}
goTo(view: ViewKey) {
 this.currentView = view;
 this.onViewChange?.(view);
}
goHome() {
 const yesterday = new Date();
 yesterday.setDate(yesterday.getDate() - 1);
 yesterday.setHours(0, 0, 0, 0);
 this.focusedDate = yesterday;
 this.currentView = 'main';
 this.onViewChange?.('main');
 this.onDateSelect?.(yesterday);
 this.onLogoClick?.();
}
get prevDayDisabled() {
 if (!this.minDate) return false;
 const cur = new Date(this.focusedDate.getFullYear(), this.focusedDate.getMonth(), this.focusedDate.getDate());
 const min = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate());
 return cur.getTime() <= min.getTime();
}
get nextDayDisabled() {
 const yesterday = new Date();
 yesterday.setDate(yesterday.getDate() - 1);
 yesterday.setHours(0, 0, 0, 0);
 const cur = new Date(this.focusedDate.getFullYear(), this.focusedDate.getMonth(), this.focusedDate.getDate());
 return cur.getTime() >= yesterday.getTime();
}


       connectedCallback() { this.focusedDate = this.pickedDate;
if (this.initialView) {
 this.currentView = this.initialView;
}
this.initialised = true }



     render() {
       return html`

          <div  class={`rdp-app rdp-app--${props.layout ?? 'desktop'}`}  data-testid="app-shell" ><div ><div ><app-header  .layout=${this.layout ?? 'desktop'}  .authenticated=${this.authenticated ?? false}  @accountclick=${(event) => this.onAccountClick?.()}  @myspaceclick=${(event) => this.onMySpaceClick?.()}  @logoclick=${(event) => this.goHome()} ></app-header></div></div>
        ${this.showPopularNews === true ?
              html`<p >${this.popularNewsLine}</p>`
            : null}
        ${(this.layout ?? 'desktop') === 'desktop' ?
              html`<div >${!this.captureMode ?
             html`<aside ><my-sidebar  .lists=${this.lists}  .selectedListId=${this.selectedListId}  .selectedDate=${this.pickedDate}  .yearRange=${this.yearRange}  .minDate=${this.minDate}  .locale=${this.locale}  @listselect=${(id) => this.onListSelect?.(id)}  @dateselect=${(d) => this.selectFromSidebar(d)}  @legalnoticeclick=${(event) => this.goTo('legal')}  @termsofserviceclick=${(event) => this.goTo('terms')}  @contactclick=${(event) => this.goTo('contact')}  @supportclick=${(event) => this.goTo('support')}  @sourcesclick=${(event) => this.goTo('sources')}  @discuterclick=${(event) => this.goTo('discuter')} ></my-sidebar></aside>`
           : null}
       <main  aria-busy=${this.loading ? 'true' : undefined} >${this.currentView !== 'main' ?
             html`<button  type="button"  @click=${(event) => this.goTo('main')} >
                        ← Retour aux publications
                      </button>`
           : null}
       ${!this.captureMode && this.currentView === 'main' ?
             html`<intro-card ></intro-card>`
           : null}
       ${this.currentView === 'main' && this.loading === true ?
             html`<my-spinner ></my-spinner>`
           : null}
       ${this.currentView === 'main' && !this.loading && this.posts.length === 0 ?
             html`<my-alert  variant="empty"  .messageKey=${this.emptyMessageKey ?? 'alert.empty.no-content-for-date'} ></my-alert>`
           : null}
       ${this.currentView === 'main' && !this.loading && this.posts.length > 0 ?
             html`<div  role="tablist"  aria-label=${t('day.toggle.ariaLabel')} ><button  class={(props.mainSubView ?? 'publications') === 'publications' ? 'rdp-app__main-toggle-btn rdp-app__main-toggle-btn--active' : 'rdp-app__main-toggle-btn'}  type="button"  role="tab"  aria-selected=${(this.mainSubView ?? 'publications') === 'publications'}  @click=${(event) => this.onMainSubViewChange?.('publications')} >${t('day.toggle.publications')}</button>
        <button  class={props.mainSubView === 'summary' ? 'rdp-app__main-toggle-btn rdp-app__main-toggle-btn--active' : 'rdp-app__main-toggle-btn'}  type="button"  role="tab"  aria-selected=${this.mainSubView === 'summary'}  @click=${(event) => this.onMainSubViewChange?.('summary')} >${t('day.toggle.summary')}</button></div>
        ${(this.mainSubView ?? 'publications') === 'publications' ?
              html`<ol >${this.posts?.map((post, index) => (
             html`<li ><bluesky-post-card  .post=${post}  .locale=${this.locale} ></bluesky-post-card></li>`
           ))}</ol>`
            : null}
        ${this.mainSubView === 'summary' ?
              html`${!!this.summaryLoading ?
             html`<my-spinner ></my-spinner>`
           : null}
       ${!this.summaryLoading && (this.summaryBlocks ?? []).length === 0 ?
             html`<my-alert  variant="empty"  messageKey="day.summary.empty" ></my-alert>`
           : null}
       ${!this.summaryLoading && (this.summaryBlocks ?? []).length > 0 ?
             html`<article >${this.summaryBlocks ?? []?.map((block, index) => (
              html`<my-fragment >${block.kind === 'heading' && block.level === 1 ?
             html`<h2 >${block.segments?.map((seg, index) => (
              html`<my-fragment >${seg.kind === 'text' ?
             html`${seg.value}`
           : null}
       ${seg.kind === 'bold' ?
             html`<strong >${seg.value}</strong>`
           : null}</my-fragment>`
            ))}</h2>`
           : null}
       ${block.kind === 'heading' && block.level === 2 ?
             html`<h3 >${block.segments?.map((seg, index) => (
              html`<my-fragment >${seg.kind === 'text' ?
             html`${seg.value}`
           : null}
       ${seg.kind === 'bold' ?
             html`<strong >${seg.value}</strong>`
           : null}</my-fragment>`
            ))}</h3>`
           : null}
       ${block.kind === 'heading' && block.level === 3 ?
             html`<h4 >${block.segments?.map((seg, index) => (
              html`<my-fragment >${seg.kind === 'text' ?
             html`${seg.value}`
           : null}
       ${seg.kind === 'bold' ?
             html`<strong >${seg.value}</strong>`
           : null}</my-fragment>`
            ))}</h4>`
           : null}
       ${block.kind === 'paragraph' ?
             html`<p >${block.segments?.map((seg, index) => (
              html`<my-fragment >${seg.kind === 'text' ?
             html`${seg.value}`
           : null}
       ${seg.kind === 'bold' ?
             html`<strong >${seg.value}</strong>`
           : null}</my-fragment>`
            ))}</p>`
           : null}
       ${block.kind === 'bullets' ?
             html`<ul >${block.items?.map((item, index) => (
              html`<li >${item?.map((seg, index) => (
             html`<my-fragment >${seg.kind === 'text' ?
              html`${seg.value}`
            : null}
        ${seg.kind === 'bold' ?
              html`<strong >${seg.value}</strong>`
            : null}</my-fragment>`
           ))}</li>`
            ))}</ul>`
           : null}</my-fragment>`
            ))}</article>`
           : null}`
            : null}`
           : null}
       ${this.currentView === 'legal' ?
             html`<legal-notice-page ></legal-notice-page>`
           : null}
       ${this.currentView === 'terms' ?
             html`<terms-of-service-page ></terms-of-service-page>`
           : null}
       ${this.currentView === 'contact' ?
             html`<contact-page ></contact-page>`
           : null}
       ${this.currentView === 'support' ?
             html`<support-page ></support-page>`
           : null}
       ${this.currentView === 'sources' ?
             html`<sources-page ></sources-page>`
           : null}
       ${this.currentView === 'discuter' ?
             html`<discuter-page  .status=${this.discuterStatus ?? 'unauthenticated'}  .turns=${this.discuterTurns}  .citations=${this.discuterCitations}  .errorCode=${this.discuterErrorCode}  .draft=${this.discuterDraft}  .handleDraft=${this.discuterHandleDraft}  .handleErrorCode=${this.discuterHandleErrorCode}  @login=${(handle) => this.onDiscuterLogin?.(handle)}  @handledraftchange=${(next) => this.onDiscuterHandleDraftChange?.(next)}  @draftchange=${(next) => this.onDiscuterDraftChange?.(next)}  @send=${(text) => this.onDiscuterSend?.(text)}  @cancel=${(event) => this.onDiscuterCancel?.()}  @clear=${(event) => this.onDiscuterClear?.()}  @retry=${(event) => this.onDiscuterRetry?.()} ></discuter-page>`
           : null}</main></div>`
            : null}
        ${(this.layout ?? 'desktop') === 'mobile' ?
              html`<main  aria-busy=${this.loading ? 'true' : undefined} >${this.currentView !== 'main' ?
             html`<button  type="button"  @click=${(event) => this.goTo('main')} >
                      ← Retour aux publications
                    </button>`
           : null}
       ${!this.captureMode && this.currentView === 'main' ?
             html`<intro-card ></intro-card>`
           : null}
       ${this.currentView === 'main' && this.loading === true ?
             html`<my-spinner ></my-spinner>`
           : null}
       ${this.currentView === 'main' && !this.loading && this.posts.length === 0 ?
             html`<my-alert  variant="empty"  .messageKey=${this.emptyMessageKey ?? 'alert.empty.no-content-for-date'} ></my-alert>`
           : null}
       ${this.currentView === 'main' && !this.loading && this.posts.length > 0 ?
             html`<ol >${this.posts?.map((post, index) => (
              html`<li ><bluesky-post-card  .post=${post}  .locale=${this.locale} ></bluesky-post-card></li>`
            ))}</ol>`
           : null}
       ${this.currentView === 'legal' ?
             html`<legal-notice-page ></legal-notice-page>`
           : null}
       ${this.currentView === 'terms' ?
             html`<terms-of-service-page ></terms-of-service-page>`
           : null}
       ${this.currentView === 'contact' ?
             html`<contact-page ></contact-page>`
           : null}
       ${this.currentView === 'support' ?
             html`<support-page ></support-page>`
           : null}
       ${this.currentView === 'sources' ?
             html`<sources-page ></sources-page>`
           : null}
       ${this.currentView === 'discuter' ?
             html`<discuter-page  .status=${this.discuterStatus ?? 'unauthenticated'}  .turns=${this.discuterTurns}  .citations=${this.discuterCitations}  .errorCode=${this.discuterErrorCode}  .draft=${this.discuterDraft}  @login=${(event) => this.onDiscuterLogin?.()}  @draftchange=${(next) => this.onDiscuterDraftChange?.(next)}  @send=${(text) => this.onDiscuterSend?.(text)}  @cancel=${(event) => this.onDiscuterCancel?.()}  @clear=${(event) => this.onDiscuterClear?.()}  @retry=${(event) => this.onDiscuterRetry?.()} ></discuter-page>`
           : null}
       ${!this.captureMode ?
             html`<banner-about  @legalnoticeclick=${(event) => this.goTo('legal')}  @termsofserviceclick=${(event) => this.goTo('terms')}  @contactclick=${(event) => this.goTo('contact')}  @supportclick=${(event) => this.goTo('support')}  @sourcesclick=${(event) => this.goTo('sources')}  @discuterclick=${(event) => this.goTo('discuter')} ></banner-about>`
           : null}</main>
       ${this.isCalendarOpen ?
             html`<my-calendar  presentation="sheet"  .selectedDate=${this.focusedDate}  .locale=${this.locale}  .yearRange=${this.yearRange}  .minDate=${this.minDate}  @select=${(d) => this.pickFromCalendar(d)}  @dismiss=${(event) => this.closeCalendar()} ></my-calendar>`
           : null}
       <div ><calendar-action-bar  position="bottom"  .date=${this.focusedDate}  .locale=${this.locale}  @pillclick=${(event) => this.openCalendar()}  @prev=${(event) => this.prevDay()}  @next=${(event) => this.nextDay()}  .prevDisabled=${this.prevDayDisabled}  .nextDisabled=${this.nextDayDisabled} ></calendar-action-bar></div>`
            : null}
        <style >${`
               .rdp-app {
                 background: var(--color-taupe-grey);
                 min-height: 100vh;
                 font-family: "Roboto", sans-serif;
                 color: var(--color-content-text);
               }
               .rdp-app__main-toggle {
                 display: flex;
                 gap: 0;
                 margin: 0 0 var(--separation-2);
                 border: 1.5px solid var(--color-brand);
                 border-radius: var(--radius-default);
                 overflow: hidden;
                 width: fit-content;
               }
               .rdp-app__main-toggle-btn {
                 appearance: none;
                 background: var(--color-white);
                 border: 0;
                 color: var(--color-brand);
                 font-family: inherit;
                 font-size: var(--font-size-status-text);
                 font-weight: 600;
                 padding: 8px 18px;
                 cursor: pointer;
                 line-height: 1.2;
               }
               .rdp-app__main-toggle-btn--active {
                 background: var(--color-brand);
                 color: var(--color-white);
               }
               .rdp-app__main-toggle-btn:not(.rdp-app__main-toggle-btn--active):hover {
                 background: var(--color-taupe-grey);
               }
               .rdp-app__summary {
                 background: var(--color-white);
                 border-radius: var(--radius-default);
                 padding: var(--separation-2);
                 font-size: var(--font-size-content);
                 line-height: var(--line-height-base);
               }
               .rdp-app__summary-h1 {
                 font-family: "Signika", sans-serif;
                 font-size: 1.5rem;
                 color: var(--color-brand);
                 margin: 0 0 var(--separation-2);
               }
               .rdp-app__summary-h2 {
                 font-family: "Signika", sans-serif;
                 font-size: 1.2rem;
                 color: var(--color-brand);
                 margin: var(--separation-2) 0 var(--separation-1);
               }
               .rdp-app__summary-h3 {
                 font-family: "Signika", sans-serif;
                 font-size: 1.05rem;
                 color: var(--color-content-text);
                 margin: var(--separation-2) 0 var(--separation-1);
               }
               .rdp-app__summary-p { margin: 0 0 var(--separation-1); }
               .rdp-app__summary-ul { margin: 0 0 var(--separation-1); padding-left: 1.5em; }
               .rdp-app__summary-ul li { margin-bottom: 4px; }
               /* The header ribbon stays full-viewport-wide so the white band
                  reaches both edges of the page; only the inner row + the content
                  grid honour the legacy max-width. Mobile mirrors the same pattern
                  around a tighter phone width. */
               .rdp-app__header-ribbon {
                 background: var(--color-white);
                 border-bottom: 1px solid var(--color-border);
               }
               .rdp-app__header-inner {
                 max-width: 952px;
                 margin: 0 auto;
               }
               .rdp-app--mobile .rdp-app__header-inner {
                 max-width: 480px;
               }
               /* Drop AppHeader's own white bg + border so the ribbon's full-width
                  band shows through on both sides of the inner row. */
               .rdp-app__header-ribbon .rdp-app-header {
                 background: transparent;
                 border-bottom: none;
               }
               /* Mobile: keep the ribbon full-viewport-wide, constrain the post
                  list + dock to a phone-sized column instead. */
               .rdp-app--mobile .rdp-app__mobile-main {
                 max-width: 480px;
                 margin: 0 auto;
               }
               .rdp-app__popular-news {
                 margin: 0;
                 padding: var(--separation-1) var(--separation-2);
                 font-family: "Signika", sans-serif;
                 font-size: var(--font-size-content);
                 color: var(--color-brand);
                 background: var(--color-white);
                 border-bottom: 1px solid var(--color-border);
                 text-align: center;
               }
               .rdp-app__content {
                 display: grid;
                 grid-template-columns: 1fr;
                 gap: var(--separation-2);
                 padding: var(--separation-2);
                 margin: 0 auto;
                 box-sizing: border-box;
               }
               /* Match the legacy combined sidebar (336px) + right column (600px)
                  plus a 16px gap = $width-desktop = 952px. The header ribbon stays
                  full-viewport-wide; everything below caps here. */
               .rdp-app--desktop .rdp-app__content {
                 grid-template-columns: 336px 1fr;
                 align-items: start;
                 max-width: 952px;
               }
               .rdp-app--desktop .rdp-app__popular-news {
                 max-width: 952px;
                 margin-left: auto;
                 margin-right: auto;
               }
               .rdp-app__main,
               .rdp-app__mobile-main {
                 min-width: 0;
                 display: flex;
                 flex-direction: column;
                 gap: var(--separation-2);
               }
               .rdp-app__mobile-main {
                 padding: var(--separation-2);
                 padding-bottom: calc(64px + var(--separation-2));
               }
               .rdp-app__post-list {
                 list-style: none;
                 margin: 0;
                 padding: 0;
                 display: flex;
                 flex-direction: column;
                 gap: var(--separation-2);
               }
               .rdp-app__post-item { margin: 0; }
               .rdp-app__back {
                 align-self: flex-start;
                 background: var(--color-white);
                 border: 1px solid var(--color-brand);
                 border-radius: var(--radius-default);
                 color: var(--color-brand);
                 padding: var(--separation-1) var(--separation-2);
                 font-family: "Roboto", sans-serif;
                 font-size: var(--font-size-content);
                 cursor: pointer;
               }
               .rdp-app__back:hover { background: var(--color-brand); color: var(--color-white); }
               .rdp-app__column {
                 min-width: 0;
               }
               .rdp-app--mobile { --rdp-mobile-dock-height: 67px; }
               /* Fixed dock + calendar sheet stay centred at the same max-width as
                  the mobile column so a desktop browser previewing the mobile
                  variant doesn't show full-viewport bottom UI. */
               .rdp-app__mobile-dock {
                 position: fixed;
                 left: 50%;
                 transform: translateX(-50%);
                 width: 100%;
                 max-width: 480px;
                 bottom: 0;
                 height: var(--rdp-mobile-dock-height);
                 box-sizing: border-box;
                 background: var(--color-white);
                 padding: 0 var(--separation-2) 0 0;
                 z-index: 20;
                 box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
               }
               .rdp-app--mobile .rdp-calendar-action-bar--bottom {
                 width: 100%;
                 height: 100%;
                 margin: 0;
                 padding: 0 var(--separation-2) 0 0;
                 border-radius: 0;
               }
               .rdp-app--mobile .rdp-calendar--sheet {
                 left: 50%;
                 right: auto;
                 transform: translateX(-50%);
                 width: 100%;
                 max-width: 480px;
                 padding-bottom: var(--rdp-mobile-dock-height);
               }
               .rdp-app--mobile .rdp-calendar__scrim {
                 left: 50%;
                 right: auto;
                 transform: translateX(-50%);
                 width: 100%;
                 max-width: 480px;
                 bottom: var(--rdp-mobile-dock-height);
               }
             `}</style></div>
        `
     }
   }