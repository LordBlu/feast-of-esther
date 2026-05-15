'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './HadassahChat.module.css';

type Message = {
  role: 'assistant' | 'user';
  content: string;
};

const MAX_MESSAGES_FOR_API = 24;

export default function HadassahChat() {
  const [minimized, setMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome. I am Hadassah, your Feast of Esther assistant.',
    },
    {
      role: 'assistant',
      content: 'Ask me about events, registration, chapters, or anything else.',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = historyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    const payloadMessages = [...messages, userMessage].slice(-MAX_MESSAGES_FOR_API);

    setDraft('');
    setError('');
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('/api/hadassah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages.map(({ role, content }) => ({ role, content })),
        }),
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
      if (!reply) throw new Error('Empty reply from assistant.');
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (minimized) {
    return (
      <button
        type="button"
        className={styles.launcher}
        aria-label="Open Hadassah"
        onClick={() => setMinimized(false)}
      >
        <span>Hadassah</span>
      </button>
    );
  }

  return (
    <section className={styles.hadassahChatWindow} aria-label="Hadassah chat window">
      <header className={styles.hadassahHeader}>
        <button
          type="button"
          className={styles.minimizeBtn}
          onClick={() => setMinimized(true)}
          aria-label="Minimize Hadassah"
        >
          −
        </button>
        <h3 className={styles.title}>Hadassah</h3>
        <p className={styles.subtitle}>Always here to help</p>
      </header>

      <div ref={historyRef} className={styles.history}>
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}-${message.content.slice(0, 24)}`}
            className={`${styles.message} ${message.role === 'assistant' ? styles.assistant : styles.user}`}
          >
            {message.content}
          </div>
        ))}
        {loading ? (
          <div className={`${styles.message} ${styles.assistant}`} aria-live="polite">
            …
          </div>
        ) : null}
      </div>

      {error ? (
        <p
          role="alert"
          style={{
            margin: 0,
            padding: '8px 14px',
            fontSize: '0.82rem',
            color: '#ffb4c0',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {error}
        </p>
      ) : null}

      <form className={styles.composer} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask Hadassah anything..."
          aria-label="Ask Hadassah anything"
          disabled={loading}
          autoComplete="off"
        />
      </form>
    </section>
  );
}
