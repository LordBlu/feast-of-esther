'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SiteImage from '@/components/SiteImage';
import {
  dedupeReliveImageUrls,
  initialReliveGridUrls,
  nextReliveCellUrl,
  RELIVE_FEAST_GRID_SIZE,
} from '@/lib/relive-feast-grid';
import styles from './HomeReliveFeast.module.css';

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
  src: string;
  reducedMotion: boolean;
  canRotate: boolean;
  onRotate: (cellIndex: number) => void;
}

function ReliveFeastCell({
  cellIndex,
  src,
  reducedMotion,
  canRotate,
  onRotate,
}: ReliveFeastCellProps) {
  const intervalMs = cellIntervalMs(cellIndex);
  const startDelayMs = cellStartDelayMs(cellIndex);

  useEffect(() => {
    if (reducedMotion || !canRotate) return;

    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => onRotate(cellIndex), intervalMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [canRotate, cellIndex, intervalMs, onRotate, reducedMotion, startDelayMs]);

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
  const pool = useMemo(() => dedupeReliveImageUrls(images), [images]);
  const poolKey = pool.join('\n');
  const [cellUrls, setCellUrls] = useState<string[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setCellUrls(initialReliveGridUrls(pool));
  }, [poolKey, pool]);

  const canRotate = pool.length > RELIVE_FEAST_GRID_SIZE;

  const rotateCell = useCallback(
    (cellIndex: number) => {
      setCellUrls((prev) => {
        if (prev.length !== RELIVE_FEAST_GRID_SIZE) return prev;
        const next = [...prev];
        next[cellIndex] = nextReliveCellUrl(pool, prev, cellIndex);
        return next;
      });
    },
    [pool],
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = () => setReducedMotion(mq.matches);
    fn();
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  if (pool.length < RELIVE_FEAST_GRID_SIZE || cellUrls.length !== RELIVE_FEAST_GRID_SIZE) {
    return null;
  }

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
          {cellUrls.map((src, cellIndex) => (
            <ReliveFeastCell
              key={cellIndex}
              cellIndex={cellIndex}
              src={src}
              reducedMotion={reducedMotion}
              canRotate={canRotate}
              onRotate={rotateCell}
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
