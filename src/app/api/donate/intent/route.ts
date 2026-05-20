import { NextRequest, NextResponse } from 'next/server';
import { appendDonationIntent } from '@/lib/cms-store';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

type DonateAction = 'method_select' | 'give_click' | 'paypal_link';
type DonateMethod = 'zeffy' | 'paypal';

function parseAction(value: unknown): DonateAction | null {
  if (value === 'method_select' || value === 'give_click' || value === 'paypal_link') return value;
  return null;
}

function parseMethod(value: unknown): DonateMethod | null {
  if (value === 'zeffy' || value === 'paypal') return value;
  return null;
}

function trimOptional(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const t = value.trim().slice(0, max);
  return t || undefined;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = checkRateLimit(`donate-intent:${ip}`, 40, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const action = parseAction(body.action);
  const method = parseMethod(body.method);
  if (!action || !method) {
    return NextResponse.json({ error: 'action and method are required' }, { status: 400 });
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000) {
    return NextResponse.json({ error: 'amount must be a non-negative number' }, { status: 400 });
  }

  await appendDonationIntent({
    action,
    method,
    amount,
    firstName: trimOptional(body.firstName, 80),
    lastName: trimOptional(body.lastName, 80),
    email: trimOptional(body.email, 120),
    phone: trimOptional(body.phone, 40),
  });

  return NextResponse.json({ ok: true });
}
