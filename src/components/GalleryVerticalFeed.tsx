'use client';

import Link from 'next/link';
import type { GalleryItem } from '@/lib/gallery-data';
import styles from './GalleryMosaic.module.css';

const DEFAULT_GALLERY_SUBTITLE =
  'Stories of worship, prayer, and renewal from our gatherings—open a collection to see how God has moved among women in ministry.';

interface GalleryVerticalFeedProps {
  items: GalleryItem[];
  pageTitle?: string;
  pageSubtitle?: string;
}

const sizePattern = ['large', 'tall', 'wide', 'standard', 'tall', 'wide'] as const;

export default function GalleryVerticalFeed({
  items,
  pageTitle,
  pageSubtitle,
}: GalleryVerticalFeedProps) {
  const title = pageTitle?.trim() || 'Moments From the Feast';
  const subtitle = pageSubtitle?.trim() || DEFAULT_GALLERY_SUBTITLE;

  return (
    <div className="bg-white text-neutral-900">
      <header className="gallery-page-header gallery-page-header--index foe-shell">
        <div className="gallery-page-header-inner">
          <h1 className="gallery-page-title">{title}</h1>
          <div className="gallery-page-rule" aria-hidden />
          <p className="gallery-page-subtitle gallery-page-subtitle--index">{subtitle}</p>
        </div>
      </header>

      <section className="foe-shell pb-20 md:pb-28">
        <div className={styles.mosaicContainer}>
          {items.map((item, index) => {
            const size = sizePattern[index % sizePattern.length];
            const cover = item.coverImage || item.images[0];
            if (!cover) return null;

            return (
              <Link
                key={item.slug}
                href={`/gallery/${item.slug}`}
                className={`${styles.mosaicItem} ${styles.mosaicItemLink} ${styles[size]}`}
                aria-label={`Open collection: ${item.title}`}
              >
                <img
                  src={cover}
                  alt={item.title}
                  className={styles.mosaicImage}
                  loading={index < 6 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <div className={styles.overlay}>
                  <span className={styles.overlayTitle}>{item.title}</span>
                  <span className={styles.overlaySub}>{item.year} Collection</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
