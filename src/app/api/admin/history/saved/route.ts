import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { clearSavedSlot, restoreFromSlot, saveToSlot } from '@/lib/cms-history';
import { readCmsData } from '@/lib/cms-store';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/** Save current site content to a slot (0–29). */
export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const body = (await request.json()) as { slotIndex?: number; name?: string };
  const slotIndex = Number(body.slotIndex);
  if (!Number.isInteger(slotIndex)) {
    return NextResponse.json({ error: 'slotIndex is required (0–29).' }, { status: 400 });
  }
  try {
    const current = await readCmsData();
    const entry = await saveToSlot(slotIndex, body.name ?? '', current);
    return NextResponse.json({
      ok: true,
      slot: { index: slotIndex, label: entry.label, savedAt: entry.savedAt },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save slot.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/** Restore site content from a saved slot. */
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const body = (await request.json()) as { slotIndex?: number };
  const slotIndex = Number(body.slotIndex);
  if (!Number.isInteger(slotIndex)) {
    return NextResponse.json({ error: 'slotIndex is required (0–29).' }, { status: 400 });
  }
  try {
    await restoreFromSlot(slotIndex);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to restore slot.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/** Clear a saved slot. */
export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const slotIndex = Number(new URL(request.url).searchParams.get('slotIndex'));
  if (!Number.isInteger(slotIndex)) {
    return NextResponse.json({ error: 'slotIndex query is required.' }, { status: 400 });
  }
  await clearSavedSlot(slotIndex);
  return NextResponse.json({ ok: true });
}
