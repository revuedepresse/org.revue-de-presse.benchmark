import { t } from "../utils/i18n";
import { formatLegacyShortDay } from "../utils/intl";
import { AppHeader } from "./AppHeader";
import { BlueskyPostCard } from "./BlueskyPostCard";
import { Alert } from "./Alert";
import { Sidebar } from "./Sidebar";
import { BannerAbout } from "./BannerAbout";
import { Calendar } from "./Calendar";
import { CalendarActionBar } from "./CalendarActionBar";
import { LegalNoticePage } from "./LegalNoticePage";
import { ContactPage } from "./ContactPage";
import { SupportPage } from "./SupportPage";
import { SourcesPage } from "./SourcesPage";
import type { BlueskyPost } from "./BlueskyPostCard";
import type { Locale } from "../utils/i18n";

import {
  Component,
  h,
  Fragment,
  Event,
  EventEmitter,
  Prop,
  State,
} from "@stencil/core";

@Component({
  tag: "app",
})
export class App {
  @Prop() pickedDate: any;
  @Prop() locale: any;
  @Event() dateSelect: any;
  @Prop() layout: any;
  @Prop() authenticated: any;
  @Event() accountClick: any;
  @Event() mySpaceClick: any;
  @Prop() showPopularNews: any;
  @Prop() lists: any;
  @Prop() selectedListId: any;
  @Prop() yearRange: any;
  @Event() listSelect: any;
  @Prop() loading: any;
  @Prop() posts: any;
  @Prop() emptyMessageKey: any;
  @State() focusedDate = new Date();
  @State() isCalendarOpen = false;
  @State() currentView = "main";
  @State() initialised = false;

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
    this.dateSelect?.(next);
  }
  nextDay() {
    const next = new Date(this.focusedDate);
    next.setDate(next.getDate() + 1);
    this.focusedDate = next;
    this.dateSelect?.(next);
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
    this.dateSelect?.(d);
  }
  goTo(view: "main" | "legal" | "contact" | "support" | "sources") {
    this.currentView = view;
  }

  componentDidLoad() {
    this.focusedDate = this.pickedDate;
    this.initialised = true;
  }

  render() {
    return (
      <div class={`rdp-app rdp-app--${this.layout ?? "desktop"}`}>
        <app-header
          layout={this.layout ?? "desktop"}
          authenticated={this.authenticated ?? false}
          onAccountClick={() => this.accountClick?.()}
          onMySpaceClick={() => this.mySpaceClick?.()}
        ></app-header>
        {this.showPopularNews === true ? (
          <p class="rdp-app__popular-news">{this.popularNewsLine}</p>
        ) : null}
        {(this.layout ?? "desktop") === "desktop" ? (
          <div class="rdp-app__content">
            <aside class="rdp-app__column">
              <sidebar
                lists={this.lists}
                selectedListId={this.selectedListId}
                selectedDate={this.pickedDate}
                yearRange={this.yearRange}
                locale={this.locale}
                onListSelect={(id) => this.listSelect?.(id)}
                onDateSelect={(d) => this.dateSelect?.(d)}
                onLegalNoticeClick={() => this.goTo("legal")}
                onContactClick={() => this.goTo("contact")}
                onSupportClick={() => this.goTo("support")}
                onSourcesClick={() => this.goTo("sources")}
              ></sidebar>
            </aside>
            <main
              class="rdp-app__main"
              aria-busy={this.loading ? "true" : undefined}
            >
              {this.currentView !== "main" ? (
                <button
                  class="rdp-app__back"
                  type="button"
                  onClick={() => this.goTo("main")}
                >
                  ← Retour aux publications
                </button>
              ) : null}
              {this.currentView === "main" &&
              !this.loading &&
              this.posts.length === 0 ? (
                <alert
                  variant="empty"
                  messageKey={
                    this.emptyMessageKey ?? "alert.empty.no-content-for-date"
                  }
                ></alert>
              ) : null}
              {this.currentView === "main" && this.posts.length > 0 ? (
                <ol class="rdp-app__post-list">
                  {this.posts?.map((post) => (
                    <li class="rdp-app__post-item">
                      <bluesky-post-card
                        post={post}
                        locale={this.locale}
                      ></bluesky-post-card>
                    </li>
                  ))}
                </ol>
              ) : null}
              {this.currentView === "legal" ? (
                <legal-notice-page></legal-notice-page>
              ) : null}
              {this.currentView === "contact" ? (
                <contact-page></contact-page>
              ) : null}
              {this.currentView === "support" ? (
                <support-page></support-page>
              ) : null}
              {this.currentView === "sources" ? (
                <sources-page></sources-page>
              ) : null}
            </main>
          </div>
        ) : null}
        {(this.layout ?? "desktop") === "mobile" ? (
          <Fragment>
            <main
              class="rdp-app__mobile-main"
              aria-busy={this.loading ? "true" : undefined}
            >
              {this.currentView !== "main" ? (
                <button
                  class="rdp-app__back"
                  type="button"
                  onClick={() => this.goTo("main")}
                >
                  ← Retour aux publications
                </button>
              ) : null}
              {this.currentView === "main" &&
              !this.loading &&
              this.posts.length === 0 ? (
                <alert
                  variant="empty"
                  messageKey={
                    this.emptyMessageKey ?? "alert.empty.no-content-for-date"
                  }
                ></alert>
              ) : null}
              {this.currentView === "main" && this.posts.length > 0 ? (
                <ol class="rdp-app__post-list">
                  {this.posts?.map((post) => (
                    <li class="rdp-app__post-item">
                      <bluesky-post-card
                        post={post}
                        locale={this.locale}
                      ></bluesky-post-card>
                    </li>
                  ))}
                </ol>
              ) : null}
              {this.currentView === "legal" ? (
                <legal-notice-page></legal-notice-page>
              ) : null}
              {this.currentView === "contact" ? (
                <contact-page></contact-page>
              ) : null}
              {this.currentView === "support" ? (
                <support-page></support-page>
              ) : null}
              {this.currentView === "sources" ? (
                <sources-page></sources-page>
              ) : null}
              <banner-about
                onLegalNoticeClick={() => this.goTo("legal")}
                onContactClick={() => this.goTo("contact")}
                onSupportClick={() => this.goTo("support")}
                onSourcesClick={() => this.goTo("sources")}
              ></banner-about>
            </main>
            {this.isCalendarOpen ? (
              <calendar
                presentation="sheet"
                selectedDate={this.focusedDate}
                locale={this.locale}
                yearRange={this.yearRange}
                onSelect={(d) => this.pickFromCalendar(d)}
                onDismiss={() => this.closeCalendar()}
              ></calendar>
            ) : null}
            <div class="rdp-app__mobile-dock">
              <calendar-action-bar
                position="bottom"
                date={this.focusedDate}
                locale={this.locale}
                onPillClick={() => this.openCalendar()}
                onPrev={() => this.prevDay()}
                onNext={() => this.nextDay()}
              ></calendar-action-bar>
            </div>
          </Fragment>
        ) : null}
        <style>{`
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
      `}</style>
      </div>
    );
  }
}
