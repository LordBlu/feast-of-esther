'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from './DonateStyles.module.css';

const PRESETS = [25, 50, 100, 250, 500];

const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL ?? '';

export default function DonateClient() {
  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState('');
  const [method, setMethod] = useState<'card' | 'paypal'>('card');
  const [info, setInfo] = useState({ first: '', last: '', email: '', phone: '' });
  const [showOffline, setShowOffline] = useState(false);

  const displayAmount = useMemo(() => {
    const c = parseFloat(custom.replace(/[^0-9.]/g, ''));
    if (!Number.isNaN(c) && c > 0) return c;
    return amount;
  }, [amount, custom]);

  const giveHref = DONATE_URL.trim();

  function handleGiveClick() {
    if (giveHref) return;
    setShowOffline(true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <aside className={styles.aside}>
          <h1 className={styles.asideTitle}>Give with joy</h1>
          <div className={styles.asideRule} aria-hidden />
          <p className={styles.asideLead}>
            Your gift fuels gatherings, outreach, and care for women in ministry across North America. Every
            contribution is received with gratitude and used with integrity.
          </p>
          <blockquote className={styles.quote}>
            &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under
            compulsion, for God loves a cheerful giver.&rdquo;
            <cite>2 Corinthians 9:7</cite>
          </blockquote>
          <ul className={styles.bullets}>
            <li>Event hospitality and materials</li>
            <li>Scholarships and travel support where needed</li>
            <li>Communications and chapter growth</li>
          </ul>
        </aside>

        <div className={styles.main}>
          <h2 className={styles.sectionLabel}>Choose an amount</h2>
          <div className={styles.presetRow}>
            {PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                className={`${styles.preset} ${amount === n && !custom ? styles.presetActive : ''}`}
                onClick={() => {
                  setAmount(n);
                  setCustom('');
                }}
              >
                ${n}
              </button>
            ))}
          </div>
          <div className={styles.customWrap}>
            <label className={styles.customLabel} htmlFor="donate-custom">
              Or enter a custom amount
            </label>
            <div className={styles.customField}>
              <span>$</span>
              <input
                id="donate-custom"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="0.00"
                inputMode="decimal"
                autoComplete="off"
              />
            </div>
          </div>

          <h2 className={styles.sectionLabel}>How you&apos;d like to give</h2>
          <div className={styles.methodRow}>
            <button
              type="button"
              className={`${styles.method} ${method === 'card' ? styles.methodActive : ''}`}
              onClick={() => setMethod('card')}
            >
              Card / bank (online)
            </button>
            <button
              type="button"
              className={`${styles.method} ${method === 'paypal' ? styles.methodActive : ''}`}
              onClick={() => setMethod('paypal')}
            >
              PayPal
            </button>
          </div>

          <h2 className={styles.sectionLabel}>Your details</h2>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="donate-first">
                First name
              </label>
              <input
                id="donate-first"
                className={styles.input}
                placeholder="First name"
                value={info.first}
                onChange={(e) => setInfo((p) => ({ ...p, first: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="donate-last">
                Last name
              </label>
              <input
                id="donate-last"
                className={styles.input}
                placeholder="Last name"
                value={info.last}
                onChange={(e) => setInfo((p) => ({ ...p, last: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="donate-email">
                Email
              </label>
              <input
                id="donate-email"
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                value={info.email}
                onChange={(e) => setInfo((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="donate-phone">
                Phone (optional)
              </label>
              <input
                id="donate-phone"
                className={styles.input}
                placeholder="Phone number"
                value={info.phone}
                onChange={(e) => setInfo((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
          </div>

          {giveHref ? (
            <Link
              href={giveHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.cta} ${styles.ctaLink}`}
            >
              Give ${displayAmount.toFixed(0)} — continue securely
            </Link>
          ) : (
            <button type="button" className={styles.cta} onClick={handleGiveClick}>
              Give ${displayAmount.toFixed(0)} — {method === 'paypal' ? 'PayPal' : 'online'}
            </button>
          )}

          {showOffline && !giveHref ? (
            <p className={styles.hint} role="status">
              Online giving is not connected here yet. To give today, email{' '}
              <a href="mailto:feastofesthernc@gmail.com?subject=Donation%20inquiry">feastofesthernc@gmail.com</a> or call{' '}
              <a href="tel:+18323720860">(832) 372-0860</a>
              . Mention your preferred amount (${displayAmount.toFixed(2)}){method === 'paypal' ? ' and that you prefer PayPal' : ''} and whether you need a receipt.
            </p>
          ) : (
            <p className={styles.hint}>
              {giveHref
                ? 'You will complete payment on our secure giving page in a new tab.'
                : 'Use the button above for email and phone instructions. A one-click online link can be added when your giving portal is ready.'}
            </p>
          )}

          <p className={styles.finePrint}>
            Feast of Esther North America is grateful for your partnership. For questions about recurring gifts or
            stock transfers, contact the team using the same email or phone listed on our{' '}
            <Link href="/contact" style={{ color: '#9d2a6a', fontWeight: 600 }}>
              contact page
            </Link>
            .
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.5 2.09C13.09 5.01 14.76 4 16.5 4 19 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <h3>Impact</h3>
              <p>Gifts directly support sisters gathering in faith and service.</p>
            </div>
            <div className={styles.feature}>
              <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <h3>Stewardship</h3>
              <p>We honor your trust with careful, transparent use of resources.</p>
            </div>
            <div className={styles.feature}>
              <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              <h3>Secure</h3>
              <p>Use your organization’s official processor when the link is configured.</p>
            </div>
          </div>

          <div className={styles.socialIconRow} aria-label="Follow us">
            <a className={styles.socialIconLink} href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1s2.5 1.12 2.5 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.1c.67-1.27 2.31-2.6 4.76-2.6 5.1 0 6.04 3.35 6.04 7.7V24h-5v-7.8c0-1.86-.03-4.25-2.59-4.25-2.59 0-2.99 2.02-2.99 4.11V24h-5V8z" />
              </svg>
            </a>
            <a className={styles.socialIconLink} href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a className={styles.socialIconLink} href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
              </svg>
            </a>
            <a className={styles.socialIconLink} href="#" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.9 2H22l-6.77 7.74L23 22h-6.2l-4.85-6.35L6.3 22H3.2l7.24-8.28L1 2h6.35l4.38 5.78L18.9 2zm-1.09 18h1.72L6.42 3.9H4.58L17.81 20z" />
              </svg>
            </a>
            <a className={styles.socialIconLink} href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a className={styles.socialIconLink} href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64v-3.5a6.39 6.39 0 00-1-.07A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.5z" />
              </svg>
            </a>
            <a className={styles.socialIconLink} href="#" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.52 3.48A11.82 11.82 0 0012.07 0C5.57 0 .28 5.3.28 11.8c0 2.08.54 4.1 1.57 5.88L0 24l6.5-1.7a11.74 11.74 0 005.57 1.42h.01c6.5 0 11.79-5.3 11.79-11.8 0-3.15-1.23-6.11-3.35-8.44zM12.08 21.7h-.01a9.83 9.83 0 01-5-1.37l-.36-.21-3.86 1 1.03-3.77-.23-.39a9.8 9.8 0 01-1.5-5.16c0-5.42 4.4-9.83 9.83-9.83 2.63 0 5.1 1.03 6.95 2.88a9.78 9.78 0 012.88 6.95c0 5.42-4.4 9.83-9.83 9.83zm5.39-7.37c-.29-.14-1.72-.85-1.99-.95-.27-.1-.46-.14-.65.14-.19.29-.75.95-.92 1.15-.17.19-.34.22-.63.07-.29-.14-1.21-.45-2.31-1.45-.86-.77-1.43-1.72-1.6-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.58-.89-2.16-.23-.56-.47-.49-.65-.5h-.55c-.19 0-.48.07-.73.36-.25.29-.96.94-.96 2.28s.98 2.64 1.12 2.83c.14.19 1.93 2.95 4.67 4.14.65.28 1.15.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.72-.7 1.96-1.38.24-.68.24-1.27.17-1.38-.07-.11-.26-.18-.55-.32z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
