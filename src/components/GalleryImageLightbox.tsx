'use client';

import Link from 'next/link';
import { useCallback, useEffect } from 'react';

export type LightboxFrame = {
  src: string;
  title: string;
  year: string;
  slug: string;
  alt: string;
};

interface GalleryImageLightboxProps {
  frames: LightboxFrame[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function GalleryImageLightbox({
  frames,
  index,
  onClose,
  onIndexChange,
}: GalleryImageLightboxProps) {
  const frame = frames[index];
  const hasPrev = index > 0;
  const hasNext = index < frames.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onIndexChange(index - 1);
  }, [hasPrev, index, onIndexChange]);

  const goNext = useCallback(() => {
    if (hasNext) onIndexChange(index + 1);
  }, [hasNext, index, onIndexChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, goPrev, goNext]);

  if (!frame) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/94 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${frame.title} — enlarged photo`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-[2] flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-2xl leading-none text-white transition-colors hover:bg-white/15 md:right-8 md:top-8"
        aria-label="Close"
      >
        ×
      </button>

      {hasPrev ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-2 top-1/2 z-[2] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white transition-colors hover:bg-white/10 md:left-6"
          aria-label="Previous image"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      ) : null}

      {hasNext ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-2 top-1/2 z-[2] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white transition-colors hover:bg-white/10 md:right-6"
          aria-label="Next image"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      ) : null}

      <figure
        className="relative flex max-h-[min(88vh,920px)] max-w-[min(96vw,1200px)] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={frame.src}
          alt={frame.alt}
          className="max-h-[min(78vh,820px)] w-auto max-w-full object-contain shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        />
        <figcaption className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
          <div>
            <p className="text-lg text-white md:text-xl" style={{ fontFamily: 'var(--font-display)' }}>
              {frame.title}
            </p>
            <p
              className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/70"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {frame.year} · {index + 1} of {frames.length}
            </p>
          </div>
          {frame.slug ? (
            <Link
              href={`/gallery/${frame.slug}`}
              className="border border-white/40 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-black"
              style={{ fontFamily: 'var(--font-body)' }}
              onClick={(e) => e.stopPropagation()}
            >
              View collection
            </Link>
          ) : null}
        </figcaption>
      </figure>
    </div>
  );
}
