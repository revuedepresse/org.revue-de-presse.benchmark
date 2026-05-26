export type DiscuterTurn = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type DiscuterCitation = {
  n: number;
  publicationId: string;
  screenName: string;
  snapshotDate: string;
  url: string;
  text: string;
};

export type DiscuterStatus =
  | 'unauthenticated'
  | 'authenticating'
  | 'idle'
  | 'streaming'
  | 'error';

export type DiscuterErrorCode =
  | 'rate_limited_user'
  | 'rate_limited_global'
  | 'providers_exhausted'
  | 'truncated'
  | 'bluesky_login_failed';

const MESSAGES_KEY = 'rdp:chat:messages';
const CITATIONS_KEY = 'rdp:chat:citations';
const STATUS_KEY = 'rdp:chat:status';
const DRAFT_KEY = 'rdp:chat:draft';
const CONVERSATION_KEY = 'rdp:chat:conversationId';
const ERROR_KEY = 'rdp:chat:errorCode';

type SseFrame = { event: string; data: string };

function parseFrame(raw: string): SseFrame | null {
  let event = 'message';
  const dataLines: string[] = [];
  for (const line of raw.split('\n')) {
    if (line === '') continue;
    const colon = line.indexOf(':');
    const field = colon === -1 ? line : line.slice(0, colon);
    const value = colon === -1 ? '' : line.slice(colon + 1).replace(/^ /, '');
    if (field === 'event') event = value;
    else if (field === 'data') dataLines.push(value);
  }
  if (dataLines.length === 0) return null;
  return { event, data: dataLines.join('\n') };
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * SSE consumer + reactive state for the /discuter page. Messages and
 * conversation id persist across navigation within the SPA lifetime.
 */
export const useChat = () => {
  const messages = useState<DiscuterTurn[]>(MESSAGES_KEY, () => []);
  const citations = useState<DiscuterCitation[]>(CITATIONS_KEY, () => []);
  const status = useState<DiscuterStatus>(STATUS_KEY, () => 'unauthenticated');
  const draft = useState<string>(DRAFT_KEY, () => '');
  const conversationId = useState<string | null>(CONVERSATION_KEY, () => null);
  const errorCode = useState<DiscuterErrorCode | undefined>(ERROR_KEY, () => undefined);

  let controller: AbortController | null = null;

  const reset = (): void => {
    messages.value = [];
    citations.value = [];
    draft.value = '';
    conversationId.value = null;
    errorCode.value = undefined;
  };

  const cancel = (): void => {
    if (controller !== null) {
      controller.abort();
      controller = null;
    }
  };

  const send = async (text: string): Promise<void> => {
    if (status.value === 'streaming') return;
    const trimmed = text.trim();
    if (trimmed === '') return;

    const userTurn: DiscuterTurn = { id: newId(), role: 'user', content: trimmed };
    const assistantTurn: DiscuterTurn = { id: newId(), role: 'assistant', content: '' };
    messages.value = [...messages.value, userTurn, assistantTurn];

    status.value = 'streaming';
    draft.value = '';
    citations.value = [];
    errorCode.value = undefined;

    controller = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({
          userMessage: trimmed,
          conversationId: conversationId.value,
        }),
        signal: controller.signal,
      });

      if (!res.ok || res.body === null) {
        if (res.status === 401) {
          status.value = 'unauthenticated';
          return;
        }
        status.value = 'error';
        errorCode.value = 'providers_exhausted';
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finished = false;

      while (!finished) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let sep = buffer.indexOf('\n\n');
        while (sep !== -1) {
          const rawFrame = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          const frame = parseFrame(rawFrame);
          if (frame !== null) {
            finished = handleFrame(frame) || finished;
          }
          sep = buffer.indexOf('\n\n');
        }
      }

      if (status.value === 'streaming') {
        status.value = 'idle';
      }
    } catch (err) {
      if (controller?.signal.aborted) {
        // Cancelled by user → mark the last assistant turn as truncated.
        const last = messages.value[messages.value.length - 1];
        if (last && last.role === 'assistant' && last.content === '') {
          messages.value = messages.value.slice(0, -1);
        }
        status.value = 'idle';
      } else {
        console.error('chat stream failed', err);
        status.value = 'error';
        errorCode.value = 'providers_exhausted';
      }
    } finally {
      controller = null;
    }
  };

  /** @returns true if the stream is finished (done/error frame). */
  const handleFrame = (frame: SseFrame): boolean => {
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(frame.data) as Record<string, unknown>;
    } catch {
      return false;
    }

    if (frame.event === 'token' && typeof payload.delta === 'string') {
      const last = messages.value[messages.value.length - 1];
      if (last && last.role === 'assistant') {
        const updated = { ...last, content: last.content + payload.delta };
        messages.value = [...messages.value.slice(0, -1), updated];
      }
      return false;
    }

    if (frame.event === 'done') {
      const cits = Array.isArray(payload.citations) ? (payload.citations as DiscuterCitation[]) : [];
      citations.value = cits;
      if (typeof payload.conversationId === 'string') {
        conversationId.value = payload.conversationId;
      }
      status.value = 'idle';
      return true;
    }

    if (frame.event === 'error') {
      const code = typeof payload.code === 'string' ? (payload.code as DiscuterErrorCode) : 'providers_exhausted';
      errorCode.value = code;
      status.value = 'error';
      return true;
    }

    return false;
  };

  const setDraft = (next: string): void => {
    draft.value = next;
  };

  return {
    messages,
    citations,
    status,
    draft,
    conversationId,
    errorCode,
    send,
    cancel,
    reset,
    setDraft,
  };
};
