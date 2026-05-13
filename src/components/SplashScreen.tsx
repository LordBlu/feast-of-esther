'use client';

import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2200);
    const hideTimer = setTimeout(() => setVisible(false), 2800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-600"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <div className="relative flex items-center justify-center w-40 h-40">

        {/* Outer rotating ring */}
        <div
          className="absolute w-40 h-40 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: 'var(--primary)',
            borderRightColor: 'var(--primary-light)',
            animation: 'spin 1.4s linear infinite',
          }}
        />

        {/* Middle pulsing ring */}
        <div
          className="absolute w-32 h-32 rounded-full border-2"
          style={{
            borderColor: 'var(--primary-light)',
            animation: 'pulse 1.4s ease-in-out infinite',
          }}
        />

        {/* Logo placeholder — swap src when you have the logo file */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          FOE
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}