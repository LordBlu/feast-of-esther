import { NextRequest, NextResponse } from 'next/server';
import { readCmsData, writeCmsData } from '@/lib/cms-store';
import { RegistrationRecord } from '@/lib/cms-types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<RegistrationRecord>;
    if (!body.fullName || !body.email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    const data = await readCmsData();
    const registration: RegistrationRecord = {
      id: crypto.randomUUID(),
      fullName: body.fullName,
      email: body.email.toLowerCase(),
      phone: body.phone ?? '',
      church: body.church ?? '',
      city: body.city ?? '',
      country: body.country ?? '',
      notes: body.notes ?? '',
      createdAt: new Date().toISOString(),
    };

    data.registrations.unshift(registration);
    await writeCmsData(data, { recordHistory: false });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
