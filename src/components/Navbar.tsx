'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Executives', href: '/executive' },
  { label: 'The Founder', href: '/founder' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
];

function linkIsCurrent(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function IconMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    queueMicrotask(() => setOpen(false));
  }, [pathname]);

  return (
    <nav
      className="sticky top-0 z-40 w-full transition-all duration-300"
      style={{
        backgroundColor: '#fff',
        borderBottom: scrolled ? '1px solid var(--blush-mid)' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(106,15,53,0.07)' : 'none',
      }}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-stretch justify-between px-6 lg:px-10">
        <Link href="/" className="inline-flex items-center self-center">
          <img
            src="https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778153398/foe_logo_mlmi16.jpg"
            alt="Feast of Esther North America logo"
            className="h-10 w-auto md:h-11"
          />
        </Link>

        <div className="hidden items-stretch gap-1 self-stretch md:flex">
          {links.map((link) => {
            const isCurrent = linkIsCurrent(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent ? 'page' : undefined}
                className={`navbar-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-light)] focus-visible:ring-offset-2 ${isCurrent ? 'navbar-link--active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 self-center md:flex">
          <Link href="/registration" className="btn-primary" style={{ padding: '0.72rem 1.65rem', fontSize: '0.78rem' }}>
            Register
          </Link>
          <Link
            href="/donate"
            style={{
              padding: '0.72rem 1.65rem',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              border: '2px solid var(--primary)',
              borderRadius: '2px',
              textDecoration: 'none',
              transition: 'background 0.2s, transform 0.15s',
            }}
            className="hover:bg-[var(--blush)] hover:-translate-y-[1px]"
          >
            Donate
          </Link>
        </div>

        <button
          type="button"
          className="flex items-center justify-center self-center p-2 md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
          style={{ color: 'var(--primary-dark)' }}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {open ? (
        <div
          className="border-t border-[var(--blush-mid)] px-6 pb-6 pt-2 md:hidden"
          style={{ backgroundColor: '#fff' }}
        >
          <div className="flex flex-col gap-4 pt-2">
            {links.map((link) => {
              const isCurrent = linkIsCurrent(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`navbar-link-mobile focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-light)] focus-visible:ring-offset-2 ${isCurrent ? 'navbar-link-mobile--active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex gap-3 pt-2">
              <Link
                href="/registration"
                onClick={() => setOpen(false)}
                className="btn-primary flex-1 text-center"
                style={{ padding: '0.65rem 1rem', fontSize: '0.72rem' }}
              >
                Register
              </Link>
              <Link
                href="/donate"
                onClick={() => setOpen(false)}
                className="flex-1 text-center"
                style={{
                  padding: '0.65rem 1rem',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--primary)',
                  border: '1.5px solid var(--primary)',
                  borderRadius: '2px',
                  textDecoration: 'none',
                }}
              >
                Donate
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
