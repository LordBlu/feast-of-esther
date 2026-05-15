'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { SITE } from '@/lib/site-content';

const FALLBACK_TARGET_ISO = '2026-06-18T14:00:00.000Z';

type TimeParts = { days: number; hours: number; minutes: number; seconds: number };

function useCountdownTarget() {
  const [state, setState] = useState<{
    ready: boolean;
    enabled: boolean;
    targetAt: string | null;
  }>({ ready: false, enabled: false, targetAt: null });

  useEffect(() => {
    fetch('/api/site-config')
      .then((r) => r.json())
      .then((d) => {
        const c = d.countdown;
        setState({
          ready: true,
          enabled: !!(c?.enabled && c?.targetAt),
          targetAt: typeof c?.targetAt === 'string' ? c.targetAt : null,
        });
      })
      .catch(() => {
        setState({
          ready: true,
          enabled: true,
          targetAt: FALLBACK_TARGET_ISO,
        });
      });
  }, []);

  return state;
}

function useTimeLeft(target: Date | null): TimeParts {
  const [parts, setParts] = useState<TimeParts>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!target) return;
    const compute = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setParts({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setParts({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    compute();
    const id = window.setInterval(compute, 1000);
    return () => clearInterval(id);
  }, [target]);

  return parts;
}

function pad2(n: number) {
  return String(Math.min(99, Math.max(0, n))).padStart(2, '0');
}

function pad3(n: number) {
  return String(Math.min(999, Math.max(0, n))).padStart(3, '0');
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduced;
}

function FlipDigit({
  digit,
  reducedMotion,
}: {
  digit: number;
  reducedMotion: boolean;
}) {
  const d = digit % 10;
  const [display, setDisplay] = useState(d);
  const [prev, setPrev] = useState(d);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (d === display) return;
    if (reducedMotion) {
      queueMicrotask(() => {
        setDisplay(d);
        setPrev(d);
      });
      return;
    }
    queueMicrotask(() => {
      setPrev(display);
      setFlipping(true);
    });
    const end = window.setTimeout(() => {
      setDisplay(d);
      setFlipping(false);
    }, 480);
    return () => window.clearTimeout(end);
  }, [d, display, reducedMotion]);

  const bottomDigit = flipping ? prev : display;

  return (
    <div className="flip-digit">
      <div className="flip-digit-card">
        <div className="flip-digit-hinge" aria-hidden />

        <div className="flip-digit-half flip-digit-half--bottom">
          <span className="flip-digit-char flip-digit-char--bottom" aria-hidden>
            {bottomDigit}
          </span>
        </div>

        <div className={`flip-digit-half flip-digit-half--top ${flipping ? 'opacity-0' : ''}`}>
          <span className="flip-digit-char" aria-hidden>
            {display}
          </span>
        </div>

        {flipping && !reducedMotion && (
          <div className="flip-digit-flip">
            <span className="flip-digit-char" aria-hidden>
              {prev}
            </span>
          </div>
        )}

        {flipping && !reducedMotion && (
          <div className="flip-digit-half flip-digit-half--top flip-digit-half--under">
            <span className="flip-digit-char" aria-hidden>
              {display}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function DigitPair({
  value,
  maxDigits,
  reducedMotion,
}: {
  value: number;
  maxDigits: 2 | 3;
  reducedMotion: boolean;
}) {
  const str = maxDigits === 3 ? pad3(value) : pad2(value);

  return (
    <div className="flex shrink-0 justify-center gap-0">
      {str.split('').map((ch, i) => (
        <FlipDigit key={`d-${i}`} digit={Number(ch)} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}

export default function FlipClockCountdown() {
  const { ready, enabled, targetAt } = useCountdownTarget();
  const target = useMemo(() => {
    if (!targetAt) return null;
    const d = new Date(targetAt);
    return Number.isNaN(d.getTime()) ? null : d;
  }, [targetAt]);

  const activeTarget = ready && enabled && target ? target : null;
  const { days, hours, minutes, seconds } = useTimeLeft(activeTarget);
  const reducedMotion = usePrefersReducedMotion();
  const dayDigits: 2 | 3 = days > 99 ? 3 : 2;

  const units = useMemo(
    () =>
      [
        { label: 'Days', value: days, digits: dayDigits },
        { label: 'Hours', value: hours, digits: 2 as const },
        { label: 'Minutes', value: minutes, digits: 2 as const },
        { label: 'Seconds', value: seconds, digits: 2 as const },
      ] as const,
    [days, hours, minutes, seconds, dayDigits]
  );

  if (!ready || !enabled || !target) return null;

  return (
    <section className="flip-clock-section">
      <div className="foe-shell">
        <div className="flip-clock-inner">
          <p className="eyebrow mb-3">The Event Begins In</p>
          <h2 className="flip-clock-date">{SITE.dateRange} · Dallas, Texas</h2>

          <div
            className="flip-clock-units"
            role="timer"
            aria-live="polite"
            aria-atomic="true"
            suppressHydrationWarning
          >
            {units.map(({ label, value, digits }) => (
              <div key={label} className="flex min-w-0 flex-col items-center">
                <DigitPair value={value} maxDigits={digits} reducedMotion={reducedMotion} />
                <p className="flip-clock-unit-label">{label}</p>
              </div>
            ))}
          </div>

          <Link href="/registration" className="flip-clock-cta">
            <span className="flip-clock-cta__main">Register Now</span>
            <span className="flip-clock-cta__hint">Secure your seat →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
