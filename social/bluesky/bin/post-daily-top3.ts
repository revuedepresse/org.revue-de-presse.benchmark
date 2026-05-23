#!/usr/bin/env -S node --env-file=.env.local --import tsx
import { readFile, writeFile, chmod, rename } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { Agent } from '@atproto/api';
import { NodeOAuthClient, type NodeSavedSession, type NodeSavedState } from '@atproto/oauth-client-node';
import { loadConfig, ConfigError } from '../src/config.ts';
import { createRevueDePresseClient, UpstreamError } from '../src/revueDePresseClient.ts';
import { renderThread, graphemeLength, truncateGraphemes } from '../src/renderThread.ts';
import { createMentionResolver } from '../src/mentionResolver.ts';
import { createEmbedBuilder } from '../src/embedBuilder.ts';
import { postThread, BlueskyApiError } from '../src/blueskyClient.ts';
import { createFileSessionStore, createFileStateStore, createEnvSessionStore } from '../src/oauthStore.ts';
import {
  previousPublicationIds,
  readStateFile,
  recordPost,
  StateFileError,
  writeRotatedStateFile,
} from '../src/stateStore.ts';
import { hasAuthoredTodayInTz } from '../src/dailyGuard.ts';
import { logger } from '../src/logger.ts';

const EXIT = { OK: 0, ALREADY_POSTED: 1, UPSTREAM: 2, BLUESKY: 3, CONFIG: 4, DUPLICATE_CONTENT: 5 };

function previousDateInTz(tz: string): string {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
  const [y, m, d] = fmt.format(new Date()).split('-').map(Number);
  const y2 = new Date(Date.UTC(y, m - 1, d - 1));
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' }).format(y2);
}

function setEqualsStrings(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = new Set(a);
  return b.every((v) => sa.has(v));
}

function clientMetadata(cfg: ReturnType<typeof loadConfig>) {
  return {
    client_id: cfg.blueskyClientMetadataUrl,
    client_name: 'Revue de Presse — daily Bluesky digest',
    client_uri: new URL(cfg.blueskyClientMetadataUrl).origin,
    redirect_uris: [cfg.blueskyRedirectUri] as [string],
    grant_types: ['authorization_code', 'refresh_token'] as ['authorization_code', 'refresh_token'],
    response_types: ['code'] as ['code'],
    scope: 'atproto transition:generic',
    token_endpoint_auth_method: 'none' as const,
    application_type: 'native' as const,
    dpop_bound_access_tokens: true as const,
  };
}

async function readDidSummary(sessionFile: string): Promise<string | null> {
  try {
    return (await readFile(`${sessionFile}.did`, 'utf8')).trim();
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

async function main(): Promise<number> {
  const { values } = parseArgs({
    options: {
      date: { type: 'string' },
      force: { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
    },
    strict: true,
  });

  const cfg = loadConfig();
  const envMode = cfg.blueskyOauthSessionEnv !== null;
  const targetDate = values.date ?? previousDateInTz(cfg.tz);
  logger.info({ targetDate, dryRun: values['dry-run'], force: values.force, envMode }, 'starting');

  const sessionStore = envMode
    ? createEnvSessionStore<NodeSavedSession>(cfg.blueskyOauthSessionEnv!)
    : createFileSessionStore<NodeSavedSession>(cfg.blueskySessionFile);
  const stateStore = createFileStateStore<NodeSavedState>(`${cfg.blueskySessionFile}.state`);

  let did: string | null;
  if (envMode) {
    const decoded = JSON.parse(Buffer.from(cfg.blueskyOauthSessionEnv!, 'base64').toString('utf8')) as { did: string };
    did = decoded.did;
  } else {
    did = await readDidSummary(cfg.blueskySessionFile);
    if (!did) {
      logger.error({ sessionFile: cfg.blueskySessionFile }, 'no .did summary alongside session file — run `make bluesky-bootstrap` first');
      return EXIT.CONFIG;
    }
  }

  let agent: Agent | null = null;
  if (!values['dry-run']) {
    const client = new NodeOAuthClient({
      clientMetadata: clientMetadata(cfg),
      stateStore,
      sessionStore,
    });
    let oauthSession;
    try {
      oauthSession = await client.restore(did);
    } catch (err) {
      logger.error({ err, did }, 'OAuth restore failed — refresh token likely revoked; re-run `make bluesky-bootstrap`');
      return EXIT.CONFIG;
    }
    agent = new Agent(oauthSession);

    if (!values.force) {
      try {
        if (await hasAuthoredTodayInTz(agent, did, cfg.tz)) {
          logger.warn({ targetDate, did }, 'dailyGuard.skip — already authored a post today in tz');
          return EXIT.ALREADY_POSTED;
        }
      } catch (err) {
        logger.warn({ err }, 'dailyGuard.error — proceeding without calendar-day gate');
      }
    }
  } else {
    logger.info('dailyGuard.skipped-by-dryrun');
  }

  const upstream = createRevueDePresseClient({ baseUrl: cfg.apiBaseUrl, clientSecret: cfg.apiClientSecret });
  let highlights;
  try {
    highlights = await upstream.fetchTopThree(targetDate);
  } catch (err) {
    logger.error({ err }, 'upstream fetchTopThree failed');
    return EXIT.UPSTREAM;
  }
  if (highlights.length !== 3) {
    logger.error({ targetDate, count: highlights.length }, 'upstream did not return 3 highlights — refusing to post incomplete digest');
    return EXIT.UPSTREAM;
  }

  if (!values.force) {
    const prevIds = await previousPublicationIds(cfg.blueskyStateFile);
    const currentIds = highlights.map((h) => h.publicationId);
    if (prevIds && setEqualsStrings(prevIds, currentIds)) {
      logger.warn({ prevIds, currentIds, targetDate }, 'contentGuard.skip — top 3 unchanged since last post');
      return EXIT.DUPLICATE_CONTENT;
    }
  }

  let draft;
  try {
    draft = renderThread(highlights, targetDate, { footerUrl: cfg.postFooterUrl, hashtag: cfg.postHashtag });
  } catch (err) {
    logger.error({ err }, 'render failed');
    return EXIT.UPSTREAM;
  }

  if (values['dry-run']) {
    process.stdout.write(`--- LEAD (${graphemeLength(draft.lead.text)} graphemes) ---\n${draft.lead.text}\n\n`);
    for (let i = 0; i < draft.replies.length; i += 1) {
      const r = draft.replies[i];
      process.stdout.write(`--- REPLY ${i + 1} @${r.handle} (${graphemeLength(r.text)} g) embed=${r.embedUri} ---\n${r.text}\n\n`);
    }
    logger.info('dry-run complete — no PDS calls made');
    return EXIT.OK;
  }

  if (!agent) {
    logger.error('internal: agent not initialised at post time');
    return EXIT.BLUESKY;
  }

  const resolver = createMentionResolver(agent);
  const embedBuilder = createEmbedBuilder({ agent });

  const enrichedReplies = await Promise.all(
    draft.replies.map(async (r) => {
      const [didResult, embed] = await Promise.all([
        resolver.resolve(r.handle),
        embedBuilder.build(r.embedUri),
      ]);
      const facets: unknown[] = [];
      let text = r.text;
      if (didResult) {
        facets.push({
          index: { byteStart: r.mentionRange.byteStart, byteEnd: r.mentionRange.byteEnd },
          features: [{ $type: 'app.bsky.richtext.facet#mention', did: didResult }],
        });
      } else {
        text = text.replace('@', '');
      }
      const finalEmbed: unknown | undefined = embed ?? undefined;
      if (!embed) {
        const suffix = `\n${r.embedUri}`;
        const maxTextLen = 300 - graphemeLength(suffix);
        if (graphemeLength(text) > maxTextLen) {
          text = truncateGraphemes(text, maxTextLen);
        }
        const byteStart = Buffer.byteLength(text, 'utf8') + 1;
        text = `${text}${suffix}`;
        const byteEnd = Buffer.byteLength(text, 'utf8');
        facets.push({
          index: { byteStart, byteEnd },
          features: [{ $type: 'app.bsky.richtext.facet#link', uri: r.embedUri }],
        });
      }
      return { text, facets, embed: finalEmbed };
    }),
  );

  let rootUri: string;
  try {
    rootUri = await postThread(agent as never, { lead: draft.lead, enrichedReplies });
  } catch (err) {
    logger.error({ err }, 'postThread failed');
    return EXIT.BLUESKY;
  }

  const publicationIds = highlights.map((h) => h.publicationId);
  await recordPost(cfg.blueskyStateFile, targetDate, rootUri, new Date().toISOString(), publicationIds);

  if (envMode && cfg.blueskyRotatedSessionFile) {
    const envStore = sessionStore as ReturnType<typeof createEnvSessionStore>;
    if (envStore.lastSet) {
      const payload = JSON.stringify({ did: envStore.lastSet.did, session: envStore.lastSet.value });
      const tmp = `${cfg.blueskyRotatedSessionFile}.tmp`;
      await writeFile(tmp, Buffer.from(payload, 'utf8').toString('base64'), { mode: 0o600 });
      await chmod(tmp, 0o600);
      await rename(tmp, cfg.blueskyRotatedSessionFile);
    }
  }

  if (envMode && cfg.blueskyRotatedStateFile) {
    const state = await readStateFile(cfg.blueskyStateFile);
    if (state) await writeRotatedStateFile(cfg.blueskyRotatedStateFile, state);
  }

  logger.info({ rootUri, targetDate }, 'posted');
  process.stdout.write(rootUri + '\n');
  return EXIT.OK;
}

main()
  .then((code) => process.exit(code))
  .catch((err: unknown) => {
    if (err instanceof ConfigError || err instanceof StateFileError) {
      logger.error({ err }, 'config / state error');
      process.exit(EXIT.CONFIG);
    }
    if (err instanceof UpstreamError) process.exit(EXIT.UPSTREAM);
    if (err instanceof BlueskyApiError) process.exit(EXIT.BLUESKY);
    logger.error({ err }, 'unhandled error');
    process.exit(EXIT.BLUESKY);
  });
