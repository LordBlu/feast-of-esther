import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { readCmsData } from '@/lib/cms-store';

function escapeCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await readCmsData();
  const header = [
    'id',
    'full_name',
    'email',
    'phone',
    'church',
    'city',
    'country',
    'notes',
    'created_at',
  ].join(',');

  const rows = data.registrations.map((item) =>
    [
      item.id,
      item.fullName,
      item.email,
      item.phone ?? '',
      item.church ?? '',
      item.city ?? '',
      item.country ?? '',
      item.notes ?? '',
      item.createdAt,
    ]
      .map((cell) => escapeCell(String(cell)))
      .join(',')
  );

  const csv = [header, ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="foe-registrations.csv"',
    },
  });
}
