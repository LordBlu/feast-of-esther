import type { CmsData } from '@/lib/cms-types';
import { readCmsHistoryRaw, writeCmsHistoryRaw } from '@/lib/cms-persistence';
import { applyContentSnapshot, toContentSnapshot, type CmsContentSnapshot } from '@/lib/cms-snapshot';
import {
  MAX_SAVED_STATES,
  MAX_UNDO_STATES,
  type CmsHistorySummary,
} from '@/lib/cms-history-constants';

export { MAX_SAVED_STATES, MAX_UNDO_STATES };
export type { CmsHistorySummary };

export interface CmsHistoryEntry {
  savedAt: string;
  label: string;
  data: CmsContentSnapshot;
}

export interface CmsHistoryFile {
  version: 1;
  zero: CmsHistoryEntry | null;
  undoStack: CmsHistoryEntry[];
  savedSlots: Array<CmsHistoryEntry | null>;
}

function emptyHistoryFile(): CmsHistoryFile {
  return {
    version: 1,
    zero: null,
    undoStack: [],
    savedSlots: Array.from({ length: MAX_SAVED_STATES }, () => null),
  };
}

async function ensureHistoryFile(): Promise<void> {
  const existing = await readCmsHistoryRaw();
  if (existing) return;
  await writeCmsHistoryRaw(JSON.stringify(emptyHistoryFile(), null, 2));
}

function normalizeHistory(parsed: Partial<CmsHistoryFile>): CmsHistoryFile {
  const base = emptyHistoryFile();
  const slots = Array.isArray(parsed.savedSlots) ? [...parsed.savedSlots] : [];
  while (slots.length < MAX_SAVED_STATES) slots.push(null);
  return {
    version: 1,
    zero: parsed.zero ?? null,
    undoStack: Array.isArray(parsed.undoStack) ? parsed.undoStack.slice(0, MAX_UNDO_STATES) : [],
    savedSlots: slots.slice(0, MAX_SAVED_STATES).map((slot) => slot ?? null),
  };
}

export async function readHistoryFile(): Promise<CmsHistoryFile> {
  await ensureHistoryFile();
  const raw = await readCmsHistoryRaw();
  if (!raw) return emptyHistoryFile();
  return normalizeHistory(JSON.parse(raw) as Partial<CmsHistoryFile>);
}

async function writeHistoryFile(file: CmsHistoryFile): Promise<void> {
  await writeCmsHistoryRaw(JSON.stringify(file, null, 2));
}

function formatUndoLabel(savedAt: string): string {
  const d = new Date(savedAt);
  return Number.isNaN(d.getTime()) ? savedAt : d.toLocaleString();
}

function makeEntry(data: CmsData, label: string): CmsHistoryEntry {
  return {
    savedAt: new Date().toISOString(),
    label,
    data: toContentSnapshot(data),
  };
}

export async function getHistorySummary(): Promise<CmsHistorySummary> {
  const file = await readHistoryFile();
  return {
    zero: file.zero ? { label: file.zero.label, savedAt: file.zero.savedAt } : null,
    undoCount: file.undoStack.length,
    undoLabels: file.undoStack.map((e) => e.label || formatUndoLabel(e.savedAt)),
    savedSlots: file.savedSlots.map((slot, index) =>
      slot ? { index, label: slot.label, savedAt: slot.savedAt } : null
    ),
  };
}

/** Push current site content onto undo stack before a write (newest first). */
export async function recordUndoBeforeWrite(current: CmsData): Promise<void> {
  const file = await readHistoryFile();
  const at = new Date().toISOString();
  const entry = makeEntry(current, `Before change · ${formatUndoLabel(at)}`);
  file.undoStack.unshift(entry);
  file.undoStack = file.undoStack.slice(0, MAX_UNDO_STATES);
  await writeHistoryFile(file);
}

async function restoreSnapshot(snapshot: CmsContentSnapshot, options: { pushUndo: boolean }): Promise<CmsData> {
  const { readCmsData, writeCmsData } = await import('@/lib/cms-store');
  const current = await readCmsData();
  if (options.pushUndo) {
    await recordUndoBeforeWrite(current);
  }
  const next = applyContentSnapshot(current, snapshot);
  await writeCmsData(next, { recordHistory: false });
  return next;
}

export async function setZeroFromCurrent(current: CmsData): Promise<CmsHistoryEntry> {
  const file = await readHistoryFile();
  const entry = makeEntry(current, 'Zero');
  file.zero = entry;
  await writeHistoryFile(file);
  return entry;
}

export async function restoreZero(): Promise<CmsData> {
  const file = await readHistoryFile();
  if (!file.zero) {
    throw new Error('Zero baseline is not set yet.');
  }
  return restoreSnapshot(file.zero.data, { pushUndo: true });
}

export async function undoOnce(): Promise<CmsData> {
  const file = await readHistoryFile();
  const previous = file.undoStack.shift();
  if (!previous) {
    throw new Error('No undo states available.');
  }
  await writeHistoryFile(file);
  return restoreSnapshot(previous.data, { pushUndo: false });
}

export async function saveToSlot(slotIndex: number, name: string, current: CmsData): Promise<CmsHistoryEntry> {
  if (slotIndex < 0 || slotIndex >= MAX_SAVED_STATES) {
    throw new Error(`Slot index must be 0–${MAX_SAVED_STATES - 1}.`);
  }
  const label = name.trim() || `Saved ${slotIndex + 1}`;
  const file = await readHistoryFile();
  const entry = makeEntry(current, label);
  file.savedSlots[slotIndex] = entry;
  await writeHistoryFile(file);
  return entry;
}

export async function restoreFromSlot(slotIndex: number): Promise<CmsData> {
  if (slotIndex < 0 || slotIndex >= MAX_SAVED_STATES) {
    throw new Error(`Slot index must be 0–${MAX_SAVED_STATES - 1}.`);
  }
  const file = await readHistoryFile();
  const slot = file.savedSlots[slotIndex];
  if (!slot) {
    throw new Error(`Saved slot ${slotIndex + 1} is empty.`);
  }
  return restoreSnapshot(slot.data, { pushUndo: true });
}

export async function clearSavedSlot(slotIndex: number): Promise<void> {
  const file = await readHistoryFile();
  if (slotIndex < 0 || slotIndex >= MAX_SAVED_STATES) return;
  file.savedSlots[slotIndex] = null;
  await writeHistoryFile(file);
}
