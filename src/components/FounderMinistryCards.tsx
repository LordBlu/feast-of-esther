'use client';

import { useEffect, useState } from 'react';
import styles from './FounderMinistryCards.module.css';

const ROTATE_MS = 15_000;

const CARDS = [
  {
    title: 'Global Impact',
    image:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790070/MA_m27h6y.jpg',
    text:
      'The school is well spread in all states of Nigeria and has spread to many countries of the world especially across West Africa, Europe, the UK and Ireland, Hong Kong and North America, to mention a few.\n\nMummy GO is in charge of Women Affairs. She hosts the annual Women in Ministry program for all female ministers in the RCCG all over the world. She\'s the President of a welfare ministry called Certain Women in Nigeria.',
  },
  {
    title: 'Mission Outreach',
    image:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790078/MA3_txk1xd.jpg',
    text:
      'Her heart of compassion drove her to establish mission outreaches. She established African missions which seek to promote the spread of the gospel worldwide; promote the development of sustainable holistic programs; and promote services that improve the quality of life of children, youth, and families.',
  },
  {
    title: 'Rehabilitation Ministry',
    image:
      'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790096/_MG_3358-2_hz4xxv.jpg',
    text:
      'She established the Habitation of Hope — a home for the rehabilitation of boys taken off the streets and to give them a future and a hope in Christ. These children, who lived and slept on the beach, were involved in petty crime and substance use. In addition to academic education, the program offers vocational training.',
  },
] as const;

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

export default function FounderMinistryCards() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CARDS.length);
      setProgressKey((k) => k + 1);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [prefersReducedMotion]);

  function selectTab(idx: number) {
    setActiveIndex(idx);
    setProgressKey((k) => k + 1);
  }

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
          {CARDS.map((card, idx) => {
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
          {CARDS.map((card, idx) => {
            const active = idx === activeIndex;
            return (
              <article
                key={card.title}
                className={`${styles.slide} ${active ? styles.slideActive : ''}`}
                aria-hidden={!active}
              >
                <div
                  className={styles.slideBg}
                  style={{ backgroundImage: `url(${card.image})` }}
                  aria-hidden
                />
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
