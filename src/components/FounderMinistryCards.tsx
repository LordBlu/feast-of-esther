'use client';

import { useEffect, useState } from 'react';
import type { FounderMinistryCard } from '@/lib/cms-types';
import { cloudinarySizedUrl } from '@/lib/cloudinary-url';
import styles from './FounderMinistryCards.module.css';

const ROTATE_MS = 15_000;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = () => setReduced(mq.matches);
    fn();
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return reduced;
}

interface FounderMinistryCardsProps {
  cards: FounderMinistryCard[];
}

export default function FounderMinistryCards({ cards }: FounderMinistryCardsProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  const rows = cards.filter((c) => c.title?.trim());

  useEffect(() => {
    if (prefersReducedMotion || rows.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % rows.length);
      setProgressKey((k) => k + 1);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [prefersReducedMotion, rows.length]);

  function selectTab(idx: number) {
    setActiveIndex(idx);
    setProgressKey((k) => k + 1);
  }

  if (!rows.length) return null;

  return (
    <section className={styles.section} aria-labelledby="founder-ministry-heading">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Ministry</p>
        <h2 id="founder-ministry-heading" className={styles.title}>
          Her Ministry Worldwide
        </h2>
      </header>

      <div className={styles.layout}>
        <ul className={styles.tabList}>
          {rows.map((card, idx) => {
            const active = idx === activeIndex;
            return (
              <li key={card.title}>
                <button
                  type="button"
                  onClick={() => selectTab(idx)}
                  className={`${styles.tabBtn} ${active ? styles.tabActive : ''}`}
                  aria-pressed={active}
                >
                  <span className={styles.tabLabel}>{card.title}</span>
                  {active && !prefersReducedMotion ? (
                    <span key={progressKey} className={styles.tabProgress} aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        <div className={styles.panel}>
          {rows.map((card, idx) => {
            const active = idx === activeIndex;
            const imageUrl = card.imageUrl?.trim();
            return (
              <article
                key={card.title}
                className={`${styles.slide} ${active ? styles.slideActive : ''}`}
                aria-hidden={!active}
              >
                {imageUrl ? (
                  <div
                    className={styles.slideBg}
                    style={{ backgroundImage: `url(${cloudinarySizedUrl(imageUrl, 960)})` }}
                    aria-hidden
                  />
                ) : null}
                <div className={styles.slideVeil} aria-hidden />
                <div className={styles.slideInner}>
                  <p className={styles.kicker}>Ministry Focus</p>
                  <h3 className={styles.slideTitle}>{card.title}</h3>
                  <div className={styles.rule} aria-hidden />
                  <p className={styles.slideCopy}>{card.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
