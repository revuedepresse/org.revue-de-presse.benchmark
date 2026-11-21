// The publisher lists the API ranks a top 10 for (`?list=`); one LinkedIn
// post and one newsletter each.
export type PublisherList = 'fr' | 'coop-medias';

export const PUBLISHER_LISTS: readonly PublisherList[] = ['fr', 'coop-medias'];

export type Highlight = {
  screenName: string;
  // The account's Bluesky display name, printed instead of the handle.
  displayName?: string;
  publicationId: string;
  url: string;
  text: string;
  date: string;
};

export type TokenFile = {
  access_token: string;
  access_token_expires_at: number;
  refresh_token: string;
  refresh_token_expires_at: number;
  rotated_at: number;
};

export type StateEntry = {
  date: string;
  postUrn: string;
  postedAt: string;
  // Absent from entries written before there was more than one list: those
  // are French media posts.
  list?: PublisherList;
};

export type StateFile = {
  lastPostedDate: string | null;
  history: StateEntry[];
};

export type Config = {
  linkedinClientId: string;
  linkedinClientSecret: string;
  linkedinRedirectUri: string;
  linkedinOrganizationUrn: string;
  linkedinVersion: string;
  linkedinTokenFile: string;
  linkedinStateFile: string;
  linkedinRefreshTokenEnv: string | null;
  linkedinRotatedRefreshTokenFile: string | null;
  apiBaseUrl: string;
  apiClientSecret: string;
  logLevel: string;
  tz: string;
  postFooterUrl: string;
  postHashtag: string;
  blueskyPublicApiUrl: string;
  // Lists posted each morning; the others are built but not posted.
  publishLists: PublisherList[];
  newsletterUrls: Record<PublisherList, string>;
};
