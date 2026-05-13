import type { CmsData } from '@/lib/cms-types';

/** Resolved flip-clock target for the public site. */
export function resolveCountdownForPublic(data: CmsData): {
  enabled: boolean;
  targetAt: string | null;
} {
  const cd = data.countdown;
  if (!cd?.enabled) return { enabled: false, targetAt: null };

  if (cd.sourceEventId) {
    const ev = data.events.find((e) => e.id === cd.sourceEventId);
    const t = ev?.countdownTargetAt?.trim();
    if (t) return { enabled: true, targetAt: t };
  }

  const fb = cd.fallbackTargetAt?.trim();
  if (fb) return { enabled: true, targetAt: fb };

  return { enabled: false, targetAt: null };
}
