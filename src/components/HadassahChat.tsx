'use client';

import { useState } from 'react';
import styles from './HadassahChat.module.css';

type Message = {
  role: 'assistant' | 'user';
  content: string;
};

const PORTRAIT_URL =
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778084218/founder_m47pqn.jpg';

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setDraft('');
  };

  if (minimized) {
    return (
      <button
        type="button"
        className={styles.launcher}
        aria-label="Open Hadassah assistant"
        onClick={() => setMinimized(false)}
      >
        <img src={PORTRAIT_URL} alt="" className={styles.launcherPortrait} />
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
          aria-label="Minimize Hadassah assistant"
        >
          −
        </button>
        <img src={PORTRAIT_URL} alt="Hadassah portrait" className={styles.hadassahPortrait} />
        <h3 className={styles.title}>Hadassah Assistant</h3>
        <p className={styles.subtitle}>Always here to help</p>
      </header>

      <div className={styles.history}>
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`${styles.message} ${message.role === 'assistant' ? styles.assistant : styles.user}`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <form className={styles.composer} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask Hadassah anything..."
          aria-label="Ask Hadassah anything"
        />
      </form>
    </section>
  );
}
