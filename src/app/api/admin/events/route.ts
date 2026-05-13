import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { readCmsData, writeCmsData } from '@/lib/cms-store';
import { SiteEvent } from '@/lib/cms-types';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const data = await readCmsData();
  const filter = request.nextUrl.searchParams.get('status');
  let events = data.events;
  if (filter === 'draft' || filter === 'published') {
    events = events.filter((e) => e.status === filter);
  }
  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  const body = (await request.json()) as Partial<SiteEvent>;
  if (!body.title || !body.description || !body.dateLabel || !body.venue) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const data = await readCmsData();
  const now = new Date().toISOString();
  const id = body.id ?? crypto.randomUUID();

  const status =
    body.status === 'draft' || body.status === 'published' ? body.status : 'published';

  const existingIndex = data.events.findIndex((item) => item.id === id);
  const previous = existingIndex >= 0 ? data.events[existingIndex] : undefined;

  let countdownTargetAt: string | undefined = previous?.countdownTargetAt;
  if (body.countdownTargetAt !== undefined) {
    if (body.countdownTargetAt === null || String(body.countdownTargetAt).trim() === '') {
      countdownTargetAt = undefined;
    } else {
      const d = new Date(String(body.countdownTargetAt));
      if (!Number.isNaN(d.getTime())) countdownTargetAt = d.toISOString();
    }
  }

  const event: SiteEvent = {
    id,
    title: body.title,
    category: body.category === 'past' ? 'past' : 'upcoming',
    theme: body.theme ?? '',
    scripture: body.scripture ?? '',
    description: body.description,
    dateLabel: body.dateLabel,
    venue: body.venue,
    registrationUrl: body.registrationUrl ?? '/registration',
    ctaLabel: body.ctaLabel ?? '',
    heroImageUrl: body.heroImageUrl ?? '',
    imageUrl: body.imageUrl ?? '',
    gallerySlug: body.gallerySlug ?? '',
    countdownTargetAt,
    status,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };

  if (existingIndex >= 0) data.events[existingIndex] = event;
  else data.events.unshift(event);

  await writeCmsData(data);
  return NextResponse.json({ event });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing event id' }, { status: 400 });
  }

  const data = await readCmsData();
  data.events = data.events.filter((item) => item.id !== id);
  if (data.countdown?.sourceEventId === id) {
    data.countdown.sourceEventId = null;
  }
  await writeCmsData(data);
  return NextResponse.json({ success: true });
}
