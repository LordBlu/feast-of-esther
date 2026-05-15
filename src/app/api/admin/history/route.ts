import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getHistorySummary } from '@/lib/cms-history';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const summary = await getHistorySummary();
  return NextResponse.json({ summary, maxUndo: 30, maxSaved: 30 });
}
