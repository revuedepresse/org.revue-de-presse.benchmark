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
    <template v-if="showPopularNews === true">
      <p class="rdp-app__popular-news">{{ popularNewsLine }}</p>
    </template>

    <template v-if="(layout ?? 'desktop') === 'desktop'">
      <div class="rdp-app__content">
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

          <template v-if="currentView === 'main'">
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

        <template v-if="currentView === 'main'">
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

        <BannerAbout
          :onLegalNoticeClick="(event) => goTo('legal')"
          :onTermsOfServiceClick="(event) => goTo('terms')"
          :onContactClick="(event) => goTo('contact')"
          :onSupportClick="(event) => goTo('support')"
          :onSourcesClick="(event) => goTo('sources')"
        ></BannerAbout>
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
import type { Locale } from "../utils/i18n";

type SnapshotItem = {
  id: string;
  label: string;
};
type ViewKey = "main" | "legal" | "terms" | "contact" | "support" | "sources";
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