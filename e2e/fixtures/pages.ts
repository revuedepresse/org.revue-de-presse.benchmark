// Single source of truth for routes both functional and perf suites iterate.

export const PAGES = [
  { id: 'home',          path: '/',                                                 label: 'Home' },
  { id: 'sources',       path: '/sources',                                          label: 'Sources' },
  { id: 'legal',         path: '/mentions-legales',                                 label: 'Mentions légales' },
  { id: 'contact',       path: '/nous-contacter',                                   label: 'Nous contacter' },
  { id: 'support',       path: '/nous-soutenir',                                    label: 'Nous soutenir' },
  { id: 'introuvable',   path: '/contenu-introuvable',                              label: 'Contenu introuvable' },
  { id: 'day',           path: '/2026-05-01',                                       label: 'Day route' },
  { id: 'day-localized', path: '/2026-05-01/actualites-du-vendredi-1-mai-2026',     label: 'Day localized' },
  { id: 'source',        path: '/source/123/abc',                                   label: 'Source page' },
] as const;

export type PageEntry = (typeof PAGES)[number];
