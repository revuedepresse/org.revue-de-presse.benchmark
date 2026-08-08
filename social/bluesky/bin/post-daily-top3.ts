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
import { createFileSessionStore, createFileStateStore, createEnvSessionStore, withDeletionAudit } from '../src/oauthStore.ts';
import { buildClientMetadata, isConfidential } from '../src/clientMetadata.ts';
import { loadClientKeyset } from '../src/keyset.ts';
import { createRequestLock, lockDirForSessionFile } from '../src/requestLock.ts';
import { expiryStatus, readBootstrappedAt } from '../src/sessionLifetime.ts';
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

  const confidential = isConfidential(cfg);
  logger.info({ confidential }, confidential
    ? 'confidential client — atproto grants this session a 2-year ceiling'
    : 'PUBLIC client — atproto caps this session at 14 days; set BLUESKY_PRIVATE_JWK to lift it');

  const rawSessionStore = envMode
    ? createEnvSessionStore<NodeSavedSession>(cfg.blueskyOauthSessionEnv!)
    : createFileSessionStore<NodeSavedSession>(cfg.blueskySessionFile);
  // @atproto/oauth-client purges the session on any refresh error. Keep a copy
  // so a later run can say *why* the session is missing instead of reporting
  // the library's misleading "deleted by another process".
  const sessionStore = envMode
    ? rawSessionStore
    : withDeletionAudit<NodeSavedSession>(
        rawSessionStore,
        `${cfg.blueskySessionFile}.revoked`,
        (key, hadValue) => {
          if (hadValue) {
            logger.error(
              { did: key, auditFile: `${cfg.blueskySessionFile}.revoked` },
              'session PURGED by the OAuth client after a refresh failure — every later run will ' +
                'fail until `make bluesky-bootstrap` is re-run',
            );
          }
        },
      );
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

  if (!envMode) {
    const bootstrappedAt = await readBootstrappedAt(cfg.blueskySessionFile);
    if (bootstrappedAt) {
      const status = expiryStatus(bootstrappedAt, confidential);
      if (status.expired) {
        logger.error({ expiresAt: status.expiresAt.toISOString(), bootstrappedAt: bootstrappedAt.toISOString() },
          'session is past its absolute lifetime ceiling — re-run `make bluesky-bootstrap`');
      } else if (status.shouldWarn) {
        logger.warn({ expiresAt: status.expiresAt.toISOString(), daysRemaining: status.daysRemaining },
          'session approaching its absolute lifetime ceiling — schedule `make bluesky-bootstrap`');
      }
    }
  }

  let agent: Agent | null = null;
  if (!values['dry-run']) {
    // Distinguish "never bootstrapped / purged" from "refresh rejected" before
    // asking the library, which conflates both into "deleted by another process".
    const stored = await sessionStore.get(did);
    if (stored === undefined) {
      logger.error({ did, sessionFile: cfg.blueskySessionFile },
        'no stored session for this DID — it was never bootstrapped, or a previous refresh failure ' +
          'purged it. Re-run `make bluesky-bootstrap`.');
      return EXIT.CONFIG;
    }

    const client = new NodeOAuthClient({
      clientMetadata: buildClientMetadata(cfg),
      keyset: await loadClientKeyset(cfg),
      // Without this the library warns "No lock mechanism provided. Credentials
      // might get revoked." and falls back to a sleep-and-recheck heuristic.
      requestLock: createRequestLock({ dir: lockDirForSessionFile(cfg.blueskySessionFile) }),
      stateStore,
      sessionStore,
    });
    let oauthSession;
    try {
      oauthSession = await client.restore(did);
    } catch (err) {
      logger.error({ err, did, confidential }, 'OAuth restore failed — refresh rejected; re-run `make bluesky-bootstrap`');
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
      const [resolved, embed] = await Promise.all([
        Promise.all(r.mentions.map(async (m) => ({ ...m, did: await resolver.resolve(m.handle) }))),
        embedBuilder.build(r.embedUri),
      ]);

      let text = r.text;
      let linkFacet: unknown | null = null;
      if (!embed) {
        const suffix = `\n${r.embedUri}`;
        const maxTextLen = 300 - graphemeLength(suffix);
        if (graphemeLength(text) > maxTextLen) {
          text = truncateGraphemes(text, maxTextLen);
        }
        const linkStart = Buffer.byteLength(text, 'utf8') + 1;
        text = `${text}${suffix}`;
        const linkEnd = Buffer.byteLength(text, 'utf8');
        linkFacet = {
          index: { byteStart: linkStart, byteEnd: linkEnd },
          features: [{ $type: 'app.bsky.richtext.facet#link', uri: r.embedUri }],
        };
      }

      // truncateGraphemes only trims from the tail — a mention whose byteEnd
      // now exceeds the pre-suffix text length was clipped and must be
      // dropped. byteEnd is computed against the original r.text, which is
      // identical to the truncated text on its retained prefix.
      const truncatedByteLen = linkFacet
        ? Buffer.byteLength(text, 'utf8') - Buffer.byteLength(`\n${r.embedUri}`, 'utf8')
        : Buffer.byteLength(text, 'utf8');

      const facets: unknown[] = [];
      for (const m of resolved) {
        if (!m.did) continue;
        if (m.byteEnd > truncatedByteLen) continue;
        facets.push({
          index: { byteStart: m.byteStart, byteEnd: m.byteEnd },
          features: [{ $type: 'app.bsky.richtext.facet#mention', did: m.did }],
        });
      }
      for (const l of r.links) {
        if (l.byteEnd > truncatedByteLen) continue;
        facets.push({
          index: { byteStart: l.byteStart, byteEnd: l.byteEnd },
          features: [{ $type: 'app.bsky.richtext.facet#link', uri: l.uri }],
        });
      }
      if (linkFacet) facets.push(linkFacet);

      return { text, facets, embed: embed ?? undefined };
    }),
  );

  const leadFacets = draft.lead.linkRange
    ? [{
        index: { byteStart: draft.lead.linkRange.byteStart, byteEnd: draft.lead.linkRange.byteEnd },
        features: [{ $type: 'app.bsky.richtext.facet#link', uri: draft.lead.linkRange.uri }],
      }]
    : undefined;

  let rootUri: string;
  try {
    rootUri = await postThread(agent as never, {
      lead: { text: draft.lead.text, facets: leadFacets },
      enrichedReplies,
    });
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
