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
          <div className="founder-hero-primary">
            <p className="founder-hero-badge">The Visionary</p>
            <h2 id="founder-hero-heading" className="founder-hero-name">
              Pastor Mrs. Folu Adeboye
            </h2>
            <div className="founder-hero-rule" aria-hidden />
          </div>

          <div className="flex gap-6 lg:justify-end">
            <div className="hidden w-px shrink-0 bg-[var(--gold)] opacity-90 sm:block" aria-hidden />
            <div className="founder-hero-aside max-w-md text-white/95">
              <p className="founder-hero-lede">
                Wife of the General Overseer of the Redeemed Christian Church of God (RCCG) Worldwide — a mother,
                mentor, teacher, and visionary behind the Feast of Esther.
              </p>
              <Link href="#founder-story" className="founder-hero-link">
                Explore her legacy <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
