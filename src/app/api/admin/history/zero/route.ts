import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { restoreZero, setZeroFromCurrent } from '@/lib/cms-history';
import { readCmsData } from '@/lib/cms-store';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/** Save current site content as Zero baseline. */
export async function PUT() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  try {
    const current = await readCmsData();
    const entry = await setZeroFromCurrent(current);
    return NextResponse.json({
      ok: true,
      zero: { label: entry.label, savedAt: entry.savedAt },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to set Zero.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Restore site content from Zero (registrations unchanged). */
export async function POST() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  try {
    await restoreZero();
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to restore Zero.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
