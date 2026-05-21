'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import SiteImage from '@/components/SiteImage';
import styles from './HomeReliveFeast.module.css';

const GRID_SIZE = 9;
/** Base slide cadence — each cell adds its own offset for a kaleidoscopic rhythm. */
const BASE_INTERVAL_MS = 2000;

function cellIntervalMs(cellIndex: number): number {
  const spread = (cellIndex * 317 + cellIndex * cellIndex * 41) % 750;
  return BASE_INTERVAL_MS + spread;
}

function cellStartDelayMs(cellIndex: number): number {
  return (cellIndex * 401 + 180) % 2200;
}

interface ReliveFeastCellProps {
  cellIndex: number;
  pool: string[];
  reducedMotion: boolean;
}

function ReliveFeastCell({ cellIndex, pool, reducedMotion }: ReliveFeastCellProps) {
  const [index, setIndex] = useState(() => cellIndex % pool.length);
  const intervalMs = cellIntervalMs(cellIndex);
  const startDelayMs = cellStartDelayMs(cellIndex);

  useEffect(() => {
    setIndex(cellIndex % pool.length);
  }, [pool.length, cellIndex]);

  useEffect(() => {
    if (reducedMotion || pool.length < 2) return;

    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(
        () => setIndex((prev) => (prev + 1) % pool.length),
        intervalMs,
      );
    }, startDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [pool.length, reducedMotion, intervalMs, startDelayMs]);

  const src = pool[index % pool.length];

  return (
    <div className={styles.cell}>
      <SiteImage
        key={src}
        src={src}
        alt=""
        fill
        sizes="(max-width: 640px) 33vw, 20vw"
        cloudWidth={480}
        className={`${styles.cellImg} ${styles.cellImgVisible}`}
      />
    </div>
  );
}

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
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = () => setReducedMotion(mq.matches);
    fn();
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

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
          {Array.from({ length: GRID_SIZE }, (_, cellIndex) => (
            <ReliveFeastCell
              key={cellIndex}
              cellIndex={cellIndex}
              pool={pool}
              reducedMotion={reducedMotion}
            />
          ))}
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

