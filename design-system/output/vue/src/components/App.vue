<template>
  <div
    data-testid="app-shell"
    :class="`rdp-app rdp-app--${layout ?? 'desktop'}`"
  >
    <div class="rdp-app__header-ribbon">
      <div class="rdp-app__header-inner">
        <AppHeader
          :layout="layout ?? 'desktop'"
          :authenticated="false"
          :onLogoClick="(event) => goHome()"
        ></AppHeader>
      </div>
    </div>
    <template v-if="showPopularNews === true && mainSubView !== 'summary'">
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
              <h1 class="rdp-app__synthesis-title">{{ synthesisHeadline }}</h1>

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
                    <template v-if="block.kind === 'paragraph'">
                      <p class="rdp-app__summary-p">
                        <template
                          :key="index"
                          v-for="(seg, index) in block.segments"
                        >
                          <template v-if="seg.kind === 'text'">{{ seg.value }}</template>

                          <template v-if="seg.kind === 'bold'">
                            <strong>{{ seg.value }}</strong>
                          </template>

                          <template v-if="seg.kind === 'handle'">
                            <a
                              class="rdp-app__summary-handle"
                              target="_blank"
                              rel="noreferrer noopener"
                              :href="`https://bsky.app/profile/${seg.value}`"
                            >
                              @{{ seg.value }}</a
                            >
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
                              <template v-if="seg.kind === 'text'">{{ seg.value }}</template>

                              <template v-if="seg.kind === 'bold'">
                                <strong>{{ seg.value }}</strong>
                              </template>

                              <template v-if="seg.kind === 'handle'">
                                <a
                                  class="rdp-app__summary-handle"
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  :href="`https://bsky.app/profile/${seg.value}`"
                                  >{{ seg.value }}</a
                                >
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

        <template v-if="!captureMode">
          <BannerAbout
            :onLegalNoticeClick="(event) => goTo('legal')"
            :onTermsOfServiceClick="(event) => goTo('terms')"
            :onContactClick="(event) => goTo('contact')"
            :onSupportClick="(event) => goTo('support')"
            :onSourcesClick="(event) => goTo('sources')"
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
import IntroCard from "./IntroCard.vue";
import Spinner from "./Spinner.vue";
import type { BlueskyPost } from "./BlueskyPostCard.vue";
import type {
  SummaryBlock,
  SummaryInlineSegment,
} from "../utils/summary-blocks";
import type { Locale } from "../utils/i18n";

type MainSubView = "publications" | "summary";

/** Initial sub-view for the day-page, when entered via a URL like
 *  /YYYY-MM-DD/synthese-des-actus-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
 *  Nuxt so the route is the source of truth. */
/** Initial sub-view for the day-page, when entered via a URL like
 *  /YYYY-MM-DD/synthese-des-actus-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
 *  Nuxt so the route is the source of truth. */
type InitialMainSubView = MainSubView;
/** Initial sub-view for the day-page, when entered via a URL like
 *  /YYYY-MM-DD/synthese-des-actus-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
 *  Nuxt so the route is the source of truth. */

type SnapshotItem = {
  id: string;
  label: string;
};
/** Initial sub-view for the day-page, when entered via a URL like
 *  /YYYY-MM-DD/synthese-des-actus-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
 *  Nuxt so the route is the source of truth. */

type ViewKey = "main" | "legal" | "terms" | "contact" | "support" | "sources";
/** Initial sub-view for the day-page, when entered via a URL like
 *  /YYYY-MM-DD/synthese-des-actus-du-… vs /YYYY-MM-DD/actualites-du-…. Wired from
 *  Nuxt so the route is the source of truth. */

type AppProps = {
  layout?: "mobile" | "desktop";
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
  onListSelect?: (id: string) => void;
  onDateSelect?: (date: Date) => void;
  onLogoClick?: () => void;
  onViewChange?: (view: ViewKey) => void;
  captureMode?: boolean;
  /** Day-page sub-view toggle: 'publications' (default) or 'summary'. */
  mainSubView?: MainSubView;
  /** Boot-time sub-view from the URL (synthese-des-actus-du-… vs actualites-du-…).
   *  AppShell uses it to set mainSubView on mount + when the prop changes. */
  initialMainSubView?: InitialMainSubView;
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
const synthesisHeadline = computed(() => {
  return t(
    "header.synthesis",
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