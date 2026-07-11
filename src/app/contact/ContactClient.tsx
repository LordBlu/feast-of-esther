'use client';

import { FormEvent, useState } from 'react';
import type { ContactPageContent, SocialLink } from '@/lib/cms-types';
import { SITE } from '@/lib/site-content';
import styles from './ContactStyles.module.css';

const DEFAULT_MAP_EMBED =
  'https://maps.google.com/maps?q=15227+Old+Richmond+Rd,+Sugar+Land,+TX+77498&hl=en&z=15&output=embed';

function pickSocialUrl(socialLinks: SocialLink[] | undefined, id: string, fallback: string): string {
  const link = socialLinks?.find((l) => l.id === id && l.enabled);
  const u = link?.url?.trim();
  return u || fallback;
}

function IconPin() {
  return (
    <svg className={styles.infoIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 21s-6-5.33-6-10a6 6 0 1112 0c0 4.67-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg className={styles.infoIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.33 1.77.62 2.6a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.48-1.19a2 2 0 012.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0122 16.92z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg className={styles.infoIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg className={styles.infoIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  );
}

export interface ContactClientProps {
  page: ContactPageContent;
  socialLinks: SocialLink[];
}

export default function ContactClient({ page, socialLinks }: ContactClientProps) {
  const [sent, setSent] = useState(false);

  const formTitle = page.formTitle ?? 'Get In Touch';
  const infoHeading = page.infoHeading ?? 'Contact Information';
  const aboutCardTitle = page.aboutCardTitle ?? 'About Feast of Esther';
  const aboutCardText =
    page.aboutCardText ??
    'A divine gathering of women in ministry, organized by Pastor (Mrs.) Folu Adeboye, wife of the General Overseer of the Redeemed Christian Church of God — fellowship, prayer, renewal, and kingdom impact across North America and beyond.';
  const addressLine1 = page.addressLine1 ?? '15227 Old Richmond Rd';
  const addressLine2 = page.addressLine2 ?? 'Sugar Land, TX 77498';
  const phone1Display = page.phone1Display ?? '+1 (919) 885-9765';
  const phone1Href = page.phone1Href ?? 'tel:+19198859765';
  const phone2Display = page.phone2Display ?? '+1 (832) 372-0860';
  const phone2Href = page.phone2Href ?? 'tel:+18323720860';
  const showPhone2 =
    page.phone2Display === undefined ? true : page.phone2Display.trim().length > 0;
  const email = page.email ?? SITE.contactEmail;
  const websiteUrl = page.websiteUrl ?? 'https://www.feastofestherusa.com';
  const websiteLabel =
    page.websiteDisplay?.trim() ||
    websiteUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  const mapEmbed = page.mapEmbedUrl?.trim() || DEFAULT_MAP_EMBED;
  const followLabel = page.followLabel ?? 'Follow Us';

  const instagram = pickSocialUrl(socialLinks, 'instagram', 'https://instagram.com');
  const tiktok = pickSocialUrl(socialLinks, 'tiktok', 'https://tiktok.com');
  const facebook = pickSocialUrl(socialLinks, 'facebook', 'https://facebook.com');
  const youtube = pickSocialUrl(socialLinks, 'youtube', 'https://youtube.com');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.formPanel}>
          <h1 className={styles.formTitle}>{formTitle}</h1>
          <div className={styles.formRule} aria-hidden />

          <div className={styles.group}>
            <label htmlFor="contact-name" className={styles.label}>
              Your Name
            </label>
            <input id="contact-name" required name="name" type="text" placeholder="Enter your name" />
          </div>
          <div className={styles.group}>
            <label htmlFor="contact-email" className={styles.label}>
              Your Email
            </label>
            <input id="contact-email" required name="email" type="email" placeholder="Enter your email address" />
          </div>
          <div className={styles.group}>
            <label htmlFor="contact-message" className={styles.label}>
              Your Message
            </label>
            <textarea id="contact-message" required name="message" rows={5} placeholder="What would you like to tell us?" />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Send Message
          </button>
          {sent ? <p className={styles.sent}>Thank you. We&apos;ll get back to you shortly.</p> : null}
        </form>

        <div className={styles.infoPanel}>
          <h2 className={styles.infoHeading}>{infoHeading}</h2>
          <div className={styles.infoRule} aria-hidden />

          <div className={styles.aboutCard}>
            <h3 className={styles.aboutTitle}>{aboutCardTitle}</h3>
            <p className={styles.aboutText}>{aboutCardText}</p>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.iconCircle} aria-hidden>
              <IconPin />
            </span>
            <div>
              <p className={styles.infoRowText}>{addressLine1}</p>
              <p className={styles.infoRowText}>{addressLine2}</p>
            </div>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.iconCircle} aria-hidden>
              <IconPhone />
            </span>
            <p className={styles.infoRowText}>
              <a href={phone1Href}>{phone1Display}</a>
              {showPhone2 ? (
                <>
                  <span className={styles.infoOr}> or </span>
                  <a href={phone2Href}>{phone2Display}</a>
                </>
              ) : null}
            </p>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.iconCircle} aria-hidden>
              <IconMail />
            </span>
            <p className={styles.infoRowText}>
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.iconCircle} aria-hidden>
              <IconGlobe />
            </span>
            <p className={styles.infoRowText}>
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                {websiteLabel}
              </a>
            </p>
          </div>

          <p className={styles.followLabel}>{followLabel}</p>
          <div className={styles.socialRow}>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialBtn} ${styles.socialInstagram}`}
              aria-label="Instagram"
            >
              <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href={tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialBtn} ${styles.socialTiktok}`}
              aria-label="TikTok"
            >
              <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64v-3.5a6.39 6.39 0 00-1-.07A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.5z" />
              </svg>
            </a>
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialBtn} ${styles.socialFacebook}`}
              aria-label="Facebook"
            >
              <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialBtn} ${styles.socialYoutube}`}
              aria-label="YouTube"
            >
              <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

          <div className={styles.mapWrap}>
            <iframe
              title="Feast of Esther North America — Sugar Land"
              src={mapEmbed}
              className={styles.mapFrame}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
