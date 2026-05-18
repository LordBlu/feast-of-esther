import { NextRequest, NextResponse } from 'next/server';
import { appendDonationIntent } from '@/lib/cms-store';

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

export async function POST(request: NextRequest) {
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
  if (!Number.isFinite(amount) || amount < 0) {
    return NextResponse.json({ error: 'amount must be a non-negative number' }, { status: 400 });
  }

  await appendDonationIntent({
    action,
    method,
    amount,
    firstName: typeof body.firstName === 'string' ? body.firstName : undefined,
    lastName: typeof body.lastName === 'string' ? body.lastName : undefined,
    email: typeof body.email === 'string' ? body.email : undefined,
    phone: typeof body.phone === 'string' ? body.phone : undefined,
  });

  return NextResponse.json({ ok: true });
}
