import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { readCmsData, writeCmsData } from '@/lib/cms-store';
import type { SitePageContents } from '@/lib/cms-types';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const data = await readCmsData();
  return NextResponse.json({ pageContent: data.pageContent });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const body = (await request.json()) as { pageContent?: Partial<SitePageContents> };
  const patch = body.pageContent ?? {};
  const data = await readCmsData();
  data.pageContent = {
    gallery: { ...data.pageContent.gallery, ...patch.gallery },
    events: { ...data.pageContent.events, ...patch.events },
    contact: { ...data.pageContent.contact, ...patch.contact },
    donate: { ...data.pageContent.donate, ...patch.donate },
    registration: { ...data.pageContent.registration, ...patch.registration },
    founder: { ...data.pageContent.founder, ...patch.founder },
    about2: { ...data.pageContent.about2, ...patch.about2 },
  };
  await writeCmsData(data);
  return NextResponse.json({ pageContent: data.pageContent });
}
