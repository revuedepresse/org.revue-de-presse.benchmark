// The publisher lists the API ranks a top 3 for (`?list=`), one thread each.
export type PublisherList = 'fr' | 'coop-medias';

export const PUBLISHER_LISTS: readonly PublisherList[] = ['fr', 'coop-medias'];

export type Highlight = {
  screenName: string;
  publicationId: string;
  url: string;
  text: string;
  date: string;
};

export type MentionRange = { handle: string; byteStart: number; byteEnd: number };

export type Reply = {
  text: string;
  handle: string;
  embedUri: string;
  mentions: MentionRange[];
  links: LinkRange[];
};

export type LinkRange = { byteStart: number; byteEnd: number; uri: string };

export type ThreadDraft = {
  lead: { text: string; linkRange?: LinkRange };
  replies: Reply[];
  // Last post of the thread, inviting readers to the newsletter.
  closing?: { text: string; linkRange: LinkRange };
};

export type StateEntry = {
  date: string;
  threadRootUri: string;
  postedAt: string;
  publicationIds: string[];
  // Absent from entries written before there was more than one list: those
  // are French media threads.
  list?: PublisherList;
};

export type StateFile = {
  lastPostedDate: string | null;
  history: StateEntry[];
};

export type Config = {
  blueskyHandle: string;
  blueskyClientMetadataUrl: string;
  blueskyRedirectUri: string;
  blueskyPdsUrl: string;
  blueskySessionFile: string;
  blueskyStateFile: string;
  blueskyOauthSessionEnv: string | null;
  blueskyRotatedSessionFile: string | null;
  blueskyRotatedStateFile: string | null;
  /**
   * base64-encoded ES256 private JWK used to authenticate the OAuth client
   * itself (`private_key_jwt`). Its presence is what promotes this client from
   * public to confidential — see src/clientMetadata.ts.
   */
  blueskyPrivateJwk: string | null;
  blueskyJwksUri: string | null;
  apiBaseUrl: string;
  apiClientSecret: string;
  logLevel: string;
  tz: string;
  postFooterUrl: string;
  postHashtag: string;
  // Lists published each morning; the others are built but not posted.
  publishLists: PublisherList[];
  newsletterUrls: Record<PublisherList, string>;
};
