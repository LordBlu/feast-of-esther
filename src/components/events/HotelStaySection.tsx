'use client';

import { useState } from 'react';

const PLACEHOLDER_SLIDES = [
  { label: 'DALLAS', alt: 'Hotel room placeholder' },
  { label: 'DALLAS', alt: 'Hotel stay placeholder 2' },
  { label: 'DALLAS', alt: 'Hotel stay placeholder 3' },
];

function IconWifi({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
    </svg>
  );
}
function IconCar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}
function IconFork({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}
function IconPool({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  );
}

export default function HotelStaySection() {
  const [idx, setIdx] = useState(0);
  const bookingUrl = 'https://www.marriott.com';

  function copyLink() {
    void navigator.clipboard.writeText(bookingUrl);
  }

  return (
    <section className="bg-[#f7f4fb] py-12 md:py-16">
      <div className="foe-shell">
        <div className="grid gap-8 overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(106,15,53,0.08)] lg:grid-cols-2 lg:gap-0">
          <div className="relative aspect-[4/3] min-h-[280px] bg-gradient-to-br from-[#e8dff0] to-[#f5eef5] lg:aspect-auto lg:min-h-[420px]">
            {PLACEHOLDER_SLIDES.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
                style={{ opacity: i === idx ? 1 : 0, pointerEvents: i === idx ? 'auto' : 'none' }}
              >
                <div className="h-24 w-24 rounded-full border-2 border-dashed border-[var(--primary)]/40 bg-white/60" aria-hidden />
                <p className="mt-4 text-sm font-semibold tracking-[0.15em] text-[var(--primary)]/70">
                  OFFICIAL HOTEL
                </p>
              </div>
            ))}
            <span className="absolute bottom-4 right-4 rounded bg-white px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-gray-800 shadow">
              {PLACEHOLDER_SLIDES[idx].label}
            </span>
            <div className="absolute bottom-4 left-4 flex gap-1.5">
              {PLACEHOLDER_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show slide ${i + 1}`}
                  onClick={() => setIdx(i)}
                  className="h-1 w-8 rounded-full bg-white/90 shadow transition hover:bg-white"
                  style={{ opacity: i === idx ? 1 : 0.5 }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-8 text-center md:p-10 lg:p-12">
            <div className="mb-2 h-0.5 w-12 rounded-full bg-[var(--gold)]" />
            <p className="mb-6 text-sm text-gray-600">
              Dallas/Fort Worth Airport Marriott · Irving, TX 75063, USA
            </p>
            <div className="mb-6 grid w-full max-w-md grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-center justify-center gap-2">
                <IconWifi className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                Free WiFi
              </div>
              <div className="flex items-center justify-center gap-2">
                <IconCar className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                Parking
              </div>
              <div className="flex items-center justify-center gap-2">
                <IconFork className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                Restaurant
              </div>
              <div className="flex items-center justify-center gap-2">
                <IconPool className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                Pool
              </div>
            </div>
            <div
              className="mb-8 rounded-lg border border-[var(--gold)]/40 bg-[#fffbeb] px-4 py-3 text-sm leading-relaxed text-gray-700"
            >
              Special group rates available for Feast of Esther attendees when booking through our official link below.
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-gray-900 shadow-md transition hover:opacity-95"
                style={{ background: 'linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 100%)' }}
              >
                Book Your Stay →
              </a>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--primary)] bg-white px-5 py-3 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--blush)]"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
