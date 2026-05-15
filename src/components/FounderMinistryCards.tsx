'use client';

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CARDS.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [prefersReducedMotion]);

  return (
    <section className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-[minmax(200px,240px)_1fr] md:gap-10 md:pt-2">
      <div className="p-1 md:p-0">
        <ul className="mx-auto flex w-full max-w-xs flex-col gap-2 md:max-w-none">
          {CARDS.map((card, idx) => {
            const active = idx === activeIndex;
            return (
              <li key={card.title}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className="w-full rounded-none px-4 py-3 text-left transition-all md:px-5 md:py-3.5"
                  style={{
                    color: active ? '#fff' : '#6b7280',
                    background: active ? 'var(--primary)' : 'transparent',
                    border: active ? '1.5px solid var(--primary)' : '1.5px solid transparent',
                    boxShadow: 'none',
                  }}
                  aria-pressed={active}
                >
                  <span
                    className="block text-[1.24rem] leading-tight md:text-[1.34rem]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {card.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative min-h-[330px] overflow-hidden rounded-2xl bg-white/75 shadow-[0_12px_36px_rgba(106,15,53,0.09)] md:min-h-[360px]">
        {CARDS.map((card, idx) => {
          const active = idx === activeIndex;
          return (
            <article
              key={card.title}
              className={`absolute inset-0 transition-opacity duration-700 ${
                active ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              aria-hidden={!active}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${card.image})`, opacity: 0.11 }}
                aria-hidden
              />
              <div className="relative z-[1] flex h-full flex-col justify-center p-7 md:p-10">
                <p className="mb-3 text-left text-[12px] font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
                  Ministry Focus
                </p>
                <h2
                  className="mb-4 text-left text-[clamp(2rem,3vw,2.6rem)]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--primary-dark)',
                    fontStyle: 'italic',
                    lineHeight: 1.1,
                  }}
                >
                  {card.title}
                </h2>
                <div className="mb-6 h-px w-14 bg-[var(--gold)]" />
                <p className="max-w-3xl whitespace-pre-line text-left text-[15px] leading-relaxed text-gray-700 md:text-[17px] md:leading-[1.7]">
                  {card.text}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
