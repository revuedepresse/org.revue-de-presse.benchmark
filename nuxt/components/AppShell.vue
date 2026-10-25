<script setup lang="ts">
import App from '@design-system/components/App.vue';
import {
  PUBLISHER_LISTS,
  firstDayOf,
  publisherListFromQuery,
  withinList,
  type PublisherListId,
} from '~/utils/publisher-lists';
import { RANKING_CHOICES, rankingFromQuery, selectedRankingChoice } from '~/utils/rankings';

import type { ViewKey } from '~/types/page-meta';

const props = defineProps<{
  initialView?: ViewKey;
  initialDate?: Date;
  emptyMessageKey?: string;
}>();

const router = useRouter();
const route = useRoute();

// Publisher lists ranked by the API, selected with ?liste=<id>. Without the
// query parameter, the French media top 10 shows as before.
const lists = PUBLISHER_LISTS.map(({ id, label }) => ({ id, label }));
const selectedListId = computed(() => publisherListFromQuery(route.query.liste));
// ?classement= picks the ranking (see utils/rankings.ts) and, like ?liste=,
// follows the reader from day to day.
const ranking = computed(() => rankingFromQuery(route.query.classement));
const rankingQuery = computed(() =>
  ranking.value ? { classement: route.query.classement as string } : {},
);
const defaultRanking = String(useRuntimeConfig().public.defaultRanking ?? 'first-sighting');
const selectedRankingId = computed(() => selectedRankingChoice(route.query.classement, defaultRanking));
const listQuery = computed(() => ({
  ...(selectedListId.value === 'fr' ? {} : { liste: selectedListId.value }),
  ...rankingQuery.value,
}));
const newsletterSubscribeUrl = useRuntimeConfig().public.newsletterSubscribeUrl || undefined;

// Server-side guess from the request (client hints, then user agent) so the
// first paint on a phone is already the mobile layout. Shared with the client
// through useState, so hydration matches; syncLayout() corrects it on mount.
const requestHeaders = useRequestHeaders(['sec-ch-ua-mobile', 'user-agent']);
const layout = useState<'desktop' | 'mobile'>('rdp-layout', () => {
  const hint = requestHeaders['sec-ch-ua-mobile'];
  if (hint) return hint === '?1' ? 'mobile' : 'desktop';
  return /Mobi|Android|iPhone|iPod/i.test(requestHeaders['user-agent'] ?? '') ? 'mobile' : 'desktop';
});

function yesterday(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// The calendar starts on the selected list's first collected day.
const minDate = computed(() => firstDayOf(selectedListId.value));
const yearRange = computed(() => ({
  min: minDate.value.getFullYear(),
  max: new Date().getFullYear(),
}));

const pickedDate = ref<Date>(props.initialDate ?? yesterday());
const { posts, loading } = useHighlights(pickedDate, selectedListId, ranking);

// Sync pickedDate when the dynamic-route page reuses this component and
// only swaps the initialDate prop (e.g. /2025-05-08 → /2025-05-09).
watch(
  () => props.initialDate?.getTime(),
  (next) => {
    if (next != null && next !== pickedDate.value.getTime()) {
      pickedDate.value = new Date(next);
    }
  },
);

const FRENCH_MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];
const FRENCH_WEEKDAYS = [
  'dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi',
];

function localizeDay(d: Date): string {
  const weekday = FRENCH_WEEKDAYS[d.getDay()];
  const day = d.getDate();
  const month = FRENCH_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${weekday}-${day}-${month}-${year}`
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function urlForDate(d: Date): string {
  return `/${ymd(d)}/actualites-du-${localizeDay(d)}`;
}

function urlForView(view: ViewKey): string {
  switch (view) {
    case 'legal': return '/mentions-legales';
    case 'terms': return '/conditions-utilisation';
    case 'contact': return '/nous-contacter';
    case 'support': return '/nous-soutenir';
    case 'sources': return '/sources';
    case 'newsletter': return '/lettre-quotidienne';
    case 'newsletter-coop-medias': return '/lettre-quotidienne-coop-medias';
    case 'main':
    default:
      return urlForDate(pickedDate.value);
  }
}

function syncLayout() {
  if (typeof window === 'undefined') return;
  layout.value = window.matchMedia('(max-width: 600px)').matches ? 'mobile' : 'desktop';
}

onMounted(() => {
  syncLayout();
  window.addEventListener('resize', syncLayout);
});
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('resize', syncLayout);
});

function onDateSelect(d: Date) {
  pickedDate.value = d;
  if (import.meta.client) router.push({ path: urlForDate(d), query: listQuery.value });
}

function onViewChange(view: ViewKey) {
  const target = urlForView(view);
  if (import.meta.client && route.path !== target) {
    // The posts and their sources follow the selected list.
    const followsList = view === 'main' || view === 'sources';
    router.push(followsList ? { path: target, query: listQuery.value } : target);
  }
}

function onListSelect(id: string) {
  if (!import.meta.client) return;
  const listId = publisherListFromQuery(id);
  const query = { ...(listId === 'fr' ? {} : { liste: listId }), ...rankingQuery.value };
  if (route.path === urlForView('sources')) {
    router.push({ path: route.path, query });
    return;
  }
  router.push({ path: urlForDate(withinList(pickedDate.value, listId)), query });
}

function onRankingSelect(id: string) {
  if (!import.meta.client || !rankingFromQuery(id)) return;
  router.push({ path: route.path, query: { ...route.query, classement: id } });
}

function onLogoClick() {
  pickedDate.value = withinList(yesterday(), selectedListId.value);
}

// A day the selected list has not reached yet (an old link, or the home page
// before the list's first day) moves to that list's first day, on the server
// as in the browser.
function dayOutsideList(listId: PublisherListId): Date | null {
  const day = withinList(pickedDate.value, listId);
  return day.getTime() === pickedDate.value.getTime() ? null : day;
}

// Other pages (legal notice, sources…) keep their own address.
const firstAvailableDay = (props.initialView ?? 'main') === 'main'
  ? dayOutsideList(selectedListId.value)
  : null;
if (firstAvailableDay) {
  await navigateTo(
    { path: urlForDate(firstAvailableDay), query: listQuery.value },
    { replace: true },
  );
}

watch([selectedListId, () => pickedDate.value.getTime()], () => {
  const day = dayOutsideList(selectedListId.value);
  if (day && import.meta.client) {
    router.replace({ path: urlForDate(day), query: listQuery.value });
  }
});
</script>

<template>
  <App
    :layout="layout"
    :posts="posts"
    :picked-date="pickedDate"
    :lists="lists"
    :selected-list-id="selectedListId"
    :year-range="yearRange"
    :min-date="minDate"
    :loading="loading"
    :initial-view="props.initialView ?? 'main'"
    :empty-message-key="props.emptyMessageKey"
    :newsletter-subscribe-url="newsletterSubscribeUrl"
    locale="fr-FR"
    :on-date-select="onDateSelect"
    :on-list-select="onListSelect"
    :rankings="RANKING_CHOICES"
    :selected-ranking-id="selectedRankingId"
    :on-ranking-select="onRankingSelect"
    :on-view-change="onViewChange"
    :on-logo-click="onLogoClick"
  />
</template>
