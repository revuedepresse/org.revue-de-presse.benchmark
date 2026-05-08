import { Locale, t } from "../utils/i18n";

import { formatLegacyShortDay } from "../utils/intl";

import Alert from "./Alert.jsx";

import AppHeader from "./AppHeader.jsx";

import BannerAbout from "./BannerAbout.jsx";

import { BlueskyPost, default as BlueskyPostCard } from "./BlueskyPostCard.jsx";

import Calendar from "./Calendar.jsx";

import CalendarActionBar from "./CalendarActionBar.jsx";

import ContactPage from "./ContactPage.jsx";

import IntroCard from "./IntroCard.jsx";

import LegalNoticePage from "./LegalNoticePage.jsx";

import Sidebar from "./Sidebar.jsx";

import SourcesPage from "./SourcesPage.jsx";

import Spinner from "./Spinner.jsx";

import SupportPage from "./SupportPage.jsx";

import {
  $,
  Fragment,
  component$,
  h,
  useComputed$,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";

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
export const prevDay = function prevDay(
  props,
  state,
  popularNewsLine,
  prevDayDisabled,
  nextDayDisabled
) {
  const next = new Date(state.focusedDate);
  next.setDate(next.getDate() - 1);
  state.focusedDate = next;
  state.currentView = "main";
  props.onViewChange?.("main");
  props.onDateSelect?.(next);
};
export const nextDay = function nextDay(
  props,
  state,
  popularNewsLine,
  prevDayDisabled,
  nextDayDisabled
) {
  const next = new Date(state.focusedDate);
  next.setDate(next.getDate() + 1);
  state.focusedDate = next;
  state.currentView = "main";
  props.onViewChange?.("main");
  props.onDateSelect?.(next);
};
export const openCalendar = function openCalendar(
  props,
  state,
  popularNewsLine,
  prevDayDisabled,
  nextDayDisabled
) {
  state.isCalendarOpen = true;
};
export const closeCalendar = function closeCalendar(
  props,
  state,
  popularNewsLine,
  prevDayDisabled,
  nextDayDisabled
) {
  state.isCalendarOpen = false;
};
export const pickFromCalendar = function pickFromCalendar(
  props,
  state,
  popularNewsLine,
  prevDayDisabled,
  nextDayDisabled,
  d: Date
) {
  state.focusedDate = d;
  state.isCalendarOpen = false;
  state.currentView = "main";
  props.onViewChange?.("main");
  props.onDateSelect?.(d);
};
export const selectFromSidebar = function selectFromSidebar(
  props,
  state,
  popularNewsLine,
  prevDayDisabled,
  nextDayDisabled,
  d: Date
) {
  state.focusedDate = d;
  state.currentView = "main";
  props.onViewChange?.("main");
  props.onDateSelect?.(d);
};
export const goTo = function goTo(
  props,
  state,
  popularNewsLine,
  prevDayDisabled,
  nextDayDisabled,
  view: ViewKey
) {
  state.currentView = view;
  props.onViewChange?.(view);
};
export const goHome = function goHome(
  props,
  state,
  popularNewsLine,
  prevDayDisabled,
  nextDayDisabled
) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  state.focusedDate = yesterday;
  state.currentView = "main";
  props.onViewChange?.("main");
  props.onDateSelect?.(yesterday);
  props.onLogoClick?.();
};
export const App = component$((props: AppProps) => {
  const popularNewsLine = useComputed$(() => {
    return t(
      "header.popular-news",
      {
        date: formatLegacyShortDay(props.pickedDate, props.locale ?? "fr-FR"),
      },
      props.locale ?? "fr-FR"
    );
  });
  const prevDayDisabled = useComputed$(() => {
    if (!props.minDate) return false;
    const cur = new Date(
      state.focusedDate.getFullYear(),
      state.focusedDate.getMonth(),
      state.focusedDate.getDate()
    );
    const min = new Date(
      props.minDate.getFullYear(),
      props.minDate.getMonth(),
      props.minDate.getDate()
    );
    return cur.getTime() <= min.getTime();
  });
  const nextDayDisabled = useComputed$(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const cur = new Date(
      state.focusedDate.getFullYear(),
      state.focusedDate.getMonth(),
      state.focusedDate.getDate()
    );
    return cur.getTime() >= yesterday.getTime();
  });
  const state = useStore<any>({
    currentView: "main",
    focusedDate: new Date(),
    initialised: false,
    isCalendarOpen: false,
  });
  useVisibleTask$(() => {
    state.focusedDate = props.pickedDate;
    if (props.initialView) {
      state.currentView = props.initialView;
    }
    state.initialised = true;
  });

  return (
    <div class={`rdp-app rdp-app--${props.layout ?? "desktop"}`}>
      <div class="rdp-app__header-ribbon">
        <div class="rdp-app__header-inner">
          <AppHeader
            layout={props.layout ?? "desktop"}
            authenticated={props.authenticated ?? false}
            onAccountClick$={$((event) => props.onAccountClick?.())}
            onMySpaceClick$={$((event) => props.onMySpaceClick?.())}
            onLogoClick$={$((event) =>
              goHome(
                props,
                state,
                popularNewsLine,
                prevDayDisabled,
                nextDayDisabled
              )
            )}
          ></AppHeader>
        </div>
      </div>
      {props.showPopularNews === true ? (
        <p class="rdp-app__popular-news">{popularNewsLine.value}</p>
      ) : null}
      {(props.layout ?? "desktop") === "desktop" ? (
        <div class="rdp-app__content">
          <aside class="rdp-app__column">
            <Sidebar
              lists={props.lists}
              selectedListId={props.selectedListId}
              selectedDate={props.pickedDate}
              yearRange={props.yearRange}
              minDate={props.minDate}
              locale={props.locale}
              onListSelect$={$((event) => props.onListSelect?.(id))}
              onDateSelect$={$((event) =>
                selectFromSidebar(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled,
                  d
                )
              )}
              onLegalNoticeClick$={$((event) =>
                goTo(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled,
                  "legal"
                )
              )}
              onContactClick$={$((event) =>
                goTo(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled,
                  "contact"
                )
              )}
              onSupportClick$={$((event) =>
                goTo(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled,
                  "support"
                )
              )}
              onSourcesClick$={$((event) =>
                goTo(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled,
                  "sources"
                )
              )}
            ></Sidebar>
          </aside>
          <main
            class="rdp-app__main"
            aria-busy={props.loading ? "true" : undefined}
          >
            {state.currentView !== "main" ? (
              <button
                type="button"
                class="rdp-app__back"
                onClick$={$((event) =>
                  goTo(
                    props,
                    state,
                    popularNewsLine,
                    prevDayDisabled,
                    nextDayDisabled,
                    "main"
                  )
                )}
              >
                ← Retour aux publications
              </button>
            ) : null}
            {state.currentView === "main" ? <IntroCard></IntroCard> : null}
            {state.currentView === "main" && props.loading === true ? (
              <Spinner></Spinner>
            ) : null}
            {state.currentView === "main" &&
            !props.loading &&
            props.posts.length === 0 ? (
              <Alert
                variant="empty"
                messageKey={
                  props.emptyMessageKey ?? "alert.empty.no-content-for-date"
                }
              ></Alert>
            ) : null}
            {state.currentView === "main" &&
            !props.loading &&
            props.posts.length > 0 ? (
              <ol class="rdp-app__post-list">
                {(props.posts || []).map((post) => {
                  return (
                    <li class="rdp-app__post-item">
                      <BlueskyPostCard
                        post={post}
                        locale={props.locale}
                      ></BlueskyPostCard>
                    </li>
                  );
                })}
              </ol>
            ) : null}
            {state.currentView === "legal" ? (
              <LegalNoticePage></LegalNoticePage>
            ) : null}
            {state.currentView === "contact" ? (
              <ContactPage></ContactPage>
            ) : null}
            {state.currentView === "support" ? (
              <SupportPage></SupportPage>
            ) : null}
            {state.currentView === "sources" ? (
              <SourcesPage></SourcesPage>
            ) : null}
          </main>
        </div>
      ) : null}
      {(props.layout ?? "desktop") === "mobile" ? (
        <>
          <main
            class="rdp-app__mobile-main"
            aria-busy={props.loading ? "true" : undefined}
          >
            {state.currentView !== "main" ? (
              <button
                type="button"
                class="rdp-app__back"
                onClick$={$((event) =>
                  goTo(
                    props,
                    state,
                    popularNewsLine,
                    prevDayDisabled,
                    nextDayDisabled,
                    "main"
                  )
                )}
              >
                ← Retour aux publications
              </button>
            ) : null}
            {state.currentView === "main" ? <IntroCard></IntroCard> : null}
            {state.currentView === "main" && props.loading === true ? (
              <Spinner></Spinner>
            ) : null}
            {state.currentView === "main" &&
            !props.loading &&
            props.posts.length === 0 ? (
              <Alert
                variant="empty"
                messageKey={
                  props.emptyMessageKey ?? "alert.empty.no-content-for-date"
                }
              ></Alert>
            ) : null}
            {state.currentView === "main" &&
            !props.loading &&
            props.posts.length > 0 ? (
              <ol class="rdp-app__post-list">
                {(props.posts || []).map((post) => {
                  return (
                    <li class="rdp-app__post-item">
                      <BlueskyPostCard
                        post={post}
                        locale={props.locale}
                      ></BlueskyPostCard>
                    </li>
                  );
                })}
              </ol>
            ) : null}
            {state.currentView === "legal" ? (
              <LegalNoticePage></LegalNoticePage>
            ) : null}
            {state.currentView === "contact" ? (
              <ContactPage></ContactPage>
            ) : null}
            {state.currentView === "support" ? (
              <SupportPage></SupportPage>
            ) : null}
            {state.currentView === "sources" ? (
              <SourcesPage></SourcesPage>
            ) : null}
            <BannerAbout
              onLegalNoticeClick$={$((event) =>
                goTo(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled,
                  "legal"
                )
              )}
              onContactClick$={$((event) =>
                goTo(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled,
                  "contact"
                )
              )}
              onSupportClick$={$((event) =>
                goTo(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled,
                  "support"
                )
              )}
              onSourcesClick$={$((event) =>
                goTo(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled,
                  "sources"
                )
              )}
            ></BannerAbout>
          </main>
          {state.isCalendarOpen ? (
            <Calendar
              presentation="sheet"
              selectedDate={state.focusedDate}
              locale={props.locale}
              yearRange={props.yearRange}
              minDate={props.minDate}
              onSelect$={$((event) =>
                pickFromCalendar(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled,
                  d
                )
              )}
              onDismiss$={$((event) =>
                closeCalendar(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled
                )
              )}
            ></Calendar>
          ) : null}
          <div class="rdp-app__mobile-dock">
            <CalendarActionBar
              position="bottom"
              date={state.focusedDate}
              locale={props.locale}
              onPillClick$={$((event) =>
                openCalendar(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled
                )
              )}
              onPrev$={$((event) =>
                prevDay(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled
                )
              )}
              onNext$={$((event) =>
                nextDay(
                  props,
                  state,
                  popularNewsLine,
                  prevDayDisabled,
                  nextDayDisabled
                )
              )}
              prevDisabled={prevDayDisabled.value}
              nextDisabled={nextDayDisabled.value}
            ></CalendarActionBar>
          </div>
        </>
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
});

export default App;
