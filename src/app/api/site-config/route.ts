import { NextResponse } from 'next/server';
import { readCmsData } from '@/lib/cms-store';
import { buildPublicSiteConfig } from '@/lib/public-site-config';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limited = checkRateLimit(`site-config:${ip}`, 120, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } },
    );
  }

  const data = await readCmsData();
  const body = buildPublicSiteConfig(data);
  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
    },
  });
}
