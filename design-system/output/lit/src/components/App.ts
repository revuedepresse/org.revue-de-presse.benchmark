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
import './ContactPage.ts';
import './SupportPage.ts';
import './SourcesPage.ts';
import './BlueskyPostCard.ts';
import type { Locale } from '../utils/i18n';



   import { LitElement, html, css } from 'lit';
   import { customElement, property, state, query } from 'lit/decorators';

   type SnapshotItem = {
 id: string;
 label: string;
}
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
 loading?: boolean;
 emptyMessageKey?: string;
 showPopularNews?: boolean;
 locale?: Locale;
 onAccountClick?: () => void;
 onMySpaceClick?: () => void;
 onListSelect?: (id: string) => void;
 onDateSelect?: (date: Date) => void;
}


   @customElement('my-app')
   export default class App extends LitElement {

       createRenderRoot() {
         return this;
       }







     @property() pickedDate: any
@property() locale: any
@property() onDateSelect: any
@property() layout: any
@property() authenticated: any
@property() onAccountClick: any
@property() onMySpaceClick: any
@property() showPopularNews: any
@property() lists: any
@property() selectedListId: any
@property() yearRange: any
@property() onListSelect: any
@property() loading: any
@property() posts: any
@property() emptyMessageKey: any

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
 this.onDateSelect?.(next);
}
nextDay() {
 const next = new Date(this.focusedDate);
 next.setDate(next.getDate() + 1);
 this.focusedDate = next;
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
 this.onDateSelect?.(d);
}
goTo(view: 'main' | 'legal' | 'contact' | 'support' | 'sources') {
 this.currentView = view;
}


       connectedCallback() { this.focusedDate = this.pickedDate;
this.initialised = true }



     render() {
       return html`

          <div  class={`rdp-app rdp-app--${props.layout ?? 'desktop'}`} ><app-header  .layout=${this.layout ?? 'desktop'}  .authenticated=${this.authenticated ?? false}  @accountclick=${(event) => this.onAccountClick?.()}  @myspaceclick=${(event) => this.onMySpaceClick?.()} ></app-header>
        ${this.showPopularNews === true ?
              html`<p >${this.popularNewsLine}</p>`
            : null}
        ${(this.layout ?? 'desktop') === 'desktop' ?
              html`<div ><aside ><my-sidebar  .lists=${this.lists}  .selectedListId=${this.selectedListId}  .selectedDate=${this.pickedDate}  .yearRange=${this.yearRange}  .locale=${this.locale}  @listselect=${(id) => this.onListSelect?.(id)}  @dateselect=${(d) => this.onDateSelect?.(d)}  @legalnoticeclick=${(event) => this.goTo('legal')}  @contactclick=${(event) => this.goTo('contact')}  @supportclick=${(event) => this.goTo('support')}  @sourcesclick=${(event) => this.goTo('sources')} ></my-sidebar></aside>
       <main  aria-busy=${this.loading ? 'true' : undefined} >${this.currentView !== 'main' ?
             html`<button  type="button"  @click=${(event) => this.goTo('main')} >
                        ← Retour aux publications
                      </button>`
           : null}
       ${this.currentView === 'main' && !this.loading && this.posts.length === 0 ?
             html`<my-alert  variant="empty"  .messageKey=${this.emptyMessageKey ?? 'alert.empty.no-content-for-date'} ></my-alert>`
           : null}
       ${this.currentView === 'main' && this.posts.length > 0 ?
             html`<ol >${this.posts?.map((post, index) => (
              html`<li ><bluesky-post-card  .post=${post}  .locale=${this.locale} ></bluesky-post-card></li>`
            ))}</ol>`
           : null}
       ${this.currentView === 'legal' ?
             html`<legal-notice-page ></legal-notice-page>`
           : null}
       ${this.currentView === 'contact' ?
             html`<contact-page ></contact-page>`
           : null}
       ${this.currentView === 'support' ?
             html`<support-page ></support-page>`
           : null}
       ${this.currentView === 'sources' ?
             html`<sources-page ></sources-page>`
           : null}</main></div>`
            : null}
        ${(this.layout ?? 'desktop') === 'mobile' ?
              html`<main  aria-busy=${this.loading ? 'true' : undefined} >${this.currentView !== 'main' ?
             html`<button  type="button"  @click=${(event) => this.goTo('main')} >
                      ← Retour aux publications
                    </button>`
           : null}
       ${this.currentView === 'main' && !this.loading && this.posts.length === 0 ?
             html`<my-alert  variant="empty"  .messageKey=${this.emptyMessageKey ?? 'alert.empty.no-content-for-date'} ></my-alert>`
           : null}
       ${this.currentView === 'main' && this.posts.length > 0 ?
             html`<ol >${this.posts?.map((post, index) => (
              html`<li ><bluesky-post-card  .post=${post}  .locale=${this.locale} ></bluesky-post-card></li>`
            ))}</ol>`
           : null}
       ${this.currentView === 'legal' ?
             html`<legal-notice-page ></legal-notice-page>`
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
       <banner-about  @legalnoticeclick=${(event) => this.goTo('legal')}  @contactclick=${(event) => this.goTo('contact')}  @supportclick=${(event) => this.goTo('support')}  @sourcesclick=${(event) => this.goTo('sources')} ></banner-about></main>
       ${this.isCalendarOpen ?
             html`<my-calendar  presentation="sheet"  .selectedDate=${this.focusedDate}  .locale=${this.locale}  .yearRange=${this.yearRange}  @select=${(d) => this.pickFromCalendar(d)}  @dismiss=${(event) => this.closeCalendar()} ></my-calendar>`
           : null}
       <div ><calendar-action-bar  position="bottom"  .date=${this.focusedDate}  .locale=${this.locale}  @pillclick=${(event) => this.openCalendar()}  @prev=${(event) => this.prevDay()}  @next=${(event) => this.nextDay()} ></calendar-action-bar></div>`
            : null}
        <style >${`
               .rdp-app {
                 background: var(--color-taupe-grey);
                 min-height: 100vh;
                 font-family: 'Roboto', sans-serif;
                 color: var(--color-content-text);
               }
               /* Both layouts cap at a max-width so the app stays centred on wider
                  viewports. Desktop tracks the legacy $width-extra-large-device
                  (1200px); mobile tracks a comfortable phone width (480px). */
               .rdp-app--desktop {
                 max-width: 1200px;
                 margin: 0 auto;
               }
               .rdp-app--mobile {
                 max-width: 480px;
                 margin: 0 auto;
               }
               .rdp-app__popular-news {
                 margin: 0;
                 padding: var(--separation-1) var(--separation-2);
                 font-family: 'Signika', sans-serif;
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
               .rdp-app--desktop .rdp-app__content {
                 grid-template-columns: 336px 1fr;
                 align-items: start;
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
                 font-family: 'Roboto', sans-serif;
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
                 border-top: 1px solid var(--color-border);
                 padding: var(--separation-1) var(--separation-2);
                 z-index: 20;
                 box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
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