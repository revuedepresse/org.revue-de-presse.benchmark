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
  loading?: boolean;
  emptyMessageKey?: string;
  showPopularNews?: boolean;
  locale?: Locale;
  onAccountClick?: () => void;
  onMySpaceClick?: () => void;
  onListSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
};

import { t } from "../utils/i18n";
import { formatLegacyShortDay } from "../utils/intl";
import type { Locale } from "../utils/i18n";

@Component({
  selector: "app",
  template: `
    <div [class]="\`rdp-app rdp-app--\${layout ?? 'desktop'}\`">
      <app-header
        [layout]="layout ?? 'desktop'"
        [authenticated]="authenticated ?? false"
        (accountClick)="onAccountClick?.()"
        (mySpaceClick)="onMySpaceClick?.()"
      ></app-header>
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
              [locale]="locale"
              (listSelect)="onListSelect?.($event)"
              (dateSelect)="onDateSelect?.($event)"
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
  goTo(view: "main" | "legal" | "contact" | "support" | "sources") {
    this.currentView = view;
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
