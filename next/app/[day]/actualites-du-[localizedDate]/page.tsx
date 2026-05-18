import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AppShellClient from '@/components/AppShellClient';

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseDay(day: string): Date | null {
  if (!DAY_PATTERN.test(day)) return null;
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return null;
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

const FR_LONG = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }): Promise<Metadata> {
  const { day } = await params;
  const date = parseDay(day);
  if (!date) return {};
  return {
    title: `Revue de presse — actualités du ${FR_LONG.format(date)}`,
  };
}

export default async function DayLocalizedPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const date = parseDay(day);
  if (!date) notFound();
  return <AppShellClient initialDate={date} />;
}
