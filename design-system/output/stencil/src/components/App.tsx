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
import { IntroCard } from "./IntroCard";
import { Spinner } from "./Spinner";
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
  @Prop() initialView: any;
  @Prop() locale: any;
  @Event() viewChange: any;
  @Event() dateSelect: any;
  @Event() logoClick: any;
  @Prop() minDate: any;
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
    this.currentView = "main";
    this.viewChange?.("main");
    this.dateSelect?.(next);
  }
  nextDay() {
    const next = new Date(this.focusedDate);
    next.setDate(next.getDate() + 1);
    this.focusedDate = next;
    this.currentView = "main";
    this.viewChange?.("main");
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
    this.currentView = "main";
    this.viewChange?.("main");
    this.dateSelect?.(d);
  }
  selectFromSidebar(d: Date) {
    this.focusedDate = d;
    this.currentView = "main";
    this.viewChange?.("main");
    this.dateSelect?.(d);
  }
  goTo(view: ViewKey) {
    this.currentView = view;
    this.viewChange?.(view);
  }
  goHome() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    this.focusedDate = yesterday;
    this.currentView = "main";
    this.viewChange?.("main");
    this.dateSelect?.(yesterday);
    this.logoClick?.();
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

  componentDidLoad() {
    this.focusedDate = this.pickedDate;
    if (this.initialView) {
      this.currentView = this.initialView;
    }
    this.initialised = true;
  }

  render() {
    return (
      <div class={`rdp-app rdp-app--${this.layout ?? "desktop"}`}>
        <div class="rdp-app__header-ribbon">
          <div class="rdp-app__header-inner">
            <app-header
              layout={this.layout ?? "desktop"}
              authenticated={this.authenticated ?? false}
              onAccountClick={() => this.accountClick?.()}
              onMySpaceClick={() => this.mySpaceClick?.()}
              onLogoClick={() => this.goHome()}
            ></app-header>
          </div>
        </div>
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
                minDate={this.minDate}
                locale={this.locale}
                onListSelect={(id) => this.listSelect?.(id)}
                onDateSelect={(d) => this.selectFromSidebar(d)}
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
              {this.currentView === "main" ? <intro-card></intro-card> : null}
              {this.currentView === "main" && this.loading === true ? (
                <spinner></spinner>
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
              {this.currentView === "main" &&
              !this.loading &&
              this.posts.length > 0 ? (
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
              {this.currentView === "main" ? <intro-card></intro-card> : null}
              {this.currentView === "main" && this.loading === true ? (
                <spinner></spinner>
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
              {this.currentView === "main" &&
              !this.loading &&
              this.posts.length > 0 ? (
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
                minDate={this.minDate}
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
                prevDisabled={this.prevDayDisabled}
                nextDisabled={this.nextDayDisabled}
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
      `}</style>
      </div>
    );
  }
}
