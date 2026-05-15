/** Shared limits for CMS version history (safe to import from client components). */

export const MAX_UNDO_STATES = 30;
export const MAX_SAVED_STATES = 30;

export interface CmsHistorySummary {
  zero: { label: string; savedAt: string } | null;
  undoCount: number;
  undoLabels: string[];
  savedSlots: Array<{ index: number; label: string; savedAt: string } | null>;
}
