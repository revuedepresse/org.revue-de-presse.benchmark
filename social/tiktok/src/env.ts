import { z } from 'zod';

const EnvSchema = z.object({
  TIKTOK_CLIENT_KEY:          z.string().min(1, 'TIKTOK_CLIENT_KEY required'),
  TIKTOK_CLIENT_SECRET:       z.string().min(1, 'TIKTOK_CLIENT_SECRET required'),
  TIKTOK_REFRESH_TOKEN:       z.string().min(1, 'TIKTOK_REFRESH_TOKEN required'),
  TIKTOK_SECRET_ROTATOR_PAT:  z
    .string()
    .min(1)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  PUBLISH_MODE:               z.enum(['inbox', 'direct']).default('inbox'),
  NUXT_CAPTURE_URL:           z
    .string()
    .url()
    .default('https://revue-de-presse.org')
    .or(z.literal('').transform(() => 'https://revue-de-presse.org')),
  API_BASE_URL:               z
    .string()
    .url()
    .default('https://api.revue-de-presse.org')
    .or(z.literal('').transform(() => 'https://api.revue-de-presse.org')),
  API_CLIENT_SECRET:          z.string().min(1, 'API_CLIENT_SECRET required'),
  DRY_RUN:                    z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  DATE_OVERRIDE:               z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'DATE_OVERRIDE must be YYYY-MM-DD')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  LOG_LEVEL:                  z.string().default('info'),
  TZ:                          z.string().default('Europe/Paris'),
});

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment:\n${issues}`);
  }
  return parsed.data;
}
