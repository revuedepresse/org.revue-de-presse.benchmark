export type Highlight = {
  screenName: string;
  publicationId: string;
  url: string;
  text: string;
  date: string;
};

export type Reply = {
  text: string;
  handle: string;
  embedUri: string;
  mentionRange: { byteStart: number; byteEnd: number };
};

export type ThreadDraft = {
  lead: { text: string };
  replies: Reply[];
};

export type StateEntry = {
  date: string;
  threadRootUri: string;
  postedAt: string;
  publicationIds: string[];
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
  apiBaseUrl: string;
  apiClientSecret: string;
  logLevel: string;
  tz: string;
  postFooterUrl: string;
  postHashtag: string;
};
