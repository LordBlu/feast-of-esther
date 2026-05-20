'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import FlipClockCountdown from '@/components/FlipClockCountdown';
import HomeReserveStay from '@/components/HomeReserveStay';
import SiteImage from '@/components/SiteImage';
import type { HomePageContent, SiteImages } from '@/lib/cms-types';
import { cloudinarySizedUrl } from '@/lib/cloudinary-url';
import { resolveHomeTestimonials, resolveReliveFeastImages } from '@/lib/home-content';
import {
  resolveHomeCopy,
  resolveHomeHeroSlides,
  resolveHomeMinistryCards,
} from '@/lib/site-placeholders';
import { SITE, SITE_LOGO_URL } from '@/lib/site-content';

const HomeReliveFeast = dynamic(() => import('@/components/HomeReliveFeast'));
const HomeTestimonialsMarquee = dynamic(() => import('@/components/HomeTestimonialsMarquee'));

const FALLBACK_VIDEO_EMBED_URL = 'https://www.youtube.com/embed/UVRoPXdUSC8';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

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

export interface HomeClientProps {
  initialImages: SiteImages;
  initialHomeContent: HomePageContent;
}

export default function HomeClient({ initialImages, initialHomeContent }: HomeClientProps) {
  useReveal();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const homeCopy = useMemo(() => resolveHomeCopy(initialHomeContent), [initialHomeContent]);
  const ministryCards = useMemo(
    () => resolveHomeMinistryCards(initialHomeContent, initialImages.placeholderUrls),
    [initialHomeContent, initialImages.placeholderUrls],
  );

  const reliveImages = useMemo(
    () => resolveReliveFeastImages(initialHomeContent, initialImages.galleryCollections),
    [initialHomeContent, initialImages.galleryCollections],
  );
  const testimonials = useMemo(() => resolveHomeTestimonials(initialHomeContent), [initialHomeContent]);
  const showRelive = initialHomeContent.showReliveFeast !== false;
  const showTestimonials = initialHomeContent.showTestimonials !== false;

  const heroSlides = useMemo(
    () => resolveHomeHeroSlides(initialImages).filter(isUsableHeroSlide),
    [initialImages],
  );

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [heroSlides.length]);

  const homeVideoSrc = useMemo(
    () => buildAutoplayEmbedUrl(initialImages.homeVideoEmbedUrl),
    [initialImages.homeVideoEmbedUrl],
  );

  const heroIndicesToRender = useMemo(() => {
    if (heroSlides.length <= 2) return heroSlides.map((_, i) => i);
    const next = (activeSlideIndex + 1) % heroSlides.length;
    return [activeSlideIndex, next];
  }, [heroSlides.length, activeSlideIndex]);

  return (
    <div className="flex flex-col">
      <section
        className="home-hero relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: 'var(--primary-dark)' }}
      >
        {heroSlides.length > 0 && (
          <div className="hero-carousel absolute inset-0 z-0" aria-hidden>
            {heroSlides.map((imageUrl, idx) => {
              if (!heroIndicesToRender.includes(idx)) return null;
              const isActive = idx === activeSlideIndex;
              return (
                <div
                  key={`${imageUrl}-${idx}`}
                  className={`hero-slide-frame ${isActive ? 'is-active' : ''}`}
                >
                  <SiteImage
                    src={imageUrl}
                    alt=""
                    fill
                    sizes="100vw"
                    cloudWidth={1920}
                    priority={isActive}
                    className={`hero-slide-img ${idx % 2 === 1 ? 'hero-slide-img--alt' : ''}`}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="hero-scrim absolute inset-0 z-[1]" aria-hidden />

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
            {homeCopy.heroTitle}
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
            <p className="home-forumSubtitle">&ldquo;{homeCopy.forumMissionQuote}&rdquo;</p>
            <div className="home-forumVideoWrap">
              <iframe
                src={homeVideoSrc}
                title="Feast of Esther Experience"
                frameBorder="0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="home-purposeSection bg-white">
        <div className="foe-shell">
          <div className="home-purposeIntro reveal">
            <h2 className="home-purposeTitle">{homeCopy.purposeTitle}</h2>
            <p className="home-purposeSubtitle">{homeCopy.purposeSubtitle}</p>
          </div>

          <div className="home-ministryGrid">
            {ministryCards.map((card) => (
              <article key={card.title} className="home-ministryCard reveal">
                <div className="home-ministryCardMark" aria-hidden>
                  <div
                    className="home-ministryCardMarkBg"
                    style={{
                      backgroundImage: `url(${cloudinarySizedUrl(card.imageUrl ?? '', 720)})`,
                    }}
                  />
                  <SiteImage
                    src={SITE_LOGO_URL}
                    alt=""
                    width={120}
                    height={120}
                    cloudWidth={240}
                    className="home-ministryCardMarkLogo"
                  />
                </div>
                <div className="home-ministryCardBody">
                  <div className="home-ministryTopline" />
                  <p className="home-ministryTag">{card.tag}</p>
                  <h3>{card.title}</h3>
                  <p className="home-ministryCopy">{card.copy}</p>
                  <Link href={card.href ?? '#'} className="home-ministryLink">
                    Learn More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {showRelive ? (
        <HomeReliveFeast
          title={initialHomeContent.reliveFeastTitle}
          subtitle={initialHomeContent.reliveFeastSubtitle}
          images={reliveImages}
        />
      ) : null}

      <HomeReserveStay hotelRoomUrl={initialImages.hotelRoomUrl} />

      <FlipClockCountdown />

      {showTestimonials ? (
        <HomeTestimonialsMarquee title={initialHomeContent.testimonialsTitle} items={testimonials} />
      ) : null}
    </div>
  );
}
