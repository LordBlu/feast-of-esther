'use client';

import Link from 'next/link';

interface GalleryPageBackProps {
  href?: string;
  label?: string;
}

/** Sticky strip directly under the main nav — stays visible while scrolling. */
export default function GalleryPageBack({ href = '/gallery', label = 'Back' }: GalleryPageBackProps) {
  return (
    <div className="gallery-page-back-bar">
      <div className="foe-shell">
        <Link
          href={href}
          className="gallery-page-back-link"
        >
          <span className="gallery-page-back-icon" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
          <span>{label}</span>
        </Link>
      </div>
    </div>
  );
}
