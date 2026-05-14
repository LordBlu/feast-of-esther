'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { DonatePageContent } from '@/lib/cms-types';
import { fillTemplate } from '@/lib/fill-template';
import styles from './DonateStyles.module.css';

const PRESETS = [25, 50, 100, 250, 500];

const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL ?? '';

const DEFAULT_OFFLINE_HINT =
  'Online giving is not connected here yet. To give today, email feastofesthernc@gmail.com or call (832) 372-0860. Mention your preferred amount ({{amount}}){{methodNote}} and whether you need a receipt.';

export interface DonateClientProps {
  page: DonatePageContent;
}

export default function DonateClient({ page }: DonateClientProps) {
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

  const asideTitle = page.asideTitle ?? 'Give with joy';
  const asideLead =
    page.asideLead ??
    'Your gift fuels gatherings, outreach, and care for women in ministry across North America. Every contribution is received with gratitude and used with integrity.';
  const quoteText =
    page.quoteText ??
    'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.';
  const quoteCite = page.quoteCite ?? '2 Corinthians 9:7';
  const bullet1 = page.bullet1 ?? 'Event hospitality and materials';
  const bullet2 = page.bullet2 ?? 'Scholarships and travel support where needed';
  const bullet3 = page.bullet3 ?? 'Communications and chapter growth';
  const sectionChooseAmount = page.sectionChooseAmount ?? 'Choose an amount';
  const sectionCustomAmount = page.sectionCustomAmount ?? 'Or enter a custom amount';
  const sectionMethod = page.sectionMethod ?? "How you'd like to give";
  const methodCard = page.methodCard ?? 'Card / bank (online)';
  const methodPaypal = page.methodPaypal ?? 'PayPal';
  const sectionDetails = page.sectionDetails ?? 'Your details';
  const hintOnline =
    page.hintOnline ?? 'You will complete payment on our secure giving page in a new tab.';
  const finePrintCustom = page.finePrint?.trim();
  const featureImpactTitle = page.featureImpactTitle ?? 'Impact';
  const featureImpactText =
    page.featureImpactText ?? 'Gifts directly support sisters gathering in faith and service.';
  const featureStewardshipTitle = page.featureStewardshipTitle ?? 'Stewardship';
  const featureStewardshipText =
    page.featureStewardshipText ?? 'We honor your trust with careful, transparent use of resources.';
  const featureSecureTitle = page.featureSecureTitle ?? 'Secure';
  const featureSecureText =
    page.featureSecureText ?? 'Use your organization’s official processor when the link is configured.';

  const methodNote = method === 'paypal' ? ' and that you prefer PayPal' : '';
  const offlineHintText = fillTemplate(page.hintOfflineTemplate?.trim() || DEFAULT_OFFLINE_HINT, {
    amount: `$${displayAmount.toFixed(2)}`,
    methodNote,
  });

  function handleGiveClick() {
    if (giveHref) return;
    setShowOffline(true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <aside className={styles.aside}>
          <h1 className={styles.asideTitle}>{asideTitle}</h1>
          <div className={styles.asideRule} aria-hidden />
          <p className={styles.asideLead}>{asideLead}</p>
          <blockquote className={styles.quote}>
            &ldquo;{quoteText}&rdquo;
            <cite>{quoteCite}</cite>
          </blockquote>
          <ul className={styles.bullets}>
            <li>{bullet1}</li>
            <li>{bullet2}</li>
            <li>{bullet3}</li>
          </ul>
        </aside>

        <div className={styles.main}>
          <h2 className={styles.sectionLabel}>{sectionChooseAmount}</h2>
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
              {sectionCustomAmount}
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

          <h2 className={styles.sectionLabel}>{sectionMethod}</h2>
          <div className={styles.methodRow}>
            <button
              type="button"
              className={`${styles.method} ${method === 'card' ? styles.methodActive : ''}`}
              onClick={() => setMethod('card')}
            >
              {methodCard}
            </button>
            <button
              type="button"
              className={`${styles.method} ${method === 'paypal' ? styles.methodActive : ''}`}
              onClick={() => setMethod('paypal')}
            >
              {methodPaypal}
            </button>
          </div>

          <h2 className={styles.sectionLabel}>{sectionDetails}</h2>
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
              {offlineHintText}
            </p>
          ) : (
            <p className={styles.hint}>
              {giveHref
                ? hintOnline
                : 'Use the button above for email and phone instructions. A one-click online link can be added when your giving portal is ready.'}
            </p>
          )}

          {finePrintCustom ? (
            <p className={styles.finePrint}>{finePrintCustom}</p>
          ) : (
            <p className={styles.finePrint}>
              Feast of Esther North America is grateful for your partnership. For questions about recurring gifts or
              stock transfers, contact the team using the same email or phone listed on our{' '}
              <Link href="/contact" style={{ color: '#9d2a6a', fontWeight: 600 }}>
                contact page
              </Link>
              .
            </p>
          )}

          <div className={styles.features}>
            <div className={styles.feature}>
              <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.5 2.09C13.09 5.01 14.76 4 16.5 4 19 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <h3>{featureImpactTitle}</h3>
              <p>{featureImpactText}</p>
            </div>
            <div className={styles.feature}>
              <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <h3>{featureStewardshipTitle}</h3>
              <p>{featureStewardshipText}</p>
            </div>
            <div className={styles.feature}>
              <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              <h3>{featureSecureTitle}</h3>
              <p>{featureSecureText}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
