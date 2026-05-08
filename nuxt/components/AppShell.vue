<script setup lang="ts">
import App from '@design-system/components/App.vue';

type ViewKey = 'main' | 'legal' | 'contact' | 'support' | 'sources';

const props = defineProps<{
  initialView?: ViewKey;
  initialDate?: Date;
  emptyMessageKey?: string;
}>();

const router = useRouter();
const route = useRoute();
const { lists } = useSampleData();

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
</script>

<template>
  <App
    :layout="layout"
    :authenticated="false"
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
  />
</template>
