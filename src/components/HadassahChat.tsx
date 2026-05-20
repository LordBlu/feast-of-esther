'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  HADASSAH_CANNED,
  HADASSAH_INTRO,
  HADASSAH_STARTER_REPLIES,
  type HadassahQuickReply,
} from '@/lib/hadassah-canned';
import styles from './HadassahChat.module.css';

const MAX_MESSAGES_FOR_API = 24;

type Turn = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  at: number;
  quickReplies?: HadassahQuickReply[];
};

function formatTime(at: number): string {
  return new Date(at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function initialTurn(): Turn {
  return {
    id: makeId(),
    role: 'assistant',
    content: HADASSAH_INTRO,
    at: Date.now(),
    quickReplies: HADASSAH_STARTER_REPLIES,
  };
}

export default function HadassahChat() {
  const router = useRouter();
  const [minimized, setMinimized] = useState(true);
  const [turns, setTurns] = useState<Turn[]>(() => [initialTurn()]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const historyRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = historyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [turns, loading, scrollToBottom]);

  const pushAssistant = useCallback((content: string, quickReplies?: HadassahQuickReply[]) => {
    setTurns((prev) => [
      ...prev,
      {
        id: makeId(),
        role: 'assistant',
        content,
        at: Date.now(),
        quickReplies,
      },
    ]);
  }, []);

  const pushUser = useCallback((content: string) => {
    setTurns((prev) => [
      ...prev,
      {
        id: makeId(),
        role: 'user',
        content,
        at: Date.now(),
      },
    ]);
  }, []);

  const applyCanned = useCallback(
    (cannedId: string) => {
      const canned = HADASSAH_CANNED[cannedId];
      if (!canned) return;
      pushAssistant(canned.content, canned.quickReplies);
    },
    [pushAssistant]
  );

  const sendToApi = useCallback(
    async (userText: string, history: Turn[]) => {
      const payloadMessages = [
        ...history.map((t) => ({ role: t.role, content: t.content })),
        { role: 'user' as const, content: userText },
      ].slice(-MAX_MESSAGES_FOR_API);

      setLoading(true);
      setError('');

      try {
        const res = await fetch('/api/hadassah', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: payloadMessages }),
        });
        const data: unknown = await res.json();
        if (!res.ok) {
          const msg =
            typeof data === 'object' &&
            data !== null &&
            'error' in data &&
            typeof (data as { error?: string }).error === 'string'
              ? (data as { error: string }).error
              : `Request failed (${res.status})`;
          throw new Error(msg);
        }
        const reply =
          typeof data === 'object' &&
          data !== null &&
          'message' in data &&
          typeof (data as { message?: unknown }).message === 'string'
            ? (data as { message: string }).message.trim()
            : '';
        if (!reply) throw new Error('empty');
        pushAssistant(reply);
      } catch {
        setError('Hadassah could not respond right now. Please try again in a moment.');
      } finally {
        setLoading(false);
      }
    },
    [pushAssistant]
  );

  function handleQuickReply(reply: HadassahQuickReply, turnIndex: number) {
    if (loading) return;

    setTurns((prev) =>
      prev.map((t, i) => (i === turnIndex ? { ...t, quickReplies: undefined } : t))
    );

    pushUser(reply.label);

    if (reply.cannedId) {
      window.setTimeout(() => applyCanned(reply.cannedId!), 120);
      return;
    }

    if (reply.href) {
      const path = reply.href;
      if (path.includes('registration')) {
        window.setTimeout(() => applyCanned('registration'), 120);
      } else if (path.includes('events')) {
        window.setTimeout(() => applyCanned('events'), 120);
      } else {
        window.setTimeout(() => {
          pushAssistant('Opening that page for you now.');
          router.push(path);
        }, 120);
      }
      return;
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || loading) return;

    setDraft('');
    setError('');
    const userTurn: Turn = { id: makeId(), role: 'user', content: text, at: Date.now() };
    const nextTurns = [...turns, userTurn];
    setTurns(nextTurns);
    await sendToApi(text, nextTurns);
  }

  function handleOpen() {
    setMinimized(false);
    if (turns.length === 0) {
      setTurns([initialTurn()]);
    }
  }

  if (minimized) {
    return (
      <button type="button" className={styles.launcher} aria-label="Open Hadassah" onClick={handleOpen}>
        <span>Hadassah</span>
      </button>
    );
  }

  return (
    <section className={styles.window} aria-label="Hadassah chat">
      <header className={styles.topBar}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => setMinimized(true)}
          aria-label="Close Hadassah"
        >
          ×
        </button>
      </header>

      <div ref={historyRef} className={styles.history}>
        <div className={styles.historyInner}>
          {turns.map((turn, index) => (
            <div key={turn.id} className={styles.turn}>
              <p className={styles.turnMeta}>
                <span className={styles.turnName}>{turn.role === 'assistant' ? 'Hadassah' : 'You'}</span>
                <span className={styles.turnTime}>{formatTime(turn.at)}</span>
              </p>
              <p className={styles.turnBody}>{turn.content}</p>
              {turn.quickReplies?.length ? (
                <div className={styles.pillRow} role="group" aria-label="Suggested replies">
                  {turn.quickReplies.map((reply, pillIndex) => (
                    <button
                      key={reply.id}
                      type="button"
                      className={`${styles.pill} ${
                        index === 0 && pillIndex === 0 ? styles.pillPrimary : ''
                      }`}
                      onClick={() => handleQuickReply(reply, index)}
                      disabled={loading}
                    >
                      {reply.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {loading ? (
            <div className={styles.thinking} aria-live="polite">
              <span className={styles.thinkingDots} aria-hidden />
              Thinking…
            </div>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <form className={styles.composer} onSubmit={handleSubmit}>
        <span className={styles.composerMark} aria-hidden>
          <span className={styles.composerDot} />
          <span className={styles.composerDot} />
          <span className={styles.composerDot} />
        </span>
        <span className={styles.composerDivider} aria-hidden />
        <input
          className={styles.input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask me anything…"
          aria-label="Ask Hadassah anything"
          disabled={loading}
          autoComplete="off"
        />
      </form>
    </section>
  );
}
