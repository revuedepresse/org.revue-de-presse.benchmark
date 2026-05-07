<template>
  <div :class="`rdp-app rdp-app--${layout ?? 'desktop'}`">
    <AppHeader
      :layout="layout ?? 'desktop'"
      :authenticated="authenticated ?? false"
      :onAccountClick="(event) => onAccountClick?.()"
      :onMySpaceClick="(event) => onMySpaceClick?.()"
    ></AppHeader>
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
            :locale="locale"
            :onListSelect="(id) => onListSelect?.(id)"
            :onDateSelect="(d) => onDateSelect?.(d)"
            :onLegalNoticeClick="(event) => goTo('legal')"
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

          <template
            v-if="currentView === 'main' && !loading && posts.length === 0"
          >
            <Alert
              variant="empty"
              :messageKey="emptyMessageKey ?? 'alert.empty.no-content-for-date'"
            ></Alert>
          </template>

          <template v-if="currentView === 'main' && posts.length > 0">
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

        <template
          v-if="currentView === 'main' && !loading && posts.length === 0"
        >
          <Alert
            variant="empty"
            :messageKey="emptyMessageKey ?? 'alert.empty.no-content-for-date'"
          ></Alert>
        </template>

        <template v-if="currentView === 'main' && posts.length > 0">
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
        ></CalendarActionBar>
      </div>
    </template>

    <component :is="'style'">{{
      `
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
import ContactPage from "./ContactPage.vue";
import SupportPage from "./SupportPage.vue";
import SourcesPage from "./SourcesPage.vue";
import type { BlueskyPost } from "./BlueskyPostCard.vue";
import type { Locale } from "../utils/i18n";

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

const props = defineProps<AppProps>();
const focusedDate = ref(new Date());
const isCalendarOpen = ref(false);
const currentView = ref("main");
const initialised = ref(false);

onMounted(() => {
  focusedDate.value = props.pickedDate;
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

function prevDay() {
  const next = new Date(focusedDate.value);
  next.setDate(next.getDate() - 1);
  focusedDate.value = next;
  props.onDateSelect?.(next);
}
function nextDay() {
  const next = new Date(focusedDate.value);
  next.setDate(next.getDate() + 1);
  focusedDate.value = next;
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
  props.onDateSelect?.(d);
}
function goTo(view: "main" | "legal" | "contact" | "support" | "sources") {
  currentView.value = view;
}
</script>