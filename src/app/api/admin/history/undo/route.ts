import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { undoOnce } from '@/lib/cms-history';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  try {
    await undoOnce();
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Nothing to undo.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
