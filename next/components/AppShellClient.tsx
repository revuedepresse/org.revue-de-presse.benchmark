'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import App from '@design-system/components/App';
import { useSampleData } from '@/hooks/useSampleData';
import { useHighlights } from '@/hooks/useHighlights';

type ViewKey = 'main' | 'legal' | 'contact' | 'support' | 'sources';

type Props = {
  initialView?: ViewKey;
  initialDate?: Date;
  emptyMessageKey?: string;
};

function yesterday(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

const MIN_DATE = new Date(2025, 2, 4);
const YEAR_RANGE = { min: MIN_DATE.getFullYear(), max: new Date().getFullYear() };

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

function urlForView(view: ViewKey, pickedDate: Date): string {
  switch (view) {
    case 'legal': return '/mentions-legales';
    case 'contact': return '/nous-contacter';
    case 'support': return '/nous-soutenir';
    case 'sources': return '/sources';
    case 'main':
    default:
      return urlForDate(pickedDate);
  }
}

export default function AppShellClient({ initialView, initialDate, emptyMessageKey }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { lists } = useSampleData();

  const [layout, setLayout] = useState<'desktop' | 'mobile'>('desktop');
  const [pickedDate, setPickedDate] = useState<Date>(initialDate ?? yesterday());

  const { posts, loading } = useHighlights(pickedDate);

  // Sync pickedDate when the dynamic route swaps initialDate
  // (e.g. /2025-05-08 -> /2025-05-09).
  useEffect(() => {
    if (initialDate && initialDate.getTime() !== pickedDate.getTime()) {
      setPickedDate(new Date(initialDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDate?.getTime()]);

  useEffect(() => {
    const sync = () => {
      setLayout(window.matchMedia('(max-width: 600px)').matches ? 'mobile' : 'desktop');
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  const onDateSelect = (d: Date) => {
    setPickedDate(d);
    router.push(urlForDate(d));
  };

  const onViewChange = (view: ViewKey) => {
    const target = urlForView(view, pickedDate);
    if (pathname !== target) router.push(target);
  };

  const onLogoClick = () => {
    setPickedDate(yesterday());
  };

  return (
    <App
      layout={layout}
      authenticated={false}
      posts={posts}
      pickedDate={pickedDate}
      lists={lists}
      selectedListId="medias-francais"
      yearRange={YEAR_RANGE}
      minDate={MIN_DATE}
      loading={loading}
      initialView={initialView ?? 'main'}
      emptyMessageKey={emptyMessageKey}
      locale="fr-FR"
      onDateSelect={onDateSelect}
      onViewChange={onViewChange}
      onLogoClick={onLogoClick}
    />
  );
}
