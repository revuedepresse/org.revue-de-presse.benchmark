import { Show, For, onMount, createSignal, createMemo } from "solid-js";

type SnapshotItem = {
  id: string;
  label: string;
};
type ViewKey = "main" | "legal" | "contact" | "support" | "sources";
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
  initialView?: ViewKey;
  onAccountClick?: () => void;
  onMySpaceClick?: () => void;
  onListSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
  onLogoClick?: () => void;
  onViewChange?: (view: ViewKey) => void;
};

import { t } from "../utils/i18n";
import { formatLegacyShortDay } from "../utils/intl";
import AppHeader from "./AppHeader";
import BlueskyPostCard from "./BlueskyPostCard";
import Alert from "./Alert";
import Sidebar from "./Sidebar";
import BannerAbout from "./BannerAbout";
import Calendar from "./Calendar";
import CalendarActionBar from "./CalendarActionBar";
import LegalNoticePage from "./LegalNoticePage";
import ContactPage from "./ContactPage";
import SupportPage from "./SupportPage";
import SourcesPage from "./SourcesPage";
import IntroCard from "./IntroCard";
import Spinner from "./Spinner";
import type { BlueskyPost } from "./BlueskyPostCard";
import type { Locale } from "../utils/i18n";

function App(props: AppProps) {
  const [focusedDate, setFocusedDate] = createSignal(new Date());

  const [isCalendarOpen, setIsCalendarOpen] = createSignal(false);

  const [currentView, setCurrentView] = createSignal("main");

  const [initialised, setInitialised] = createSignal(false);

  const popularNewsLine = createMemo(() => {
    return t(
      "header.popular-news",
      {
        date: formatLegacyShortDay(props.pickedDate, props.locale ?? "fr-FR"),
      },
      props.locale ?? "fr-FR"
    );
  });

  function prevDay() {
    const next = new Date(focusedDate());
    next.setDate(next.getDate() - 1);
    setFocusedDate(next);
    setCurrentView("main");
    props.onViewChange?.("main");
    props.onDateSelect?.(next);
  }

  function nextDay() {
    const next = new Date(focusedDate());
    next.setDate(next.getDate() + 1);
    setFocusedDate(next);
    setCurrentView("main");
    props.onViewChange?.("main");
    props.onDateSelect?.(next);
  }

  function openCalendar() {
    setIsCalendarOpen(true);
  }

  function closeCalendar() {
    setIsCalendarOpen(false);
  }

  function pickFromCalendar(d: Date) {
    setFocusedDate(d);
    setIsCalendarOpen(false);
    setCurrentView("main");
    props.onViewChange?.("main");
    props.onDateSelect?.(d);
  }

  function selectFromSidebar(d: Date) {
    setFocusedDate(d);
    setCurrentView("main");
    props.onViewChange?.("main");
    props.onDateSelect?.(d);
  }

  function goTo(view: ViewKey) {
    setCurrentView(view);
    props.onViewChange?.(view);
  }

  function goHome() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    setFocusedDate(yesterday);
    setCurrentView("main");
    props.onViewChange?.("main");
    props.onDateSelect?.(yesterday);
    props.onLogoClick?.();
  }

  const prevDayDisabled = createMemo(() => {
    if (!props.minDate) return false;
    const cur = new Date(
      focusedDate().getFullYear(),
      focusedDate().getMonth(),
      focusedDate().getDate()
    );
    const min = new Date(
      props.minDate.getFullYear(),
      props.minDate.getMonth(),
      props.minDate.getDate()
    );
    return cur.getTime() <= min.getTime();
  });

  const nextDayDisabled = createMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const cur = new Date(
      focusedDate().getFullYear(),
      focusedDate().getMonth(),
      focusedDate().getDate()
    );
    return cur.getTime() >= yesterday.getTime();
  });

  onMount(() => {
    setFocusedDate(props.pickedDate);
    if (props.initialView) {
      setCurrentView(props.initialView);
    }
    setInitialised(true);
  });

  return (
    <>
      <div class={`rdp-app rdp-app--${props.layout ?? "desktop"}`}>
        <div class="rdp-app__header-ribbon">
          <div class="rdp-app__header-inner">
            <AppHeader
              layout={props.layout ?? "desktop"}
              authenticated={props.authenticated ?? false}
              onAccountClick={(event) => props.onAccountClick?.()}
              onMySpaceClick={(event) => props.onMySpaceClick?.()}
              onLogoClick={(event) => goHome()}
            ></AppHeader>
          </div>
        </div>
        <Show when={props.showPopularNews === true}>
          <p class="rdp-app__popular-news">{popularNewsLine()}</p>
        </Show>
        <Show when={(props.layout ?? "desktop") === "desktop"}>
          <div class="rdp-app__content">
            <aside class="rdp-app__column">
              <Sidebar
                lists={props.lists}
                selectedListId={props.selectedListId}
                selectedDate={props.pickedDate}
                yearRange={props.yearRange}
                minDate={props.minDate}
                locale={props.locale}
                onListSelect={(id) => props.onListSelect?.(id)}
                onDateSelect={(d) => selectFromSidebar(d)}
                onLegalNoticeClick={(event) => goTo("legal")}
                onContactClick={(event) => goTo("contact")}
                onSupportClick={(event) => goTo("support")}
                onSourcesClick={(event) => goTo("sources")}
              ></Sidebar>
            </aside>
            <main
              class="rdp-app__main"
              aria-busy={props.loading ? "true" : undefined}
            >
              <Show when={currentView() !== "main"}>
                <button
                  class="rdp-app__back"
                  type="button"
                  onClick={(event) => goTo("main")}
                >
                  ← Retour aux publications
                </button>
              </Show>
              <Show when={currentView() === "main"}>
                <IntroCard></IntroCard>
              </Show>
              <Show when={currentView() === "main" && props.loading === true}>
                <Spinner></Spinner>
              </Show>
              <Show
                when={
                  currentView() === "main" &&
                  !props.loading &&
                  props.posts.length === 0
                }
              >
                <Alert
                  variant="empty"
                  messageKey={
                    props.emptyMessageKey ?? "alert.empty.no-content-for-date"
                  }
                ></Alert>
              </Show>
              <Show
                when={
                  currentView() === "main" &&
                  !props.loading &&
                  props.posts.length > 0
                }
              >
                <ol class="rdp-app__post-list">
                  <For each={props.posts}>
                    {(post, _index) => {
                      const index = _index();
                      return (
                        <li class="rdp-app__post-item">
                          <BlueskyPostCard
                            post={post}
                            locale={props.locale}
                          ></BlueskyPostCard>
                        </li>
                      );
                    }}
                  </For>
                </ol>
              </Show>
              <Show when={currentView() === "legal"}>
                <LegalNoticePage></LegalNoticePage>
              </Show>
              <Show when={currentView() === "contact"}>
                <ContactPage></ContactPage>
              </Show>
              <Show when={currentView() === "support"}>
                <SupportPage></SupportPage>
              </Show>
              <Show when={currentView() === "sources"}>
                <SourcesPage></SourcesPage>
              </Show>
            </main>
          </div>
        </Show>
        <Show when={(props.layout ?? "desktop") === "mobile"}>
          <main
            class="rdp-app__mobile-main"
            aria-busy={props.loading ? "true" : undefined}
          >
            <Show when={currentView() !== "main"}>
              <button
                class="rdp-app__back"
                type="button"
                onClick={(event) => goTo("main")}
              >
                ← Retour aux publications
              </button>
            </Show>
            <Show when={currentView() === "main"}>
              <IntroCard></IntroCard>
            </Show>
            <Show when={currentView() === "main" && props.loading === true}>
              <Spinner></Spinner>
            </Show>
            <Show
              when={
                currentView() === "main" &&
                !props.loading &&
                props.posts.length === 0
              }
            >
              <Alert
                variant="empty"
                messageKey={
                  props.emptyMessageKey ?? "alert.empty.no-content-for-date"
                }
              ></Alert>
            </Show>
            <Show
              when={
                currentView() === "main" &&
                !props.loading &&
                props.posts.length > 0
              }
            >
              <ol class="rdp-app__post-list">
                <For each={props.posts}>
                  {(post, _index) => {
                    const index = _index();
                    return (
                      <li class="rdp-app__post-item">
                        <BlueskyPostCard
                          post={post}
                          locale={props.locale}
                        ></BlueskyPostCard>
                      </li>
                    );
                  }}
                </For>
              </ol>
            </Show>
            <Show when={currentView() === "legal"}>
              <LegalNoticePage></LegalNoticePage>
            </Show>
            <Show when={currentView() === "contact"}>
              <ContactPage></ContactPage>
            </Show>
            <Show when={currentView() === "support"}>
              <SupportPage></SupportPage>
            </Show>
            <Show when={currentView() === "sources"}>
              <SourcesPage></SourcesPage>
            </Show>
            <BannerAbout
              onLegalNoticeClick={(event) => goTo("legal")}
              onContactClick={(event) => goTo("contact")}
              onSupportClick={(event) => goTo("support")}
              onSourcesClick={(event) => goTo("sources")}
            ></BannerAbout>
          </main>
          <Show when={isCalendarOpen()}>
            <Calendar
              presentation="sheet"
              selectedDate={focusedDate()}
              locale={props.locale}
              yearRange={props.yearRange}
              minDate={props.minDate}
              onSelect={(d) => pickFromCalendar(d)}
              onDismiss={(event) => closeCalendar()}
            ></Calendar>
          </Show>
          <div class="rdp-app__mobile-dock">
            <CalendarActionBar
              position="bottom"
              date={focusedDate()}
              locale={props.locale}
              onPillClick={(event) => openCalendar()}
              onPrev={(event) => prevDay()}
              onNext={(event) => nextDay()}
              prevDisabled={prevDayDisabled()}
              nextDisabled={nextDayDisabled()}
            ></CalendarActionBar>
          </div>
        </Show>
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
      `}</style>
      </div>
    </>
  );
}

export default App;
