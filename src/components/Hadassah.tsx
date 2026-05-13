'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function IconSend({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/** Optional looping avatar — add `public/videos/hadassah-avatar.mp4` (muted talking-head loop). */
const AVATAR_VIDEO_SRC = '/videos/hadassah-avatar.mp4';

const QUICK_PROMPTS = [
  'What is Feast of Esther?',
  'When and where is 2026?',
  'How do I register?',
];

export default function Hadassah() {
  const [chatOpen, setChatOpen] = useState(false);
  const [videoOk, setVideoOk] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi — I'm Hadassah, your guide for Feast of Esther North America. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const payload = (text ?? input).trim();
    if (!payload || loading) return;
    const userMessage: Message = { role: 'user', content: payload };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/hadassah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm sorry, I had trouble responding. Please try again or visit our Contact page.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {chatOpen && (
        <div
          className="hadassah-panel fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 flex-col overflow-hidden shadow-[0_28px_90px_rgba(0,0,0,0.55)] md:bottom-28"
          style={{
            width: 'min(420px, calc(100vw - 2rem))',
            height: 'min(604px, calc(100vh - 9rem))',
            borderRadius: '26px',
            background: '#0c0c0c',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Hadassah assistant chat"
        >
          {/* Header controls */}
          <div className="relative z-[2] flex shrink-0 items-center justify-between px-4 pt-4 text-white/90">
            <button
              type="button"
              className="rounded-full p-2 transition-colors hover:bg-white/10"
              aria-label="Close chat"
              onClick={() => setChatOpen(false)}
            >
              <span className="text-lg leading-none">‹</span>
            </button>
            <button
              type="button"
              className="rounded-full p-2 transition-colors hover:bg-white/10"
              aria-label="Close"
              onClick={() => setChatOpen(false)}
            >
              <IconClose />
            </button>
          </div>

          {/* Avatar / video band (offmenu-style) */}
          <div
            className="relative -mt-2 mx-3 h-[min(32%,200px)] min-h-[120px] shrink-0 overflow-hidden rounded-2xl bg-[#111]"
            style={{ maxHeight: '200px' }}
          >
            {videoOk ? (
              <video
                className="h-full w-full object-cover object-top"
                src={AVATAR_VIDEO_SRC}
                autoPlay
                muted
                loop
                playsInline
                onError={() => setVideoOk(false)}
              />
            ) : (
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-1 text-center"
                style={{
                  background:
                    'linear-gradient(160deg, var(--primary-dark) 0%, #1a0a12 100%)',
                }}
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-medium italic text-white/95"
                  style={{
                    fontFamily: 'var(--font-display)',
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  H
                </div>
                <p className="px-4 text-xs text-white/50" style={{ fontFamily: 'var(--font-flip-label, var(--font-body))' }}>
                  Optional avatar loop — add <span className="text-white/75">public/videos/hadassah-avatar.mp4</span>
                </p>
              </div>
            )}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(12,12,12,0.85) 100%)',
              }}
            />
            <p
              className="absolute bottom-3 left-4 right-4 text-sm text-white/95"
              style={{ fontFamily: 'var(--font-flip-label, var(--font-body))' }}
            >
              <span className="font-semibold">Hadassah</span>
              <span className="text-white/50"> — Feast of Esther assistant</span>
            </p>
          </div>

          <div className="px-4 pb-3 pt-4">
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  disabled={loading}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-left text-xs text-white/85 transition-colors hover:border-white/25 hover:bg-white/10 disabled:opacity-40"
                  style={{ fontFamily: 'var(--font-flip-label, var(--font-body))' }}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                href="/registration"
                className="rounded-full border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 hover:bg-white/10"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Register
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 hover:bg-white/10"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Contact
              </Link>
            </div>
          </div>

          <div
            className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[88%] px-3.5 py-2.5 text-sm leading-relaxed"
                  style={{
                    backgroundColor: msg.role === 'user' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                    color: msg.role === 'user' ? '#fff' : 'rgba(255,255,255,0.88)',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontFamily: 'var(--font-flip-label, var(--font-body))',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-2 rounded-2xl px-4 py-3"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    fontFamily: 'var(--font-flip-label, var(--font-body))',
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.55)',
                  }}
                >
                  <span className="inline-flex gap-1">
                    {[0, 0.15, 0.3].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full animate-bounce bg-[var(--gold)]"
                        style={{ animationDelay: `${d}s` }}
                      />
                    ))}
                  </span>
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div
            className="flex shrink-0 items-center gap-2 px-3 py-3"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(0,0,0,0.35)',
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5"
              aria-hidden
            >
              <span className="grid h-2 w-2 grid-cols-2 gap-0.5 opacity-60">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-0.5 w-0.5 rounded-full bg-white" />
                ))}
              </span>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask me anything…"
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/35"
              style={{ fontFamily: 'var(--font-flip-label, var(--font-body))' }}
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#0c0c0c] transition-opacity hover:opacity-90 disabled:opacity-30"
              style={{ background: 'var(--gold)' }}
              aria-label="Send message"
            >
              <IconSend />
            </button>
          </div>
        </div>
      )}

      {/* Split launcher — larger two-part pill */}
      <button
        type="button"
        onClick={() => setChatOpen((prev) => !prev)}
        className="hadassah-launcher fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full px-3 py-2 text-white transition-transform hover:scale-[1.02] active:scale-[0.98] md:bottom-7"
        style={{
          minHeight: '56px',
          maxWidth: 'calc(100vw - 1.5rem)',
          borderRadius: '999px',
          boxShadow: '0 16px 44px rgba(0,0,0,0.45)',
          background: 'linear-gradient(120deg, var(--primary-dark), var(--primary))',
        }}
        aria-expanded={chatOpen}
        aria-label={chatOpen ? 'Close Hadassah chat' : 'Open Hadassah chat'}
      >
        <span
          className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full"
          style={{
            background: 'linear-gradient(145deg, var(--primary-dark), #2a0a18)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {videoOk ? (
            <video
              className="h-full w-full object-cover"
              src={AVATAR_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
              onError={() => setVideoOk(false)}
            />
          ) : (
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1rem' }}>H</span>
          )}
        </span>
        <span className="pr-2 text-[0.72rem] font-semibold uppercase tracking-[0.11em]" style={{ fontFamily: 'var(--font-body)' }}>
          {chatOpen ? 'Close chat' : 'Chat with us'}
        </span>
      </button>
    </>
  );
}
