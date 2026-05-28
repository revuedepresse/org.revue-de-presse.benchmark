import pino, { type Logger } from 'pino';

// Single Nitro-side logger. Vanilla pino emits NDJSON to stdout — Netlify
// Functions parses that natively, and in local dev it can be piped through
// `pino-pretty` if a human reader is needed (not added as a dep to keep the
// runtime bundle slim; install ad-hoc when debugging).
const isDev = process.env.NODE_ENV !== 'production';

export const logger: Logger = pino({
  level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
  base: { app: 'rdp-nuxt' },
});
