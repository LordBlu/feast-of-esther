'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteImage from '@/components/SiteImage';
import { HOME_COPY, SITE } from '@/lib/site-content';

const DEFAULT_HOTEL_IMAGE =
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778163272/Accom_x5ajjc.jpg';

interface HomeReserveStayProps {
  hotelRoomUrl?: string;
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

export default function HomeReserveStay({ hotelRoomUrl }: HomeReserveStayProps) {
  const [copied, setCopied] = useState(false);
  const imageSrc = hotelRoomUrl?.trim() || DEFAULT_HOTEL_IMAGE;

  async function copyBookingLink() {
    try {
      await navigator.clipboard.writeText(SITE.hotelBookingUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section className="home-reserveStay" aria-labelledby="home-reserve-stay-heading">
      <div className="foe-shell">
        <header className="home-reserveStay__header reveal">
          <p className="home-reserveStay__eyebrow">Official Accommodation</p>
          <h2 id="home-reserve-stay-heading" className="home-reserveStay__title">
            Reserve Your Stay
          </h2>
          <div className="home-reserveStay__rule" aria-hidden />
        </header>

        <article className="home-reserveStay__card reveal">
          <div className="home-reserveStay__media">
            <SiteImage
              src={imageSrc}
              alt="Official conference hotel room"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              cloudWidth={960}
              className="home-reserveStay__img"
            />
            <span className="home-reserveStay__badge">Official Hotel</span>
          </div>

          <div className="home-reserveStay__body">
            <h3 className="home-reserveStay__hotelName">{SITE.venueName}</h3>
            <p className="home-reserveStay__address">{SITE.venueAddress}</p>
            <div className="home-reserveStay__divider" aria-hidden />

            <ul className="home-reserveStay__features">
              {HOME_COPY.accommodationBullets.map((item) => (
                <li key={item}>
                  <span className="home-reserveStay__star" aria-hidden>
                    ★
                  </span>
                  {item.replace(/\b\w/g, (c) => c.toUpperCase())}
                </li>
              ))}
            </ul>

            <p className="home-reserveStay__lead">{HOME_COPY.accommodationLead}</p>

            <div className="home-reserveStay__actions">
              <Link
                href={SITE.hotelBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="home-reserveStay__btn home-reserveStay__btn--primary"
              >
                Book Your Room →
              </Link>
              <button
                type="button"
                onClick={() => void copyBookingLink()}
                className="home-reserveStay__btn home-reserveStay__btn--secondary"
              >
                {copied ? 'Link Copied' : 'Copy Booking Link'}
                <CopyIcon />
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
