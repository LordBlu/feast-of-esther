'use client';

import { useState } from 'react';
import GalleryImageLightbox, { type LightboxFrame } from '@/components/GalleryImageLightbox';
import SiteImage from '@/components/SiteImage';
import styles from './GalleryImageGrid.module.css';

type Props = {
  images: string[];
  title: string;
  year?: string;
  slug?: string;
};

export default function GalleryImageGrid({ images, title, year = '', slug = '' }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const frames: LightboxFrame[] = images.map((src, idx) => ({
    src,
    title,
    year,
    slug: '',
    alt: `${title} — photo ${idx + 1}`,
  }));

  return (
    <>
      <div className={styles.gridWrap}>
        <div className={styles.grid}>
          {images.map((imageUrl, idx) => (
            <button
              key={`${imageUrl}-${idx}`}
              type="button"
              className={`${styles.cell} ${styles.cellButton}`}
              onClick={() => setLightboxIndex(idx)}
              aria-label={`View larger: ${title} photo ${idx + 1}`}
            >
              <SiteImage
                src={imageUrl}
                alt={`${title} — photo ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                cloudWidth={640}
                priority={idx < 4}
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null ? (
        <GalleryImageLightbox
          frames={frames}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      ) : null}
    </>
  );
}
