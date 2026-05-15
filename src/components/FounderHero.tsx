import Link from 'next/link';

interface FounderHeroProps {
  backgroundSrc: string;
}

/**
 * Full-viewport hero designed to sit inside a sticky wrapper (Dockers / case-study style:
 * parent section is taller than the viewport so this scene stays pinned while the user scrolls).
 */
export default function FounderHero({ backgroundSrc }: FounderHeroProps) {
  return (
    <section
      className="relative isolate flex h-full min-h-screen w-full flex-col justify-end overflow-hidden md:justify-center"
      aria-labelledby="founder-hero-heading"
    >
      <div className="founder-hero-media" aria-hidden>
        <img
          src={backgroundSrc}
          alt=""
          className="founder-hero-img"
          fetchPriority="high"
          decoding="async"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/48 to-black/32"
          aria-hidden
        />
      </div>

      <div className="relative z-[1] foe-shell w-full pb-12 pt-24 md:pb-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <p
              className="mb-6 inline-block rounded-full px-6 py-3 text-[0.9rem] font-extrabold uppercase tracking-[0.2em] shadow-lg sm:px-8 sm:py-4 sm:text-[1.02rem] sm:tracking-[0.22em]"
              style={{
                fontFamily: 'var(--font-body)',
                backgroundColor: 'var(--gold)',
                color: '#2a1f0d',
                boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              }}
            >
              The Visionary
            </p>
            <h2
              id="founder-hero-heading"
              className="mb-5 max-w-xl text-[clamp(2rem,5.5vw,3.5rem)] font-normal leading-[1.08] text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Pastor Mrs. Folu Adeboye
            </h2>
            <div className="h-1.5 w-20 rounded-full" style={{ backgroundColor: 'var(--gold)' }} aria-hidden />
          </div>

          <div className="flex gap-6 lg:justify-end">
            <div className="hidden w-px shrink-0 bg-[var(--gold)] opacity-90 sm:block" aria-hidden />
            <div className="max-w-md space-y-6 text-white/95">
              <p className="text-[15px] leading-relaxed md:text-base" style={{ fontFamily: 'var(--font-body)' }}>
                Wife of the General Overseer of the Redeemed Christian Church of God (RCCG) Worldwide — a mother,
                mentor, teacher, and visionary behind the Feast of Esther.
              </p>
              <Link
                href="#founder-story"
                className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)' }}
              >
                Explore her legacy <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
