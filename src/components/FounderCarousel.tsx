'use client';

import { useEffect, useState } from 'react';

const AUTO_MS = 5200;

interface FounderCarouselProps {
  urls: string[];
}

export default function FounderCarousel({ urls }: FounderCarouselProps) {
  const slides = urls.filter(Boolean);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="flex aspect-[4/5] w-full max-w-md items-center justify-center rounded-2xl border border-[var(--blush-mid)] bg-gradient-to-br from-[#f3e8f0] to-[#e8dff5]">
        <p className="px-6 text-center text-sm text-gray-500">Add founder carousel images in Admin → Imagery.</p>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-[var(--blush-mid)] bg-black/5 shadow-lg aspect-[4/5]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Founder gallery"
    >
      {slides.map((src, idx) => (
        <img
          key={`${src}-${idx}`}
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1200ms] ease-out"
          style={{ opacity: active === idx ? 1 : 0 }}
          loading={idx === 0 ? 'eager' : 'lazy'}
          draggable={false}
        />
      ))}
      {slides.length > 1 ? (
        <div
          className="absolute bottom-3 left-0 right-0 z-[1] flex justify-center gap-1.5"
          role="tablist"
          aria-label="Carousel slides"
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={active === idx}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setActive(idx)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: active === idx ? '1.25rem' : '0.5rem',
                background: active === idx ? '#fff' : 'rgba(255,255,255,0.45)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
