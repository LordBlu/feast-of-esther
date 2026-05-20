import { NextRequest, NextResponse } from 'next/server';
import { readCmsData, writeCmsData } from '@/lib/cms-store';
import { RegistrationRecord } from '@/lib/cms-types';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const MAX_FIELD = 500;
const MAX_NOTES = 4000;
const MAX_REGISTRATIONS = 5000;

function trimField(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = checkRateLimit(`registrations:${ip}`, 8, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } },
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const fullName = trimField(body.fullName, MAX_FIELD);
    const email = trimField(body.email, MAX_FIELD).toLowerCase();
    if (!fullName || !email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Full name and a valid email are required' },
        { status: 400 },
      );
    }

    const data = await readCmsData();
    if (data.registrations.length >= MAX_REGISTRATIONS) {
      return NextResponse.json(
        { error: 'Registration is temporarily unavailable. Please contact us directly.' },
        { status: 503 },
      );
    }

    const registration: RegistrationRecord = {
      id: crypto.randomUUID(),
      fullName,
      email,
      phone: trimField(body.phone, 40),
      church: trimField(body.church, MAX_FIELD),
      city: trimField(body.city, MAX_FIELD),
      country: trimField(body.country, MAX_FIELD),
      notes: trimField(body.notes, MAX_NOTES),
      createdAt: new Date().toISOString(),
    };

    data.registrations.unshift(registration);
    await writeCmsData(data, { recordHistory: false });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
