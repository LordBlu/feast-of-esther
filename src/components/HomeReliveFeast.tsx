'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styles from './HomeReliveFeast.module.css';

const GRID_SIZE = 9;
const TICK_MS = 3000;

interface HomeReliveFeastProps {
  title?: string;
  subtitle?: string;
  images: string[];
}

export default function HomeReliveFeast({
  title = 'Relive the Feast',
  subtitle = 'Moments from worship, fellowship, and renewal across North America.',
  images,
}: HomeReliveFeastProps) {
  const pool = useMemo(() => images.filter(Boolean), [images]);
  const [tick, setTick] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = () => setReducedMotion(mq.matches);
    fn();
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  useEffect(() => {
    if (reducedMotion || pool.length < 2) return;
    const id = window.setInterval(() => setTick((t) => t + 1), TICK_MS);
    return () => window.clearInterval(id);
  }, [pool.length, reducedMotion]);

  if (pool.length < GRID_SIZE) return null;

  return (
    <section className={styles.section} aria-labelledby="home-relive-heading">
      <div className={styles.overlay} aria-hidden />

      <header className={styles.header}>
        <p className={styles.eyebrow}>Gallery</p>
        <h2 id="home-relive-heading" className={styles.title}>
          {title}
        </h2>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </header>

      <div className={styles.gridWrap}>
        <div className={styles.grid} aria-live="polite">
          {Array.from({ length: GRID_SIZE }, (_, cellIndex) => {
            const src = pool[(cellIndex + tick) % pool.length];
            return (
              <div key={cellIndex} className={styles.cell}>
                <img
                  src={src}
                  alt=""
                  className={`${styles.cellImg} ${styles.cellImgVisible}`}
                  decoding="async"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </div>

      <footer className={styles.footer}>
        <Link href="/gallery" className={styles.cta}>
          View full gallery →
        </Link>
      </footer>
    </section>
  );
}
