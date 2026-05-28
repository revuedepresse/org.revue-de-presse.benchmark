<template>
  <div
    data-testid="app-shell"
    :class="`rdp-app rdp-app--${layout ?? 'desktop'}`"
  >
    <div class="rdp-app__header-ribbon">
      <div class="rdp-app__header-inner">
        <AppHeader
          :layout="layout ?? 'desktop'"
          :authenticated="authenticated ?? false"
          :onAccountClick="(event) => onAccountClick?.()"
          :onMySpaceClick="(event) => onMySpaceClick?.()"
          :onLogoClick="(event) => goHome()"
        ></AppHeader>
      </div>
    </div>
    <template v-if="showPopularNews === true">
      <p class="rdp-app__popular-news">{{ popularNewsLine }}</p>
    </template>

    <template v-if="(layout ?? 'desktop') === 'desktop'">
      <div class="rdp-app__content">
        <template v-if="!captureMode">
          <aside class="rdp-app__column">
            <Sidebar
              :lists="lists"
              :selectedListId="selectedListId"
              :selectedDate="pickedDate"
              :yearRange="yearRange"
              :minDate="minDate"
              :locale="locale"
              :onListSelect="(id) => onListSelect?.(id)"
              :onDateSelect="(d) => selectFromSidebar(d)"
              :onLegalNoticeClick="(event) => goTo('legal')"
              :onTermsOfServiceClick="(event) => goTo('terms')"
              :onContactClick="(event) => goTo('contact')"
              :onSupportClick="(event) => goTo('support')"
              :onSourcesClick="(event) => goTo('sources')"
              :onDiscuterClick="(event) => goTo('discuter')"
            ></Sidebar>
          </aside>
        </template>

        <main class="rdp-app__main" :aria-busy="loading ? 'true' : undefined">
          <template v-if="currentView !== 'main'">
            <button
              type="button"
              class="rdp-app__back"
              @click="async (event) => goTo('main')"
            >
              ← Retour aux publications
            </button>
          </template>

          <template v-if="!captureMode && currentView === 'main'">
            <IntroCard></IntroCard>
          </template>

          <template v-if="currentView === 'main' && loading === true">
            <Spinner></Spinner>
          </template>

          <template
            v-if="currentView === 'main' && !loading && posts.length === 0"
          >
            <Alert
              variant="empty"
              :messageKey="emptyMessageKey ?? 'alert.empty.no-content-for-date'"
            ></Alert>
          </template>

          <template
            v-if="currentView === 'main' && !loading && posts.length > 0"
          >
            <div
              class="rdp-app__main-toggle"
              role="tablist"
              :aria-label="t('day.toggle.ariaLabel')"
            >
              <button
                type="button"
                role="tab"
                :aria-selected="
                  (mainSubView ?? 'publications') === 'publications'
                "
                :class="
                  (mainSubView ?? 'publications') === 'publications'
                    ? 'rdp-app__main-toggle-btn rdp-app__main-toggle-btn--active'
                    : 'rdp-app__main-toggle-btn'
                "
                @click="async (event) => onMainSubViewChange?.('publications')"
              >
                {{ t("day.toggle.publications") }}</button
              ><button
                type="button"
                role="tab"
                :aria-selected="mainSubView === 'summary'"
                :class="
                  mainSubView === 'summary'
                    ? 'rdp-app__main-toggle-btn rdp-app__main-toggle-btn--active'
                    : 'rdp-app__main-toggle-btn'
                "
                @click="async (event) => onMainSubViewChange?.('summary')"
              >
                {{ t("day.toggle.summary") }}
              </button>
            </div>

            <template v-if="(mainSubView ?? 'publications') === 'publications'">
              <ol class="rdp-app__post-list">
                <template :key="index" v-for="(post, index) in posts">
                  <li class="rdp-app__post-item">
                    <BlueskyPostCard
                      :post="post"
                      :locale="locale"
                    ></BlueskyPostCard>
                  </li>
                </template>
              </ol>
            </template>

            <template v-if="mainSubView === 'summary'">
              <template v-if="!!summaryLoading">
                <Spinner></Spinner>
              </template>

              <template
                v-if="!summaryLoading && (summaryBlocks ?? []).length === 0"
              >
                <Alert variant="empty" messageKey="day.summary.empty"></Alert>
              </template>

              <template
                v-if="!summaryLoading && (summaryBlocks ?? []).length > 0"
              >
                <article class="rdp-app__summary">
                  <template
                    :key="index"
                    v-for="(block, index) in summaryBlocks ?? []"
                  >
                    <template
                      v-if="block.kind === 'heading' && block.level === 1"
                    >
                      <h2 class="rdp-app__summary-h1">
                        <template
                          :key="index"
                          v-for="(seg, index) in block.segments"
                        >
                          <template v-if="seg.kind === 'text'">
                            {{ seg.value }}
                          </template>

                          <template v-if="seg.kind === 'bold'">
                            <strong>{{ seg.value }}</strong>
                          </template>
                        </template>
                      </h2>
                    </template>

                    <template
                      v-if="block.kind === 'heading' && block.level === 2"
                    >
                      <h3 class="rdp-app__summary-h2">
                        <template
                          :key="index"
                          v-for="(seg, index) in block.segments"
                        >
                          <template v-if="seg.kind === 'text'">
                            {{ seg.value }}
                          </template>

                          <template v-if="seg.kind === 'bold'">
                            <strong>{{ seg.value }}</strong>
                          </template>
                        </template>
                      </h3>
                    </template>

                    <template
                      v-if="block.kind === 'heading' && block.level === 3"
                    >
                      <h4 class="rdp-app__summary-h3">
                        <template
                          :key="index"
                          v-for="(seg, index) in block.segments"
                        >
                          <template v-if="seg.kind === 'text'">
                            {{ seg.value }}
                          </template>

                          <template v-if="seg.kind === 'bold'">
                            <strong>{{ seg.value }}</strong>
                          </template>
                        </template>
                      </h4>
                    </template>

                    <template v-if="block.kind === 'paragraph'">
                      <p class="rdp-app__summary-p">
                        <template
                          :key="index"
                          v-for="(seg, index) in block.segments"
                        >
                          <template v-if="seg.kind === 'text'">
                            {{ seg.value }}
                          </template>

                          <template v-if="seg.kind === 'bold'">
                            <strong>{{ seg.value }}</strong>
                          </template>
                        </template>
                      </p>
                    </template>

                    <template v-if="block.kind === 'bullets'">
                      <ul class="rdp-app__summary-ul">
                        <template
                          :key="index"
                          v-for="(item, index) in block.items"
                        >
                          <li>
                            <template :key="index" v-for="(seg, index) in item">
                              <template v-if="seg.kind === 'text'">
                                {{ seg.value }}
                              </template>

                              <template v-if="seg.kind === 'bold'">
                                <strong>{{ seg.value }}</strong>
                              </template>
                            </template>
                          </li>
                        </template>
                      </ul>
                    </template>
                  </template>
                </article>
              </template>
            </template>
          </template>

          <template v-if="currentView === 'legal'">
            <LegalNoticePage></LegalNoticePage>
          </template>

          <template v-if="currentView === 'terms'">
            <TermsOfServicePage></TermsOfServicePage>
          </template>

          <template v-if="currentView === 'contact'">
            <ContactPage></ContactPage>
          </template>

          <template v-if="currentView === 'support'">
            <SupportPage></SupportPage>
          </template>

          <template v-if="currentView === 'sources'">
            <SourcesPage></SourcesPage>
          </template>

          <template v-if="currentView === 'discuter'">
            <DiscuterPage
              :status="discuterStatus ?? 'unauthenticated'"
              :turns="discuterTurns"
              :citations="discuterCitations"
              :errorCode="discuterErrorCode"
              :draft="discuterDraft"
              :handleDraft="discuterHandleDraft"
              :handleErrorCode="discuterHandleErrorCode"
              :onLogin="(handle) => onDiscuterLogin?.(handle)"
              :onHandleDraftChange="
                (next) => onDiscuterHandleDraftChange?.(next)
              "
              :onDraftChange="(next) => onDiscuterDraftChange?.(next)"
              :onSend="(text) => onDiscuterSend?.(text)"
              :onCancel="(event) => onDiscuterCancel?.()"
              :onClear="(event) => onDiscuterClear?.()"
              :onRetry="(event) => onDiscuterRetry?.()"
            ></DiscuterPage>
          </template>
        </main>
      </div>
    </template>

    <template v-if="(layout ?? 'desktop') === 'mobile'">
      <main
        class="rdp-app__mobile-main"
        :aria-busy="loading ? 'true' : undefined"
      >
        <template v-if="currentView !== 'main'">
          <button
            type="button"
            class="rdp-app__back"
            @click="async (event) => goTo('main')"
          >
            ← Retour aux publications
          </button>
        </template>

        <template v-if="!captureMode && currentView === 'main'">
          <IntroCard></IntroCard>
        </template>

        <template v-if="currentView === 'main' && loading === true">
          <Spinner></Spinner>
        </template>

        <template
          v-if="currentView === 'main' && !loading && posts.length === 0"
        >
          <Alert
            variant="empty"
            :messageKey="emptyMessageKey ?? 'alert.empty.no-content-for-date'"
          ></Alert>
        </template>

        <template v-if="currentView === 'main' && !loading && posts.length > 0">
          <ol class="rdp-app__post-list">
            <template :key="index" v-for="(post, index) in posts">
              <li class="rdp-app__post-item">
                <BlueskyPostCard
                  :post="post"
                  :locale="locale"
                ></BlueskyPostCard>
              </li>
            </template>
          </ol>
        </template>

        <template v-if="currentView === 'legal'">
          <LegalNoticePage></LegalNoticePage>
        </template>

        <template v-if="currentView === 'terms'">
          <TermsOfServicePage></TermsOfServicePage>
        </template>

        <template v-if="currentView === 'contact'">
          <ContactPage></ContactPage>
        </template>

        <template v-if="currentView === 'support'">
          <SupportPage></SupportPage>
        </template>

        <template v-if="currentView === 'sources'">
          <SourcesPage></SourcesPage>
        </template>

        <template v-if="currentView === 'discuter'">
          <DiscuterPage
            :status="discuterStatus ?? 'unauthenticated'"
            :turns="discuterTurns"
            :citations="discuterCitations"
            :errorCode="discuterErrorCode"
            :draft="discuterDraft"
            :onLogin="(event) => onDiscuterLogin?.()"
            :onDraftChange="(next) => onDiscuterDraftChange?.(next)"
            :onSend="(text) => onDiscuterSend?.(text)"
            :onCancel="(event) => onDiscuterCancel?.()"
            :onClear="(event) => onDiscuterClear?.()"
            :onRetry="(event) => onDiscuterRetry?.()"
          ></DiscuterPage>
        </template>

        <template v-if="!captureMode">
          <BannerAbout
            :onLegalNoticeClick="(event) => goTo('legal')"
            :onTermsOfServiceClick="(event) => goTo('terms')"
            :onContactClick="(event) => goTo('contact')"
            :onSupportClick="(event) => goTo('support')"
            :onSourcesClick="(event) => goTo('sources')"
            :onDiscuterClick="(event) => goTo('discuter')"
          ></BannerAbout>
        </template>
      </main>

      <template v-if="isCalendarOpen">
        <Calendar
          presentation="sheet"
          :selectedDate="focusedDate"
          :locale="locale"
          :yearRange="yearRange"
          :minDate="minDate"
          :onSelect="(d) => pickFromCalendar(d)"
          :onDismiss="(event) => closeCalendar()"
        ></Calendar>
      </template>

      <div class="rdp-app__mobile-dock">
        <CalendarActionBar
          position="bottom"
          :date="focusedDate"
          :locale="locale"
          :onPillClick="(event) => openCalendar()"
          :onPrev="(event) => prevDay()"
          :onNext="(event) => nextDay()"
          :prevDisabled="prevDayDisabled"
          :nextDisabled="nextDayDisabled"
        ></CalendarActionBar>
      </div>
    </template>

    <component :is="'style'">{{
      `
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
      `
    }}</component>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { t } from "../utils/i18n";
import { formatLegacyShortDay } from "../utils/intl";
import AppHeader from "./AppHeader.vue";
import BlueskyPostCard from "./BlueskyPostCard.vue";
import Alert from "./Alert.vue";
import Sidebar from "./Sidebar.vue";
import BannerAbout from "./BannerAbout.vue";
import Calendar from "./Calendar.vue";
import CalendarActionBar from "./CalendarActionBar.vue";
import LegalNoticePage from "./LegalNoticePage.vue";
import TermsOfServicePage from "./TermsOfServicePage.vue";
import ContactPage from "./ContactPage.vue";
import SupportPage from "./SupportPage.vue";
import SourcesPage from "./SourcesPage.vue";
import DiscuterPage from "./DiscuterPage.vue";
import IntroCard from "./IntroCard.vue";
import Spinner from "./Spinner.vue";
import type { BlueskyPost } from "./BlueskyPostCard.vue";
import type {
  SummaryBlock,
  SummaryInlineSegment,
} from "../utils/summary-blocks";
import type { Locale } from "../utils/i18n";
import type {
  DiscuterStatus,
  DiscuterTurn,
  DiscuterCitation,
  DiscuterErrorCode,
  DiscuterHandleErrorCode,
} from "./DiscuterPage.vue";

type MainSubView = "publications" | "summary";
type SnapshotItem = {
  id: string;
  label: string;
};
type ViewKey =
  | "main"
  | "legal"
  | "terms"
  | "contact"
  | "support"
  | "sources"
  | "discuter";
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
  /** Whether the summary fetch is in flight for the current date. */
  summaryLoading?: boolean;
  /** Pre-parsed summary blocks; empty array when the day has no summary. */
  summaryBlocks?: SummaryBlock[];
  onMainSubViewChange?: (next: MainSubView) => void;
};

const props = defineProps<AppProps>();
const focusedDate = ref(new Date());
const isCalendarOpen = ref(false);
const currentView = ref("main");
const initialised = ref(false);

onMounted(() => {
  focusedDate.value = props.pickedDate;
  if (props.initialView) {
    currentView.value = props.initialView;
  }
  initialised.value = true;
});

const popularNewsLine = computed(() => {
  return t(
    "header.popular-news",
    {
      date: formatLegacyShortDay(props.pickedDate, props.locale ?? "fr-FR"),
    },
    props.locale ?? "fr-FR"
  );
});
const prevDayDisabled = computed(() => {
  if (!props.minDate) return false;
  const cur = new Date(
    focusedDate.value.getFullYear(),
    focusedDate.value.getMonth(),
    focusedDate.value.getDate()
  );
  const min = new Date(
    props.minDate.getFullYear(),
    props.minDate.getMonth(),
    props.minDate.getDate()
  );
  return cur.getTime() <= min.getTime();
});
const nextDayDisabled = computed(() => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const cur = new Date(
    focusedDate.value.getFullYear(),
    focusedDate.value.getMonth(),
    focusedDate.value.getDate()
  );
  return cur.getTime() >= yesterday.getTime();
});

function prevDay() {
  const next = new Date(focusedDate.value);
  next.setDate(next.getDate() - 1);
  focusedDate.value = next;
  currentView.value = "main";
  props.onViewChange?.("main");
  props.onDateSelect?.(next);
}
function nextDay() {
  const next = new Date(focusedDate.value);
  next.setDate(next.getDate() + 1);
  focusedDate.value = next;
  currentView.value = "main";
  props.onViewChange?.("main");
  props.onDateSelect?.(next);
}
function openCalendar() {
  isCalendarOpen.value = true;
}
function closeCalendar() {
  isCalendarOpen.value = false;
}
function pickFromCalendar(d: Date) {
  focusedDate.value = d;
  isCalendarOpen.value = false;
  currentView.value = "main";
  props.onViewChange?.("main");
  props.onDateSelect?.(d);
}
function selectFromSidebar(d: Date) {
  focusedDate.value = d;
  currentView.value = "main";
  props.onViewChange?.("main");
  props.onDateSelect?.(d);
}
function goTo(view: ViewKey) {
  currentView.value = view;
  props.onViewChange?.(view);
}
function goHome() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  focusedDate.value = yesterday;
  currentView.value = "main";
  props.onViewChange?.("main");
  props.onDateSelect?.(yesterday);
  props.onLogoClick?.();
}
</script>