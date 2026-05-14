'use client';

import Link from 'next/link';

const NAV_H = 68;

export default function GalleryBackUnderLogo() {
  return (
    <div
      className="pointer-events-none fixed left-0 right-0 z-[35]"
      style={{ top: `${NAV_H}px` }}
    >
      <div className="pointer-events-auto mx-auto max-w-7xl px-6 pt-2 lg:px-10">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-neutral-600 transition-colors hover:text-neutral-900"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <span
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-900 text-neutral-900"
            aria-hidden
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
          <span>Back</span>
        </Link>
      </div>
    </div>
  );
}
