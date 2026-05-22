import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { mergeExecutivesContent } from '@/lib/executive-data';
import type { ExecutivesPageContent } from '@/lib/cms-types';
import { readCmsData, writeCmsData } from '@/lib/cms-store';
import { CMS_PAGE_PATHS, revalidateAfterCmsSave } from '@/lib/revalidate-cms-pages';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const data = await readCmsData();
  return NextResponse.json({ executives: data.executives });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const body = (await request.json()) as { executives?: Partial<ExecutivesPageContent> };
  const data = await readCmsData();
  data.executives = mergeExecutivesContent({
    ...data.executives,
    ...body.executives,
    chairperson: body.executives?.chairperson
      ? { ...data.executives.chairperson, ...body.executives.chairperson }
      : data.executives.chairperson,
    committee: body.executives?.committee ?? data.executives.committee,
  });
  await writeCmsData(data);
  revalidateAfterCmsSave([...CMS_PAGE_PATHS.executive]);
  return NextResponse.json({ executives: data.executives });
}
