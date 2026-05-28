// Ambient declarations for the design-system React output. The actual .tsx
// files live in ../design-system/output/react/src/ and are bundled into
// next/ via path aliases at runtime. We don't typecheck them here because
// design-system doesn't ship React as a peer dep, so TS resolution from
// inside those files fails. Design-system has its own typecheck step in
// its own workspace.
//
// This file declares the modules and the type surface we actually consume,
// keeping the rest opaque.

declare module '@design-system/components/BlueskyPostCard' {
  export type BlueskyPost = {
    id: string;
    authorName: string;
    authorHandle: string;
    authorAvatarUrl?: string;
    body: string;
    publishedAt: Date;
    metrics: { replies: number; reposts: number; likes: number };
    hasMedia: boolean;
    publicationUrl?: string;
  };
  const Component: React.ComponentType<{ post: BlueskyPost }>;
  export default Component;
}

declare module '@design-system/components/App' {
  type SnapshotItem = { id: string; label: string };
  type ViewKey = 'main' | 'legal' | 'terms' | 'contact' | 'support' | 'sources';
  type Locale = string;
  type BlueskyPost = import('@design-system/components/BlueskyPostCard').BlueskyPost;

  export type AppProps = {
    layout?: 'mobile' | 'desktop';
    authenticated?: boolean;
    posts: BlueskyPost[];
    pickedDate: Date;
    lists: SnapshotItem[];
    selectedListId?: string;
    yearRange: { min: number; max: number };
    minDate?: Date;
    loading?: boolean;
    emptyMessageKey?: string;
    showPopularNews?: boolean;
    locale?: Locale;
    initialView?: ViewKey;
    onAccountClick?: () => void;
    onMySpaceClick?: () => void;
    onListSelect?: (id: string) => void;
    onDateSelect?: (date: Date) => void;
    onLogoClick?: () => void;
    onViewChange?: (view: ViewKey) => void;
  };

  const Component: React.ComponentType<AppProps>;
  export default Component;
}

// Catch-all for any other @design-system/components/* we might import
// without declaring a precise type surface above. Loose `any`; design-system
// owns the real type checking.
declare module '@design-system/components/*' {
  const Component: React.ComponentType<any>;
  export default Component;
}
