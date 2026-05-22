import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { cmsErrorResponse } from '@/lib/cms-api-error';
import { readCmsData, writeCmsData } from '@/lib/cms-store';
import { CMS_PAGE_PATHS, revalidateAfterCmsSave } from '@/lib/revalidate-cms-pages';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const data = await readCmsData();
  return NextResponse.json({ about: data.about });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const body = await request.json();
  const data = await readCmsData();
  data.about = {
    ...data.about,
    ...body,
  };
  try {
    await writeCmsData(data);
  } catch (error) {
    return cmsErrorResponse(error, 'Could not save About page');
  }
  revalidateAfterCmsSave([...CMS_PAGE_PATHS.about]);
  return NextResponse.json({ about: data.about });
}
