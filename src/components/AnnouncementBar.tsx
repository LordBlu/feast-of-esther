'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('foe-announcement-dismissed')) {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{ backgroundColor: 'var(--primary)' }}
      className="flex w-full items-center justify-between text-white"
    >
      {/* Left spacer (balances the close button) */}
      <div className="w-12 shrink-0" />

      {/* Centre content */}
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 py-3 px-4 text-center">
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
            fontStyle: 'italic',
            fontWeight: 400,
            letterSpacing: '0.01em',
            lineHeight: 1.3,
          }}
        >
          Feast of Esther 2026 — June 18–20, North America
        </p>

        <Link
          href="/registration"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--primary)',
            backgroundColor: '#fff',
            padding: '0.4rem 1.1rem',
            borderRadius: '2px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s',
            flexShrink: 0,
          }}
          className="hover:opacity-90"
        >
          Register Now →
        </Link>
      </div>

      {/* Close button */}
      <button
        onClick={() => {
          sessionStorage.setItem('foe-announcement-dismissed', '1');
          setVisible(false);
        }}
        className="w-12 shrink-0 flex items-center justify-center self-stretch hover:bg-white/10 transition-colors"
        aria-label="Dismiss"
        style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)' }}
      >
        ×
      </button>
    </div>
  );
}
