export type Highlight = {
  screenName: string;
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
  apiBaseUrl: string;
  apiClientSecret: string;
  logLevel: string;
  tz: string;
  postFooterUrl: string;
  postHashtag: string;
};
