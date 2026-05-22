import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { readCmsData, writeCmsData } from '@/lib/cms-store';
import { SocialLink } from '@/lib/cms-types';
import { revalidateAfterCmsSave } from '@/lib/revalidate-cms-pages';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function sanitizeSocialLinks(input: unknown): SocialLink[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((row, idx) => {
      const item = row as Partial<SocialLink>;
      const id = String(item.id ?? `social-${idx + 1}`)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-');
      return {
        id,
        label: String(item.label ?? '').trim(),
        url: String(item.url ?? '').trim(),
        enabled: item.enabled !== false,
      };
    })
    .filter((item) => item.label && item.url);
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const data = await readCmsData();
  return NextResponse.json({ socialLinks: data.socialLinks });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const body = await request.json();
  const data = await readCmsData();
  data.socialLinks = sanitizeSocialLinks(body.socialLinks);
  await writeCmsData(data);
  revalidateAfterCmsSave(['/']);
  return NextResponse.json({ socialLinks: data.socialLinks });
}
