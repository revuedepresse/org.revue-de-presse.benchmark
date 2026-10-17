export type ViewKey = 'main' | 'legal' | 'terms' | 'contact' | 'support' | 'sources' | 'newsletter';

declare module '#app' {
  interface PageMeta {
    /** Panel the shared AppShell (layouts/default.vue) shows for this route. */
    view?: ViewKey;
    emptyMessageKey?: string;
  }
}

export {};
