import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

type SnapshotItem = {
  id: string;
  label: string;
};
type AppProps = {
  layout?: "mobile" | "desktop";
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
  onAccountClick?: () => void;
  onMySpaceClick?: () => void;
  onListSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
  onLogoClick?: () => void;
};

import { t } from "../utils/i18n";
import { formatLegacyShortDay } from "../utils/intl";
import type { Locale } from "../utils/i18n";

@Component({
  selector: "app",
  template: `
    <div [class]="\`rdp-app rdp-app--\${layout ?? 'desktop'}\`">
      <div class="rdp-app__header-ribbon">
        <div class="rdp-app__header-inner">
          <app-header
            [layout]="layout ?? 'desktop'"
            [authenticated]="authenticated ?? false"
            (accountClick)="onAccountClick?.()"
            (mySpaceClick)="onMySpaceClick?.()"
            (logoClick)="goHome()"
          ></app-header>
        </div>
      </div>
      <ng-container *ngIf="showPopularNews === true"
        ><p class="rdp-app__popular-news">{{popularNewsLine}}</p></ng-container
      >
      <ng-container *ngIf="(layout ?? 'desktop') === 'desktop'"
        ><div class="rdp-app__content">
          <aside class="rdp-app__column">
            <sidebar
              [lists]="lists"
              [selectedListId]="selectedListId"
              [selectedDate]="pickedDate"
              [yearRange]="yearRange"
              [minDate]="minDate"
              [locale]="locale"
              (listSelect)="onListSelect?.($event)"
              (dateSelect)="selectFromSidebar($event)"
              (legalNoticeClick)="goTo('legal')"
              (contactClick)="goTo('contact')"
              (supportClick)="goTo('support')"
              (sourcesClick)="goTo('sources')"
            ></sidebar>
          </aside>
          <main
            class="rdp-app__main"
            [attr.aria-busy]="loading ? 'true' : undefined"
          >
            <ng-container *ngIf="currentView !== 'main'"
              ><button
                type="button"
                class="rdp-app__back"
                (click)="goTo('main')"
              >
                ← Retour aux publications
              </button></ng-container
            >
            <ng-container *ngIf="currentView === 'main'"
              ><intro-card></intro-card
            ></ng-container>
            <ng-container
              *ngIf="currentView === 'main' && !loading && posts.length === 0"
              ><alert
                variant="empty"
                [messageKey]="emptyMessageKey ?? 'alert.empty.no-content-for-date'"
              ></alert
            ></ng-container>
            <ng-container *ngIf="currentView === 'main' && posts.length > 0"
              ><ol class="rdp-app__post-list">
                <ng-container *ngFor="let post of posts"
                  ><li class="rdp-app__post-item">
                    <bluesky-post-card
                      [post]="post"
                      [locale]="locale"
                    ></bluesky-post-card></li
                ></ng-container></ol
            ></ng-container>
            <ng-container *ngIf="currentView === 'legal'"
              ><legal-notice-page></legal-notice-page
            ></ng-container>
            <ng-container *ngIf="currentView === 'contact'"
              ><contact-page></contact-page
            ></ng-container>
            <ng-container *ngIf="currentView === 'support'"
              ><support-page></support-page
            ></ng-container>
            <ng-container *ngIf="currentView === 'sources'"
              ><sources-page></sources-page
            ></ng-container>
          </main></div
      ></ng-container>
      <ng-container *ngIf="(layout ?? 'desktop') === 'mobile'"
        ><main
          class="rdp-app__mobile-main"
          [attr.aria-busy]="loading ? 'true' : undefined"
        >
          <ng-container *ngIf="currentView !== 'main'"
            ><button type="button" class="rdp-app__back" (click)="goTo('main')">
              ← Retour aux publications
            </button></ng-container
          >
          <ng-container *ngIf="currentView === 'main'"
            ><intro-card></intro-card
          ></ng-container>
          <ng-container
            *ngIf="currentView === 'main' && !loading && posts.length === 0"
            ><alert
              variant="empty"
              [messageKey]="emptyMessageKey ?? 'alert.empty.no-content-for-date'"
            ></alert
          ></ng-container>
          <ng-container *ngIf="currentView === 'main' && posts.length > 0"
            ><ol class="rdp-app__post-list">
              <ng-container *ngFor="let post of posts"
                ><li class="rdp-app__post-item">
                  <bluesky-post-card
                    [post]="post"
                    [locale]="locale"
                  ></bluesky-post-card></li
              ></ng-container></ol
          ></ng-container>
          <ng-container *ngIf="currentView === 'legal'"
            ><legal-notice-page></legal-notice-page
          ></ng-container>
          <ng-container *ngIf="currentView === 'contact'"
            ><contact-page></contact-page
          ></ng-container>
          <ng-container *ngIf="currentView === 'support'"
            ><support-page></support-page
          ></ng-container>
          <ng-container *ngIf="currentView === 'sources'"
            ><sources-page></sources-page
          ></ng-container>
          <banner-about
            (legalNoticeClick)="goTo('legal')"
            (contactClick)="goTo('contact')"
            (supportClick)="goTo('support')"
            (sourcesClick)="goTo('sources')"
          ></banner-about>
        </main>
        <ng-container *ngIf="isCalendarOpen"
          ><calendar
            presentation="sheet"
            [selectedDate]="focusedDate"
            [locale]="locale"
            [yearRange]="yearRange"
            [minDate]="minDate"
            (select)="pickFromCalendar($event)"
            (dismiss)="closeCalendar()"
          ></calendar
        ></ng-container>
        <div class="rdp-app__mobile-dock">
          <calendar-action-bar
            position="bottom"
            [date]="focusedDate"
            [locale]="locale"
            (pillClick)="openCalendar()"
            (prev)="prevDay()"
            (next)="nextDay()"
            [prevDisabled]="prevDayDisabled"
            [nextDisabled]="nextDayDisabled"
          ></calendar-action-bar></div
      ></ng-container>
      <style>
        {{\`
                .rdp-app {
                  background: var(--color-taupe-grey);
                  min-height: 100vh;
                  font-family: 'Roboto', sans-serif;
                  color: var(--color-content-text);
                }
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
              \`}}
      </style>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class App {
  t = t;

  @Input() pickedDate!: AppProps["pickedDate"];
  @Input() locale!: AppProps["locale"];
  @Input() onDateSelect!: AppProps["onDateSelect"];
  @Input() onLogoClick!: AppProps["onLogoClick"];
  @Input() minDate!: AppProps["minDate"];
  @Input() layout!: AppProps["layout"];
  @Input() authenticated!: AppProps["authenticated"];
  @Input() onAccountClick!: AppProps["onAccountClick"];
  @Input() onMySpaceClick!: AppProps["onMySpaceClick"];
  @Input() showPopularNews!: AppProps["showPopularNews"];
  @Input() lists!: AppProps["lists"];
  @Input() selectedListId!: AppProps["selectedListId"];
  @Input() yearRange!: AppProps["yearRange"];
  @Input() onListSelect!: AppProps["onListSelect"];
  @Input() loading!: AppProps["loading"];
  @Input() posts!: AppProps["posts"];
  @Input() emptyMessageKey!: AppProps["emptyMessageKey"];

  focusedDate = new Date();
  isCalendarOpen = false;
  currentView = "main";
  initialised = false;
  get popularNewsLine() {
    return t(
      "header.popular-news",
      {
        date: formatLegacyShortDay(this.pickedDate, this.locale ?? "fr-FR"),
      },
      this.locale ?? "fr-FR"
    );
  }
  prevDay() {
    const next = new Date(this.focusedDate);
    next.setDate(next.getDate() - 1);
    this.focusedDate = next;
    this.currentView = "main";
    this.onDateSelect?.(next);
  }
  nextDay() {
    const next = new Date(this.focusedDate);
    next.setDate(next.getDate() + 1);
    this.focusedDate = next;
    this.currentView = "main";
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
    this.currentView = "main";
    this.onDateSelect?.(d);
  }
  selectFromSidebar(d: Date) {
    // The sidebar calendar fires onDateSelect on day-cell taps, prev/next
    // day clicks, and prev/next month clicks. Any of those should bring
    // the publication list back into focus when the user is on a sub-page.
    this.focusedDate = d;
    this.currentView = "main";
    this.onDateSelect?.(d);
  }
  goTo(view: "main" | "legal" | "contact" | "support" | "sources") {
    this.currentView = view;
  }
  goHome() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    this.focusedDate = yesterday;
    this.currentView = "main";
    this.onDateSelect?.(yesterday);
    this.onLogoClick?.();
  }
  get prevDayDisabled() {
    if (!this.minDate) return false;
    const cur = new Date(
      this.focusedDate.getFullYear(),
      this.focusedDate.getMonth(),
      this.focusedDate.getDate()
    );
    const min = new Date(
      this.minDate.getFullYear(),
      this.minDate.getMonth(),
      this.minDate.getDate()
    );
    return cur.getTime() <= min.getTime();
  }
  get nextDayDisabled() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const cur = new Date(
      this.focusedDate.getFullYear(),
      this.focusedDate.getMonth(),
      this.focusedDate.getDate()
    );
    return cur.getTime() >= yesterday.getTime();
  }

  ngOnInit() {
    if (typeof window !== "undefined") {
      this.focusedDate = this.pickedDate;
      this.initialised = true;
    }
  }
}

@NgModule({
  declarations: [App],
  imports: [
    CommonModule,
    AppHeaderModule,
    SidebarModule,
    IntroCardModule,
    AlertModule,
    BlueskyPostCardModule,
    LegalNoticePageModule,
    ContactPageModule,
    SupportPageModule,
    SourcesPageModule,
    BannerAboutModule,
    CalendarModule,
    CalendarActionBarModule,
  ],
  exports: [App],
})
export class AppModule {}
