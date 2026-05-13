import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { readCmsData } from '@/lib/cms-store';

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await readCmsData();
  const search = request.nextUrl.searchParams.get('search')?.trim().toLowerCase() ?? '';
  const page = Math.max(1, Number.parseInt(request.nextUrl.searchParams.get('page') ?? '1', 10) || 1);
  const pageSizeRaw = Number.parseInt(request.nextUrl.searchParams.get('pageSize') ?? '12', 10) || 12;
  const pageSize = Math.min(100, Math.max(5, pageSizeRaw));

  let list = [...data.registrations];
  if (search) {
    list = list.filter((r) => {
      const hay = [
        r.fullName,
        r.email,
        r.phone ?? '',
        r.church ?? '',
        r.city ?? '',
        r.country ?? '',
        r.notes ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(search);
    });
  }

  const total = list.length;
  const start = (page - 1) * pageSize;
  const registrations = list.slice(start, start + pageSize);

  return NextResponse.json({
    registrations,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}
