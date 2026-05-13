import { NextResponse } from 'next/server';
import { readCmsData } from '@/lib/cms-store';
import { resolveCountdownForPublic } from '@/lib/countdown-resolve';

export async function GET() {
  const data = await readCmsData();
  const countdown = resolveCountdownForPublic(data);
  return NextResponse.json({
    popup: data.popup,
    images: data.images,
    events: data.events,
    countdown,
    about: data.about,
  });
}
