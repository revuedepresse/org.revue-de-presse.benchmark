<script setup lang="ts">
import App from '@design-system/components/App.vue';

type ViewKey = 'main' | 'legal' | 'terms' | 'contact' | 'support' | 'sources';

const props = defineProps<{
  initialView?: ViewKey;
  initialDate?: Date;
  emptyMessageKey?: string;
  /** Day-page sub-view from the URL: 'publications' (default) for
   *  /YYYY-MM-DD/actualites-du-… and 'summary' for /YYYY-MM-DD/synthese-des-actus-du-…. */
  initialMainSubView?: 'publications' | 'summary';
}>();

const router = useRouter();
const route = useRoute();
const { lists } = useSampleData();
const { isCaptureModeActive } = useCaptureMode();

const layout = ref<'desktop' | 'mobile'>('desktop');

function yesterday(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

const minDate = new Date(2025, 2, 4);
const yearRange = { min: minDate.getFullYear(), max: new Date().getFullYear() };

const pickedDate = ref<Date>(props.initialDate ?? yesterday());
const { posts, loading } = useHighlights(pickedDate);

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

function urlForSynthese(d: Date): string {
  return `/${ymd(d)}/synthese-des-actus-du-${localizeDay(d)}`;
}

function urlForView(view: ViewKey): string {
  switch (view) {
    case 'legal': return '/mentions-legales';
    case 'terms': return '/conditions-utilisation';
    case 'contact': return '/nous-contacter';
    case 'support': return '/nous-soutenir';
    case 'sources': return '/sources';
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
  if (import.meta.client) router.push(urlForDate(d));
}

function onViewChange(view: ViewKey) {
  const target = urlForView(view);
  if (import.meta.client && route.path !== target) router.push(target);
}

function onLogoClick() {
  pickedDate.value = yesterday();
}

// --- Day-page Publications / Synthèse toggle ---------------------------------
import { parseSummaryMarkdown, type SummaryBlock } from '../utils/parse-summary-markdown';

type MainSubView = 'publications' | 'summary';

// The URL is source of truth for the sub-view: the synthese-des-actus-du-… page
// passes initialMainSubView="summary", the actualites-du-… page leaves it
// undefined ⇒ "publications".
const mainSubView = ref<MainSubView>(props.initialMainSubView ?? 'publications');
watch(
  () => props.initialMainSubView,
  (next) => {
    if (next !== undefined && next !== mainSubView.value) mainSubView.value = next;
  },
);

const summaryLoading = ref(false);
const summaryCache = ref<Record<string, SummaryBlock[]>>({});
const summaryBlocks = computed<SummaryBlock[]>(
  () => summaryCache.value[ymd(pickedDate.value)] ?? [],
);

async function fetchSummaryFor(d: Date) {
  const key = ymd(d);
  if (summaryCache.value[key]) return;
  summaryLoading.value = true;
  try {
    const resp = await $fetch<{ date: string; markdown: string }>(
      `/api/days/${key}/summary`,
    ).catch(() => null);
    summaryCache.value[key] = resp?.markdown ? parseSummaryMarkdown(resp.markdown) : [];
  } finally {
    summaryLoading.value = false;
  }
}

// Fetch lazily whenever the sub-view is "summary" — covers initial mount
// from /synthese-des-actus-du-… AND date changes while in synthesis mode.
watch(
  [mainSubView, pickedDate],
  ([sub, d]) => {
    if (sub === 'summary') void fetchSummaryFor(d);
  },
  { immediate: true },
);

function onMainSubViewChange(next: MainSubView) {
  mainSubView.value = next;
  if (!import.meta.client) return;
  const target = next === 'summary'
    ? urlForSynthese(pickedDate.value)
    : urlForDate(pickedDate.value);
  if (route.path !== target) router.push(target);
}
</script>

<template>
  <App
    :layout="layout"
    :capture-mode="isCaptureModeActive"
    :posts="posts"
    :picked-date="pickedDate"
    :lists="lists"
    selected-list-id="medias-francais"
    :year-range="yearRange"
    :min-date="minDate"
    :loading="loading"
    :initial-view="props.initialView ?? 'main'"
    :empty-message-key="props.emptyMessageKey"
    locale="fr-FR"
    :on-date-select="onDateSelect"
    :on-view-change="onViewChange"
    :on-logo-click="onLogoClick"
    :main-sub-view="mainSubView"
    :initial-main-sub-view="props.initialMainSubView"
    :summary-loading="summaryLoading"
    :summary-blocks="summaryBlocks"
    :on-main-sub-view-change="onMainSubViewChange"
  />
</template>
