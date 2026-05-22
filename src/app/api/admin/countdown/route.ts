import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { readCmsData, writeCmsData } from '@/lib/cms-store';
import type { SiteCountdownSettings } from '@/lib/cms-types';
import { resolveCountdownForPublic } from '@/lib/countdown-resolve';
import { revalidateAfterCmsSave } from '@/lib/revalidate-cms-pages';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const data = await readCmsData();
  return NextResponse.json({
    countdown: data.countdown,
    resolved: resolveCountdownForPublic(data),
  });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const body = (await request.json()) as Partial<SiteCountdownSettings>;
  const data = await readCmsData();

  data.countdown = {
    ...data.countdown,
    enabled: body.enabled ?? data.countdown.enabled,
    sourceEventId:
      body.sourceEventId === undefined ? data.countdown.sourceEventId : body.sourceEventId,
    fallbackTargetAt:
      typeof body.fallbackTargetAt === 'string' && body.fallbackTargetAt.trim()
        ? body.fallbackTargetAt.trim()
        : data.countdown.fallbackTargetAt,
  };

  await writeCmsData(data);
  revalidateAfterCmsSave(['/']);
  return NextResponse.json({
    countdown: data.countdown,
    resolved: resolveCountdownForPublic(data),
  });
}
