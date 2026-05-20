'use client';

import Link from 'next/link';
import type { GalleryItem } from '@/lib/gallery-data';
import SiteImage from '@/components/SiteImage';
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
    <div className="gallery-page bg-white text-neutral-900">
      <header className="gallery-page-header gallery-page-header--index foe-shell">
        <div className="gallery-page-header-inner">
          <h1 className="gallery-page-title">{title}</h1>
          <div className="gallery-page-rule" aria-hidden />
          <p className="gallery-page-subtitle gallery-page-subtitle--index">{subtitle}</p>
        </div>
      </header>

      <section className="foe-shell gallery-page__mosaic">
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
                <SiteImage
                  src={cover}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  cloudWidth={index < 6 ? 720 : 560}
                  priority={index < 6}
                  className={styles.mosaicImage}
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
