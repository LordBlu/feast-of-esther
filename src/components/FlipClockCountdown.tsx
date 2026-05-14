'use client';

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
  /** Match SSR/first client paint (false), then sync after mount — avoids hydration mismatch. */
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

/** Single 0–9 digit with top-half rotateX flip when value changes */
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
      setDisplay(d);
      setPrev(d);
      return;
    }
    setPrev(display);
    setFlipping(true);
    const end = window.setTimeout(() => {
      setDisplay(d);
      setFlipping(false);
    }, 480);
    return () => window.clearTimeout(end);
  }, [d, display, reducedMotion]);

  const bottomDigit = flipping ? prev : display;

  return (
    <div
      className="flip-digit relative mx-px inline-block align-top sm:mx-0.5"
      style={{ perspective: '420px' }}
    >
      <div
        className="flip-digit-card relative overflow-hidden rounded-md bg-[var(--primary-dark)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        style={{
          width: 'clamp(2.1rem, 7vw, 3.15rem)',
          height: 'clamp(3rem, 10vw, 4.25rem)',
        }}
      >
        {/* Center hinge line */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-1/2 z-20 h-px"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          aria-hidden
        />

        {/* Bottom half — shows lower stroke of bottomDigit */}
        <div className="absolute bottom-0 left-0 right-0 top-1/2 overflow-hidden rounded-b-md">
          <span
            className="flip-digit-char absolute left-0 right-0 block text-center text-[var(--gold)]"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 'clamp(1.75rem, 6vw, 2.75rem)',
              lineHeight: 'clamp(3rem, 10vw, 4.25rem)',
              transform: 'translateY(-50%)',
            }}
            aria-hidden
          >
            {bottomDigit}
          </span>
        </div>

        {/* Top half — static (reveals new top after flip) */}
        <div
          className={`absolute left-0 right-0 top-0 z-[1] h-1/2 overflow-hidden rounded-t-md bg-[var(--primary-dark)] ${
            flipping ? 'opacity-0' : ''
          }`}
        >
          <span
            className="flip-digit-char absolute left-0 right-0 block text-center text-[var(--gold)]"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 'clamp(1.75rem, 6vw, 2.75rem)',
              lineHeight: 'clamp(3rem, 10vw, 4.25rem)',
            }}
            aria-hidden
          >
            {display}
          </span>
        </div>

        {/* Flipping top lamina (shows prev digit top, rotates down) */}
        {flipping && !reducedMotion && (
          <div
            className="flip-digit-flip absolute left-0 right-0 top-0 z-[3] h-1/2 overflow-visible rounded-t-md bg-[var(--primary-dark)]"
            style={{
              transformOrigin: '50% 100%',
              transformStyle: 'preserve-3d',
              animation: 'flipClockTop 0.48s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards',
              backfaceVisibility: 'hidden',
            }}
          >
            <span
              className="flip-digit-char absolute left-0 right-0 block text-center text-[var(--gold)]"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: 'clamp(1.75rem, 6vw, 2.75rem)',
                lineHeight: 'clamp(3rem, 10vw, 4.25rem)',
              }}
              aria-hidden
            >
              {prev}
            </span>
          </div>
        )}

        {/* Revealed beneath flip: new digit upper half */}
        {flipping && !reducedMotion && (
          <div className="absolute left-0 right-0 top-0 z-0 h-1/2 overflow-hidden rounded-t-md bg-[var(--primary-dark)]">
            <span
              className="flip-digit-char absolute left-0 right-0 block text-center text-[var(--gold)]"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: 'clamp(1.75rem, 6vw, 2.75rem)',
                lineHeight: 'clamp(3rem, 10vw, 4.25rem)',
              }}
              aria-hidden
            >
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
    <section className="flip-clock-section py-16 md:py-24" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="foe-shell flex justify-center">
        <div
          className="mx-auto flex w-full max-w-5xl flex-col items-center rounded-2xl border px-6 py-10 text-center md:px-10 md:py-12"
          style={{
            borderColor: 'var(--blush-mid)',
            background: 'linear-gradient(180deg, #fff 0%, #fff9fc 100%)',
            boxShadow: '0 16px 44px rgba(88,13,64,0.09)',
          }}
        >
        <p className="eyebrow mb-4">The Event Begins In</p>
        <h2
          className="mb-10 w-full max-w-4xl px-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'var(--primary-dark)',
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
          }}
        >
          {SITE.dateRange} · Dallas, Texas
        </h2>

        <div
          className="mx-auto grid w-full max-w-4xl grid-cols-2 place-items-center gap-6 md:grid-cols-4 md:gap-8 lg:gap-10"
          role="timer"
          aria-live="polite"
          aria-atomic="true"
          suppressHydrationWarning
        >
          {units.map(({ label, value, digits }) => (
            <div key={label} className="flex min-w-0 flex-col items-center">
              <DigitPair value={value} maxDigits={digits} reducedMotion={reducedMotion} />
              <p
                className="mt-3 tracking-[0.2em] md:mt-4"
                style={{
                  fontFamily: 'var(--font-flip-label, var(--font-body))',
                  fontSize: 'clamp(0.58rem, 1.6vw, 0.68rem)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--primary-dark)',
                  opacity: 0.85,
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
