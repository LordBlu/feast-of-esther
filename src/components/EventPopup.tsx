'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSiteShell } from '@/components/SiteShellContext';
import SiteImage from '@/components/SiteImage';
import { popupStyleToCss } from '@/lib/popup-styles';

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

const ALLOWED_PATHS = ['/'];
const POPUP_TTL_MS = 1000 * 60 * 60 * 12;

const DEFAULT_POPUP_IMAGE =
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778244638/Save_thedate_mkpbnu.jpg';

export default function EventPopup() {
  const pathname = usePathname();
  const { popup, images } = useSiteShell();
  const [visible, setVisible] = useState(false);
  const [portraitImage, setPortraitImage] = useState(false);
  const popupFallbackImage = images.popupImageUrl?.trim() || DEFAULT_POPUP_IMAGE;

  useEffect(() => {
    if (popup && !popup.enabled) return;
    if (!ALLOWED_PATHS.includes(pathname ?? '')) return;

    const lastDismissedAt = Number(localStorage.getItem('foe-popup-dismissed-at') ?? 0);
    const shouldShow = !lastDismissedAt || Date.now() - lastDismissedAt > POPUP_TTL_MS;
    if (!shouldShow) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [pathname, popup]);

  const dismiss = () => {
    localStorage.setItem('foe-popup-dismissed-at', String(Date.now()));
    setVisible(false);
  };

  if (!visible) return null;

  const rightKicker = popup?.rightKicker ?? 'Upcoming Event';
  const bodyFooter =
    popup?.bodyFooter ?? 'Seats are limited — secure your place today.';
  const popupImageSrc = popup?.imageUrl || popupFallbackImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismiss} />

      <div
        className={`relative z-10 flex w-full flex-col overflow-hidden bg-white sm:flex-row ${
          portraitImage ? 'max-w-[760px]' : 'max-w-[860px]'
        }`}
        style={{
          borderRadius: '3px',
          boxShadow: '0 32px 100px rgba(0,0,0,0.35)',
          maxHeight: portraitImage ? '90vh' : '82vh',
          minHeight: portraitImage ? '560px' : undefined,
        }}
      >
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-500 transition-all hover:bg-white hover:text-gray-800"
          aria-label="Close"
        >
          <IconClose />
        </button>

        <div
          className={`relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden text-center text-white sm:min-h-0 ${
            portraitImage ? 'sm:w-[50%]' : 'sm:w-[42%]'
          }`}
          style={{
            background: 'linear-gradient(160deg, var(--primary) 0%, var(--primary-dark) 100%)',
          }}
        >
          {popupImageSrc ? (
            <SiteImage
              src={popupImageSrc}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 420px"
              cloudWidth={900}
              className="object-cover"
              onLoad={(event) => {
                const img = event.currentTarget as HTMLImageElement;
                const { naturalWidth, naturalHeight } = img;
                if (naturalWidth > 0 && naturalHeight > 0) {
                  setPortraitImage(naturalHeight / naturalWidth > 1.2);
                }
              }}
            />
          ) : (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-72 w-72 rounded-full border border-white/10" />
              <div className="absolute h-52 w-52 rounded-full border border-white/10" />
              <div className="absolute h-36 w-36 rounded-full border border-white/10" />
            </div>
          )}
        </div>

        <div className={`flex flex-1 flex-col justify-center ${portraitImage ? 'p-6 sm:p-7' : 'p-8 sm:p-9'}`}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              marginBottom: '0.95rem',
              ...popupStyleToCss(popup?.rightKickerStyle),
            }}
          >
            {rightKicker}
          </p>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 400,
              color: 'var(--primary-dark)',
              lineHeight: 1.18,
              marginBottom: '0.7rem',
              ...popupStyleToCss(popup?.rightTitleStyle),
            }}
          >
            {'Feast of Esther 2026'}
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              color: '#aaa',
              letterSpacing: '0.1em',
              marginBottom: '1.45rem',
              ...popupStyleToCss(popup?.rightScriptureStyle),
            }}
          >
            {popup?.scripture || '2 Kings 13:20-21'}
          </p>

          <div
            style={{ width: '2.2rem', height: '1.5px', background: 'var(--gold)', marginBottom: '1.45rem' }}
          />

          <p
            className="mb-3 leading-relaxed text-gray-600"
            style={{
              fontSize: portraitImage ? '0.84rem' : '0.92rem',
              lineHeight: 1.75,
              maxWidth: '38ch',
              ...popupStyleToCss(popup?.rightBodyStyle),
            }}
          >
            {popup?.body ||
              'Three days of powerful worship, fellowship, and renewal. An annual retreat for wives of General Overseers, Senior Pastors, Heads of Ministries, and Women Leaders.'}
          </p>
          <p
            className="mb-8 text-gray-400"
            style={{
              fontSize: portraitImage ? '0.8rem' : '0.85rem',
              lineHeight: 1.7,
              maxWidth: '38ch',
              ...popupStyleToCss(popup?.rightFooterStyle),
            }}
          >
            {bodyFooter}
          </p>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href={popup?.ctaUrl || '/registration'}
              onClick={dismiss}
              className="btn-primary"
              style={{
                fontSize: portraitImage ? '0.78rem' : '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: portraitImage ? '0.82rem 1.5rem' : '0.92rem 1.8rem',
                background: '#c1137a',
                color: '#fff',
                minWidth: portraitImage ? '176px' : '190px',
                textAlign: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 24px rgba(193, 19, 122, 0.3)',
              }}
            >
              {popup?.ctaLabel || 'Register Now'}
            </Link>
            <button
              onClick={dismiss}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: portraitImage ? '0.74rem' : '0.78rem',
                fontWeight: 600,
                color: '#6b7280',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '999px',
                cursor: 'pointer',
                padding: portraitImage ? '0.78rem 1.1rem' : '0.88rem 1.2rem',
                letterSpacing: '0.03em',
                minWidth: portraitImage ? '140px' : '152px',
              }}
              className="transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              type="button"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
