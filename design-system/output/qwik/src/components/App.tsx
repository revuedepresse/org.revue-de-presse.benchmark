import { Locale, t } from "../utils/i18n";

import { formatLegacyShortDay } from "../utils/intl";

import { SummaryBlock, SummaryInlineSegment } from "../utils/summary-blocks";

import Alert from "./Alert.jsx";

import AppHeader from "./AppHeader.jsx";

import BannerAbout from "./BannerAbout.jsx";

import { BlueskyPost, default as BlueskyPostCard } from "./BlueskyPostCard.jsx";

import Calendar from "./Calendar.jsx";

import CalendarActionBar from "./CalendarActionBar.jsx";

import ContactPage from "./ContactPage.jsx";

import {
  DiscuterCitation,
  DiscuterErrorCode,
  DiscuterHandleErrorCode,
  DiscuterStatus,
  DiscuterTurn,
  default as DiscuterPage,
} from "./DiscuterPage.jsx";

import IntroCard from "./IntroCard.jsx";

import LegalNoticePage from "./LegalNoticePage.jsx";

import Sidebar from "./Sidebar.jsx";

import SourcesPage from "./SourcesPage.jsx";

import Spinner from "./Spinner.jsx";

import SupportPage from "./SupportPage.jsx";

import TermsOfServicePage from "./TermsOfServicePage.jsx";

import {
  $,
  Fragment,
  component$,
  h,
  useComputed$,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";

type MainSubView = "publications" | "summary";

/** Initial sub-view for the day-page, when entered via a URL like
 *  /YYYY-MM-DD/synthese-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
 *  Nuxt so the route is the source of truth. */
/** Initial sub-view for the day-page, when entered via a URL like
 *  /YYYY-MM-DD/synthese-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
 *  Nuxt so the route is the source of truth. */
type InitialMainSubView = MainSubView;
/** Initial sub-view for the day-page, when entered via a URL like
 *  /YYYY-MM-DD/synthese-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
 *  Nuxt so the route is the source of truth. */

type SnapshotItem = {
  id: string;
  label: string;
};
/** Initial sub-view for the day-page, when entered via a URL like
 *  /YYYY-MM-DD/synthese-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
 *  Nuxt so the route is the source of truth. */

type ViewKey =
  | "main"
  | "legal"
  | "terms"
  | "contact"
  | "support"
  | "sources"
  | "discuter";
/** Initial sub-view for the day-page, when entered via a URL like
 *  /YYYY-MM-DD/synthese-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
 *  Nuxt so the route is the source of truth. */

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
  /** Boot-time sub-view from the URL (synthese-du-… vs actualites-du-…).
   *  AppShell uses it to set mainSubView on mount + when the prop changes. */
  initialMainSubView?: InitialMainSubView;
  /** Whether the summary fetch is in flight for the current date. */
  summaryLoading?: boolean;
  /** Pre-parsed summary blocks; empty array when the day has no summary. */
  summaryBlocks?: SummaryBlock[];
  onMainSubViewChange?: (next: MainSubView) => void;
};
export const prevDay = function prevDay(
  props,
  state,
  popularNewsLine,
  synthesisHeadline,
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
  synthesisHeadline,
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
  synthesisHeadline,
  prevDayDisabled,
  nextDayDisabled
) {
  state.isCalendarOpen = true;
};
export const closeCalendar = function closeCalendar(
  props,
  state,
  popularNewsLine,
  synthesisHeadline,
  prevDayDisabled,
  nextDayDisabled
) {
  state.isCalendarOpen = false;
};
export const pickFromCalendar = function pickFromCalendar(
  props,
  state,
  popularNewsLine,
  synthesisHeadline,
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
  synthesisHeadline,
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
  synthesisHeadline,
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
  synthesisHeadline,
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
  const synthesisHeadline = useComputed$(() => {
    return t(
      "header.synthesis",
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
    <div
      data-testid="app-shell"
      class={`rdp-app rdp-app--${props.layout ?? "desktop"}`}
    >
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
                synthesisHeadline,
                prevDayDisabled,
                nextDayDisabled
              )
            )}
          ></AppHeader>
        </div>
      </div>
      {props.showPopularNews === true && props.mainSubView !== "summary" ? (
        <p class="rdp-app__popular-news">{popularNewsLine.value}</p>
      ) : null}
      {(props.layout ?? "desktop") === "desktop" ? (
        <div class="rdp-app__content">
          {!props.captureMode ? (
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
                    synthesisHeadline,
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
                    synthesisHeadline,
                    prevDayDisabled,
                    nextDayDisabled,
                    "legal"
                  )
                )}
                onTermsOfServiceClick$={$((event) =>
                  goTo(
                    props,
                    state,
                    popularNewsLine,
                    synthesisHeadline,
                    prevDayDisabled,
                    nextDayDisabled,
                    "terms"
                  )
                )}
                onContactClick$={$((event) =>
                  goTo(
                    props,
                    state,
                    popularNewsLine,
                    synthesisHeadline,
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
                    synthesisHeadline,
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
                    synthesisHeadline,
                    prevDayDisabled,
                    nextDayDisabled,
                    "sources"
                  )
                )}
                onDiscuterClick$={$((event) =>
                  goTo(
                    props,
                    state,
                    popularNewsLine,
                    synthesisHeadline,
                    prevDayDisabled,
                    nextDayDisabled,
                    "discuter"
                  )
                )}
              ></Sidebar>
            </aside>
          ) : null}
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
                    synthesisHeadline,
                    prevDayDisabled,
                    nextDayDisabled,
                    "main"
                  )
                )}
              >
                ← Retour aux publications
              </button>
            ) : null}
            {!props.captureMode && state.currentView === "main" ? (
              <IntroCard></IntroCard>
            ) : null}
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
              <>
                <div
                  class="rdp-app__main-toggle"
                  role="tablist"
                  aria-label={t("day.toggle.ariaLabel")}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={(() => {
                      (props.mainSubView ?? "publications") === "publications";
                    })()}
                    class={(() => {
                      (props.mainSubView ?? "publications") === "publications"
                        ? "rdp-app__main-toggle-btn rdp-app__main-toggle-btn--active"
                        : "rdp-app__main-toggle-btn";
                    })()}
                    onClick$={$((event) =>
                      props.onMainSubViewChange?.("publications")
                    )}
                  >
                    {t("day.toggle.publications")}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={(() => {
                      props.mainSubView === "summary";
                    })()}
                    class={(() => {
                      props.mainSubView === "summary"
                        ? "rdp-app__main-toggle-btn rdp-app__main-toggle-btn--active"
                        : "rdp-app__main-toggle-btn";
                    })()}
                    onClick$={$((event) =>
                      props.onMainSubViewChange?.("summary")
                    )}
                  >
                    {t("day.toggle.summary")}
                  </button>
                </div>
                {(props.mainSubView ?? "publications") === "publications" ? (
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
                {props.mainSubView === "summary" ? (
                  <>
                    <h1 class="rdp-app__synthesis-title">
                      {synthesisHeadline.value}
                    </h1>
                    {!!props.summaryLoading ? <Spinner></Spinner> : null}
                    {!props.summaryLoading &&
                    (props.summaryBlocks ?? []).length === 0 ? (
                      <Alert
                        variant="empty"
                        messageKey="day.summary.empty"
                      ></Alert>
                    ) : null}
                    {!props.summaryLoading &&
                    (props.summaryBlocks ?? []).length > 0 ? (
                      <article class="rdp-app__summary">
                        {(props.summaryBlocks ?? ([] || [])).map((block) => {
                          return (
                            <Fragment>
                              {block.kind === "paragraph" ? (
                                <p class="rdp-app__summary-p">
                                  {(block.segments || []).map((seg) => {
                                    return (
                                      <Fragment>
                                        {seg.kind === "text" ? (
                                          <>{seg.value}</>
                                        ) : null}
                                        {seg.kind === "bold" ? (
                                          <strong>{seg.value}</strong>
                                        ) : null}
                                        {seg.kind === "handle" ? (
                                          <a
                                            class="rdp-app__summary-handle"
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            href={`https://bsky.app/profile/${seg.value}`}
                                          >
                                            {seg.value}
                                          </a>
                                        ) : null}
                                      </Fragment>
                                    );
                                  })}
                                </p>
                              ) : null}
                              {block.kind === "bullets" ? (
                                <ul class="rdp-app__summary-ul">
                                  {(block.items || []).map((item) => {
                                    return (
                                      <li>
                                        {(item || []).map((seg) => {
                                          return (
                                            <Fragment>
                                              {seg.kind === "text" ? (
                                                <>{seg.value}</>
                                              ) : null}
                                              {seg.kind === "bold" ? (
                                                <strong>{seg.value}</strong>
                                              ) : null}
                                              {seg.kind === "handle" ? (
                                                <a
                                                  class="rdp-app__summary-handle"
                                                  target="_blank"
                                                  rel="noreferrer noopener"
                                                  href={`https://bsky.app/profile/${seg.value}`}
                                                >
                                                  {seg.value}
                                                </a>
                                              ) : null}
                                            </Fragment>
                                          );
                                        })}
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : null}
                            </Fragment>
                          );
                        })}
                      </article>
                    ) : null}
                  </>
                ) : null}
              </>
            ) : null}
            {state.currentView === "legal" ? (
              <LegalNoticePage></LegalNoticePage>
            ) : null}
            {state.currentView === "terms" ? (
              <TermsOfServicePage></TermsOfServicePage>
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
            {state.currentView === "discuter" ? (
              <DiscuterPage
                status={props.discuterStatus ?? "unauthenticated"}
                turns={props.discuterTurns}
                citations={props.discuterCitations}
                errorCode={props.discuterErrorCode}
                draft={props.discuterDraft}
                handleDraft={props.discuterHandleDraft}
                handleErrorCode={props.discuterHandleErrorCode}
                onLogin$={$((event) => props.onDiscuterLogin?.(handle))}
                onHandleDraftChange$={$((event) =>
                  props.onDiscuterHandleDraftChange?.(next)
                )}
                onDraftChange$={$((event) =>
                  props.onDiscuterDraftChange?.(next)
                )}
                onSend$={$((event) => props.onDiscuterSend?.(text))}
                onCancel$={$((event) => props.onDiscuterCancel?.())}
                onClear$={$((event) => props.onDiscuterClear?.())}
                onRetry$={$((event) => props.onDiscuterRetry?.())}
              ></DiscuterPage>
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
                    synthesisHeadline,
                    prevDayDisabled,
                    nextDayDisabled,
                    "main"
                  )
                )}
              >
                ← Retour aux publications
              </button>
            ) : null}
            {!props.captureMode && state.currentView === "main" ? (
              <IntroCard></IntroCard>
            ) : null}
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
            {state.currentView === "terms" ? (
              <TermsOfServicePage></TermsOfServicePage>
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
            {state.currentView === "discuter" ? (
              <DiscuterPage
                status={props.discuterStatus ?? "unauthenticated"}
                turns={props.discuterTurns}
                citations={props.discuterCitations}
                errorCode={props.discuterErrorCode}
                draft={props.discuterDraft}
                onLogin$={$((event) => props.onDiscuterLogin?.())}
                onDraftChange$={$((event) =>
                  props.onDiscuterDraftChange?.(next)
                )}
                onSend$={$((event) => props.onDiscuterSend?.(text))}
                onCancel$={$((event) => props.onDiscuterCancel?.())}
                onClear$={$((event) => props.onDiscuterClear?.())}
                onRetry$={$((event) => props.onDiscuterRetry?.())}
              ></DiscuterPage>
            ) : null}
            {!props.captureMode ? (
              <BannerAbout
                onLegalNoticeClick$={$((event) =>
                  goTo(
                    props,
                    state,
                    popularNewsLine,
                    synthesisHeadline,
                    prevDayDisabled,
                    nextDayDisabled,
                    "legal"
                  )
                )}
                onTermsOfServiceClick$={$((event) =>
                  goTo(
                    props,
                    state,
                    popularNewsLine,
                    synthesisHeadline,
                    prevDayDisabled,
                    nextDayDisabled,
                    "terms"
                  )
                )}
                onContactClick$={$((event) =>
                  goTo(
                    props,
                    state,
                    popularNewsLine,
                    synthesisHeadline,
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
                    synthesisHeadline,
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
                    synthesisHeadline,
                    prevDayDisabled,
                    nextDayDisabled,
                    "sources"
                  )
                )}
                onDiscuterClick$={$((event) =>
                  goTo(
                    props,
                    state,
                    popularNewsLine,
                    synthesisHeadline,
                    prevDayDisabled,
                    nextDayDisabled,
                    "discuter"
                  )
                )}
              ></BannerAbout>
            ) : null}
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
                  synthesisHeadline,
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
                  synthesisHeadline,
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
                  synthesisHeadline,
                  prevDayDisabled,
                  nextDayDisabled
                )
              )}
              onPrev$={$((event) =>
                prevDay(
                  props,
                  state,
                  popularNewsLine,
                  synthesisHeadline,
                  prevDayDisabled,
                  nextDayDisabled
                )
              )}
              onNext$={$((event) =>
                nextDay(
                  props,
                  state,
                  popularNewsLine,
                  synthesisHeadline,
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
          font-family: Roboto, sans-serif;
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
          font-family: Signika, sans-serif;
          font-size: 1.5rem;
          color: var(--color-brand);
          margin: 0 0 var(--separation-2);
        }
        .rdp-app__summary-h2 {
          font-family: Signika, sans-serif;
          font-size: 1.2rem;
          color: var(--color-brand);
          margin: var(--separation-2) 0 var(--separation-1);
        }
        .rdp-app__summary-h3 {
          font-family: Signika, sans-serif;
          font-size: 1.05rem;
          color: var(--color-content-text);
          margin: var(--separation-2) 0 var(--separation-1);
        }
        .rdp-app__summary-p { margin: 0 0 var(--separation-1); }
        .rdp-app__summary-ul { margin: 0 0 var(--separation-1); padding-left: 1.5em; }
        .rdp-app__summary-ul li { margin-bottom: 4px; }
        .rdp-app__summary-handle {
          color: var(--color-brand);
          text-decoration: none;
          border-bottom: 1px solid currentColor;
        }
        .rdp-app__summary-handle:hover { color: var(--color-brand-active); }
        .rdp-app__synthesis-title {
          font-family: Signika, sans-serif;
          font-size: 1.6rem;
          color: var(--color-brand);
          margin: 0 0 var(--separation-2);
          line-height: 1.2;
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
        /* Drop AppHeader’s own white bg + border so the ribbon’s full-width
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
          font-family: Signika, sans-serif;
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
          font-family: Roboto, sans-serif;
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
