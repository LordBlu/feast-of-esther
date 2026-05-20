import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminPassword,
  getAdminSessionToken,
  getAdminSessionCookieName,
} from '@/lib/admin-auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = checkRateLimit(`admin-login:${ip}`, 12, 15 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } },
    );
  }

  try {
    const { password } = await request.json();

    if (!password || password !== getAdminPassword()) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(getAdminSessionCookieName(), getAdminSessionToken(), {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
