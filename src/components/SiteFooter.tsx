'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './SiteFooter.module.css';
import { SocialLink } from '@/lib/cms-types';

const FALLBACK_SOCIAL_LINKS: SocialLink[] = [
  { id: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com', enabled: true },
  { id: 'facebook', label: 'Facebook', url: 'https://facebook.com', enabled: true },
  { id: 'instagram', label: 'Instagram', url: 'https://instagram.com', enabled: true },
  { id: 'x', label: 'X (Twitter)', url: 'https://x.com', enabled: true },
  { id: 'youtube', label: 'YouTube', url: 'https://youtube.com', enabled: true },
  { id: 'tiktok', label: 'TikTok', url: 'https://tiktok.com', enabled: true },
  { id: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/18323720860', enabled: true },
];

function SocialIcon({ children, label, href }: { children: React.ReactNode; label: string; href: string }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={styles.socialLink}>
      {children}
    </Link>
  );
}

function SocialSvg({ id }: { id: string }) {
  const key = id.toLowerCase();
  if (key.includes('linkedin')) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.1c.67-1.27 2.31-2.6 4.76-2.6 5.1 0 6.04 3.35 6.04 7.7V24h-5v-7.8c0-1.86-.03-4.25-2.59-4.25-2.59 0-2.99 2.02-2.99 4.11V24h-5V8z" />
      </svg>
    );
  }
  if (key.includes('facebook')) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (key.includes('instagram')) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
      </svg>
    );
  }
  if (key === 'x' || key.includes('twitter')) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.9 2H22l-6.77 7.74L23 22h-6.2l-4.85-6.35L6.3 22H3.2l7.24-8.28L1 2h6.35l4.38 5.78L18.9 2zm-1.09 18h1.72L6.42 3.9H4.58L17.81 20z" />
      </svg>
    );
  }
  if (key.includes('youtube')) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (key.includes('tiktok')) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64v-3.5a6.39 6.39 0 00-1-.07A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.5z" />
      </svg>
    );
  }
  if (key.includes('whatsapp')) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.52 3.48A11.82 11.82 0 0012.07 0C5.57 0 .28 5.3.28 11.8c0 2.08.54 4.1 1.57 5.88L0 24l6.5-1.7a11.74 11.74 0 005.57 1.42h.01c6.5 0 11.79-5.3 11.79-11.8 0-3.15-1.23-6.11-3.35-8.44zM12.08 21.7h-.01a9.83 9.83 0 01-5-1.37l-.36-.21-3.86 1 1.03-3.77-.23-.39a9.8 9.8 0 01-1.5-5.16c0-5.42 4.4-9.83 9.83-9.83 2.63 0 5.1 1.03 6.95 2.88a9.78 9.78 0 012.88 6.95c0 5.42-4.4 9.83-9.83 9.83zm5.39-7.37c-.29-.14-1.72-.85-1.99-.95-.27-.1-.46-.14-.65.14-.19.29-.75.95-.92 1.15-.17.19-.34.22-.63.07-.29-.14-1.21-.45-2.31-1.45-.86-.77-1.43-1.72-1.6-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.58-.89-2.16-.23-.56-.47-.49-.65-.5h-.55c-.19 0-.48.07-.73.36-.25.29-.96.94-.96 2.28s.98 2.64 1.12 2.83c.14.19 1.93 2.95 4.67 4.14.65.28 1.15.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.72-.7 1.96-1.38.24-.68.24-1.27.17-1.38-.07-.11-.26-.18-.55-.32z" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

export default function SiteFooter() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(FALLBACK_SOCIAL_LINKS);
  const year = new Date().getFullYear();

  useEffect(() => {
    fetch('/api/site-config')
      .then((res) => res.json())
      .then((data) => {
        const links = Array.isArray(data.socialLinks) ? data.socialLinks : FALLBACK_SOCIAL_LINKS;
        setSocialLinks(links);
      })
      .catch(() => setSocialLinks(FALLBACK_SOCIAL_LINKS));
  }, []);

  const enabledLinks = socialLinks.filter((item) => item.enabled !== false && item.url?.trim());

  return (
    <footer className="site-footer mt-auto bg-[#15171c] px-6 lg:px-10">
      <div className={styles.footerInline}>
        <p className={styles.rightsReservedText}>All rights reserved.</p>
        <div className={styles.socialRow} aria-label="Follow us">
          {enabledLinks.map((item) => (
            <SocialIcon key={`${item.id}-${item.url}`} label={item.label} href={item.url}>
              <SocialSvg id={item.id} />
            </SocialIcon>
          ))}
        </div>
        <p className={styles.copyrightText}>
          Copyright {year} © Feast of Esther North America.
        </p>
      </div>
    </footer>
  );
}
