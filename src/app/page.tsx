'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { SiteImages } from '@/lib/cms-types';
import FlipClockCountdown from '@/components/FlipClockCountdown';
import { EVENT_HIGHLIGHTS, HERO_CLOUDINARY_SLIDES, HOME_COPY, SITE } from '@/lib/site-content';

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
          <div className="hero-track absolute inset-0 z-0" style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}>
            {heroSlides.map((imageUrl, idx) => (
              <img
                key={`${imageUrl}-${idx}`}
                src={imageUrl}
                alt=""
                aria-hidden
                className="hero-slide"
              />
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
              className="btn-primary"
              style={{
                backgroundColor: '#fff',
                borderColor: '#fff',
                color: 'var(--primary-dark)',
                boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
              }}
            >
              Register Now
            </Link>
            <Link href="/donate" className="btn-outline btn-outline-light">
              Donate
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white pt-20 pb-8 md:pt-24 md:pb-10">
        <div className="foe-shell">
          <h2 className="home-forumTitle reveal">2 Kings 13:20-21</h2>
          <p className="home-forumSubtitle reveal">
            “A forum where women in ministry learn to accomplish their calling, stand in the gap, and impact the church for revival in the nation.”
          </p>
        </div>
      </section>

      <section className="video-spotlight">
        <div className="video-container">
          <iframe
            src={homeVideoSrc}
            title="Feast of Esther Experience"
            frameBorder="0"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </section>

      {/* ══════════════════════════════════════
          PURPOSE + DISCOVER MISSION
          ══════════════════════════════════════ */}
      <section className="home-purposeSection bg-white py-16 md:py-20">
        <div className="foe-shell">
          <div className="home-purposeIntro reveal">
            <h2 className="home-purposeTitle">Our Purpose</h2>
            <p className="home-purposeSubtitle">
              There are always fresh ways to participate in what God is doing through Feast of Esther.
              Explore key pathways below.
            </p>
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

      {/* ══════════════════════════════════════
          OFFICIAL ACCOMMODATION
          ══════════════════════════════════════ */}
      <section className="home-hotelSection border-t border-[var(--blush-mid)] bg-[var(--cream)] py-14 md:py-18">
        <div className="foe-shell">
          <div className="home-hotelHeader text-center mb-10">
            <p className="eyebrow reveal mb-3">Official Accommodation</p>
            <h2
              className="reveal mb-2 home-hotelTitle"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--primary-dark)' }}
            >
              Reserve Your Stay
            </h2>
            <p className="home-hotelSubtitle reveal">
              A comfortable stay, premium hospitality, and conference-ready convenience.
            </p>
          </div>

          <div className="home-hotelCard reveal grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] overflow-hidden rounded-2xl border border-[var(--blush-mid)] bg-white shadow-sm">
            <div className="relative min-h-[300px] lg:min-h-[430px]">
              <span className="absolute left-3 top-3 z-10 bg-[#f2e585] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#202020]">
                Official Hotel
              </span>
              <img
                src={managedImages.hotelRoomUrl || 'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778163272/Accom_x5ajjc.jpg'}
                alt="Official hotel room"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="home-hotelContent px-6 py-7 md:px-8 md:py-9">
              <h3 className="home-hotelName text-[#2c2f3a]" style={{ fontFamily: 'var(--font-display)' }}>
                {SITE.venueName}
              </h3>
              <p className="home-hotelAddress mt-2 border-b border-[#e5e7eb] pb-4 text-gray-600">{SITE.venueAddress}</p>
              <p className="home-hotelFeatures mt-4 flex flex-wrap gap-x-4 gap-y-2 text-gray-600">
                {HOME_COPY.accommodationBullets.map((b) => (
                  <span key={b}>★ {b}</span>
                ))}
              </p>
              <p className="home-hotelBody mt-5 max-w-xl leading-relaxed text-gray-600">{HOME_COPY.accommodationLead}</p>
              <div className="home-hotelActions mt-7 flex flex-wrap gap-3">
                <Link href={SITE.hotelBookingUrl} target="_blank" rel="noreferrer" className="btn-primary home-hotelPrimaryBtn">
                  Book Your Room
                </Link>
                <button type="button" className="btn-outline home-hotelGhostBtn" style={{ color: '#374151', borderColor: '#d1d5db' }}>
                  Copy Booking Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="home-container bg-[var(--cream)]">
        <header className="banner-section reveal">
          <span className="calendar-tag">Mark Your Calendar</span>
          <h1 className="main-title">Feast of Esther 2026</h1>
          <p className="event-details">
            <strong>Feast of Esther 2026. Date: {SITE.dateRange}.</strong>
            <br />
            Venue: {SITE.venueName}, {SITE.venueAddress}
          </p>
        </header>

        <div className="pillar-grid reveal">
          {EVENT_HIGHLIGHTS.map((item) => (
            <div className="pillar-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        <Link href="/registration" className="register-now-btn reveal">
          Register Now
        </Link>

      </section>

      {/* ══════════════════════════════════════
          COUNTDOWN TIMER (original)
          ══════════════════════════════════════ */}
      <FlipClockCountdown />

      <section className="home-finalCtaWrap bg-[#eff0f3] py-20 md:py-24">
        <div
          className="home-finalCtaCard foe-shell mx-auto max-w-[760px] rounded-[18px] px-8 py-11 text-center text-white md:px-12"
          style={{ background: 'linear-gradient(135deg, #4e0b73 0%, #b11166 100%)' }}
        >
          <h3 className="text-[clamp(2rem,4vw,3.25rem)]" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            Join Us at the Feast of Esther 2026
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-white/95 text-[1.22rem] leading-relaxed">
            Be part of this transformative experience that combines spiritual growth, fellowship, and empowerment.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Link href="/registration" className="home-finalCtaBtn home-finalCtaBtnSolid">
              Register Now
            </Link>
            <Link href="/donate" className="home-finalCtaBtn home-finalCtaBtnOutline">
              Donate
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
