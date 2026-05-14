'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Soft crossfade between routes. Intentionally **opacity-only**: `transform` or `filter`
 * on this wrapper would create a containing block and break `position: fixed` / `sticky`
 * rails (e.g. About Us case-study layout).
 */
export default function PageViewTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const reduceMotion = useReducedMotion();

  const duration = reduceMotion ? 0.12 : 0.38;
  const ease = [0.22, 0.82, 0.2, 1] as const;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="w-full"
        initial={reduceMotion ? { opacity: 0.96 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? { opacity: 0.96 } : { opacity: 0 }}
        transition={{ duration, ease }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
