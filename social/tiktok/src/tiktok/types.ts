import { z } from 'zod';

export const TokenResponseSchema = z.object({
  access_token:       z.string(),
  refresh_token:      z.string(),
  expires_in:         z.number(),
  refresh_expires_in: z.number(),
  token_type:         z.string().optional(),
  scope:              z.string().optional(),
  open_id:            z.string().optional(),
});
export type TokenResponse = z.infer<typeof TokenResponseSchema>;

export const InitResponseSchema = z.object({
  data: z.object({
    publish_id: z.string(),
    upload_url: z.string().url(),
  }),
  error: z
    .object({
      code:    z.string(),
      message: z.string(),
      log_id:  z.string().optional(),
    })
    .optional(),
});
export type InitResponse = z.infer<typeof InitResponseSchema>;

export const StatusResponseSchema = z.object({
  data: z.object({
    status:                       z.string(),
    fail_reason:                  z.string().optional(),
    publicaly_available_post_id:  z.array(z.string()).optional(),
  }),
  error: z
    .object({
      code:    z.string(),
      message: z.string(),
    })
    .optional(),
});
export type StatusResponse = z.infer<typeof StatusResponseSchema>;

export class TikTokAuthError extends Error {
  readonly exitCode = 20;
  constructor(message: string) { super(message); this.name = 'TikTokAuthError'; }
}
export class TikTokClientCredentialsError extends Error {
  readonly exitCode = 21;
  constructor(message: string) { super(message); this.name = 'TikTokClientCredentialsError'; }
}
export class TikTokInitError extends Error {
  readonly exitCode = 22;
  constructor(message: string) { super(message); this.name = 'TikTokInitError'; }
}
export class TikTokUploadError extends Error {
  readonly exitCode = 23;
  constructor(message: string) { super(message); this.name = 'TikTokUploadError'; }
}
export class TikTokPublishFailedError extends Error {
  readonly exitCode = 24;
  constructor(message: string) { super(message); this.name = 'TikTokPublishFailedError'; }
}
export class TikTokStatusTimeoutError extends Error {
  readonly exitCode = 25;
  constructor(message: string) { super(message); this.name = 'TikTokStatusTimeoutError'; }
}
export class TikTokRotateError extends Error {
  readonly exitCode = 26;
  constructor(message: string) { super(message); this.name = 'TikTokRotateError'; }
}
