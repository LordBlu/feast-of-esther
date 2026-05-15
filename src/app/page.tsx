'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { SiteImages } from '@/lib/cms-types';
import FlipClockCountdown from '@/components/FlipClockCountdown';
import HomeReserveStay from '@/components/HomeReserveStay';
import { HERO_CLOUDINARY_SLIDES, HOME_COPY, SITE } from '@/lib/site-content';

/* ── Scroll-reveal hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─────────────────────────────────────────── */

const FALLBACK_VIDEO_EMBED_URL = 'https://www.youtube.com/embed/UVRoPXdUSC8';
const HERO_EXTRA_SLIDES = [
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761811/20260220_131922_g3apl3.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761751/20260219_223504_wkb6xn.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761721/20260219_114313_rsn8hi.jpg',
];

function isUsableHeroSlide(url: string | undefined): url is string {
  const value = url?.trim();
  if (!value) return false;
  return !value.includes('/generated/');
}

function buildAutoplayEmbedUrl(rawUrl: string | undefined): string {
  const input = rawUrl?.trim();
  if (!input) return `${FALLBACK_VIDEO_EMBED_URL}?autoplay=1&mute=1&playsinline=1&rel=0`;

  try {
    const parsed = new URL(input);
    let embedUrl = input;

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '').trim();
      if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
    } else if (parsed.pathname === '/watch') {
      const id = parsed.searchParams.get('v');
      if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
    } else if (parsed.pathname.startsWith('/embed/')) {
      embedUrl = `https://www.youtube.com${parsed.pathname}`;
    }

    const normalized = new URL(embedUrl);
    normalized.searchParams.set('autoplay', '1');
    normalized.searchParams.set('mute', '1');
    normalized.searchParams.set('playsinline', '1');
    normalized.searchParams.set('rel', '0');
    return normalized.toString();
  } catch {
    return `${FALLBACK_VIDEO_EMBED_URL}?autoplay=1&mute=1&playsinline=1&rel=0`;
  }
}

export default function Home() {
  useReveal();
  const [managedImages, setManagedImages] = useState<SiteImages>({});
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    fetch('/api/site-config')
      .then((res) => res.json())
      .then((data) => setManagedImages(data.images ?? {}))
      .catch(() => setManagedImages({}));
  }, []);

  const heroSlides = useMemo(
    () =>
      [managedImages.heroPosterUrl, ...HERO_EXTRA_SLIDES, ...HERO_CLOUDINARY_SLIDES].filter(isUsableHeroSlide),
    [managedImages.heroPosterUrl]
  );

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [heroSlides]);

  const homeVideoSrc = useMemo(
    () => buildAutoplayEmbedUrl(managedImages.homeVideoEmbedUrl),
    [managedImages.homeVideoEmbedUrl]
  );

  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════
          HERO — rotating photos, optional video mode
          ══════════════════════════════════════ */}
      <section
        className="home-hero relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: 'var(--primary-dark)' }}
      >
        {heroSlides.length > 0 && (
          <div className="hero-carousel absolute inset-0 z-0" aria-hidden>
            {heroSlides.map((imageUrl, idx) => (
              <div
                key={`${imageUrl}-${idx}`}
                className={`hero-slide-frame ${idx === activeSlideIndex ? 'is-active' : ''}`}
              >
                <img
                  src={imageUrl}
                  alt=""
                  className={`hero-slide-img ${idx % 2 === 1 ? 'hero-slide-img--alt' : ''}`}
                  decoding={idx === activeSlideIndex ? 'sync' : 'async'}
                />
              </div>
            ))}
          </div>
        )}

        <div className="hero-scrim absolute inset-0 z-[1]" aria-hidden />

        {/* Hero content — minimal: welcome line + CTAs only */}
        <div className="relative z-10 text-center foe-shell max-w-4xl px-4">
          <h1
            className="reveal text-white leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 6.5vw, 4.5rem)',
              fontWeight: 700,
              transitionDelay: '0.06s',
            }}
          >
            {HOME_COPY.heroTitle}
          </h1>

          <div
            className="reveal mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
            style={{ transitionDelay: '0.18s' }}
          >
            <Link
              href="/registration"
              className="btn-primary home-hero-cta"
              style={{
                backgroundColor: '#fff',
                borderColor: '#fff',
                color: 'var(--primary-dark)',
                boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
              }}
            >
              Register Now
            </Link>
            <Link href="/donate" className="btn-outline btn-outline-light home-hero-cta">
              Donate
            </Link>
          </div>
        </div>
      </section>

      <section className="home-forumVideoStrip bg-white">
        <div className="foe-shell">
          <h2 className="sr-only">Mission statement and experience video</h2>
          <div className="home-forumVideoGrid reveal">
            <p className="home-forumSubtitle">&ldquo;{HOME_COPY.mission}&rdquo;</p>
            <div className="home-forumVideoWrap">
              <iframe
                src={homeVideoSrc}
                title="Feast of Esther Experience"
                frameBorder="0"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          PURPOSE + DISCOVER MISSION
          ══════════════════════════════════════ */}
      <section className="home-purposeSection bg-white">
        <div className="foe-shell">
          <div className="home-purposeIntro reveal">
            <h2 className="home-purposeTitle">Our Purpose</h2>
            <p className="home-purposeSubtitle">{HOME_COPY.vision}</p>
          </div>

          <div className="home-ministryGrid">
            {[
              {
                title: 'About Us',
                tag: 'About',
                href: '/about',
                copy: HOME_COPY.aboutLead,
                image: 'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778152795/foe_group_2_q6pcp8.jpg',
              },
              {
                title: 'The Visionary',
                tag: 'Visionary',
                href: '/founder',
                copy: 'Pastor Mrs Folu Adeboye is the wife of the General Overseer of the Redeemed Christian Church of God (RCCG) Worldwide.',
                image: 'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761734/20260219_131617_ocrby8.jpg',
              },
              {
                title: 'Feast Of Esther 2026',
                tag: '2026',
                href: '/events',
                copy: `Feast of Esther Annual Conference Date: ${SITE.dateRangeLong} Venue: ${SITE.venueName}, ${SITE.venueAddress}`,
                image: 'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777728539/20250710_090859_b81076.jpg',
              },
            ].map((card) => (
              <article key={card.title} className="home-ministryCard reveal">
                <div className="home-ministryTopline" />
                <p className="home-ministryTag">{card.tag}</p>
                <h3>{card.title}</h3>
                <p className="home-ministryCopy">{card.copy}</p>
                <Link href={card.href} className="home-ministryLink">
                  Learn More →
                </Link>
              </article>
            ))}
          </div>

        </div>
      </section>

      <HomeReserveStay hotelRoomUrl={managedImages.hotelRoomUrl} />

      {/* ══════════════════════════════════════
          COUNTDOWN TIMER (original)
          ══════════════════════════════════════ */}
      <FlipClockCountdown />

    </div>
  );
}
