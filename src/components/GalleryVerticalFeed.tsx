import Link from 'next/link';
import type { GalleryItem } from '@/lib/gallery-data';
import styles from './GalleryMosaic.module.css';

interface GalleryVerticalFeedProps {
  items: GalleryItem[];
}

type Frame = {
  key: string;
  src: string;
  title: string;
  year: string;
  slug: string;
  size: 'large' | 'tall' | 'wide' | 'standard';
};

/**
 * Detroit-inspired gallery wall:
 * - Tight masonry grid
 * - Mixed image heights
 * - Minimal typography
 */
export default function GalleryVerticalFeed({ items }: GalleryVerticalFeedProps) {
  const sizePattern: Frame['size'][] = ['large', 'tall', 'wide', 'standard', 'tall', 'wide'];
  const frames: Frame[] = items.flatMap((item) =>
    item.images.slice(0, 5).map((src, index) => ({
      key: `${item.slug}-${index}`,
      src,
      title: item.title,
      year: item.year,
      slug: item.slug,
      size: sizePattern[(index + item.slug.length) % sizePattern.length],
    })),
  );

  return (
    <div className="bg-white text-neutral-900">
      <header className="foe-shell pt-24 pb-12 text-center md:pt-32 md:pb-16">
        <p
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-[var(--primary)]/80"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Gallery
        </p>
        <div className="mx-auto max-w-4xl">
          <h1
            className="text-[clamp(2.65rem,8vw,5.1rem)] font-light leading-[1.02] tracking-tight text-[var(--primary-dark)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Moments From the Feast
          </h1>
          <div
            className="mt-4 h-px w-32"
            style={{ background: 'linear-gradient(90deg, var(--gold), rgba(201,168,76,0.1))' }}
            aria-hidden
          />
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            A curated wall of moments. Open any frame to view the full collection story.
          </p>
        </div>
      </header>

      <section className="foe-shell pb-20 md:pb-28">
        <div className={styles.mosaicContainer}>
          {frames.map((frame, index) => (
            <Link
              key={frame.key}
              href={`/gallery/${frame.slug}`}
              className={`${styles.mosaicItem} ${styles[frame.size]}`}
            >
              <img
                src={frame.src}
                alt={`${frame.title} — image`}
                className={styles.mosaicImage}
                loading={index < 8 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <div className={styles.overlay}>
                <span className={styles.overlayTitle}>{frame.title}</span>
                <span className={styles.overlaySub}>{frame.year} Collection</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
