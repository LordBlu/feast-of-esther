import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { syncGalleryCollectionsToEvents } from '@/lib/gallery-event-sync';
import { readCmsData, writeCmsData } from '@/lib/cms-store';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const data = await readCmsData();
  return NextResponse.json({ images: data.images });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  const body = await request.json();
  const data = await readCmsData();

  data.images = {
    ...data.images,
    ...body,
  };

  if (Array.isArray(data.images.galleryCollections)) {
    const sync = syncGalleryCollectionsToEvents(data.images.galleryCollections, data.events);
    data.images.galleryCollections = sync.collections;
    data.events = sync.events;
  }

  await writeCmsData(data);

  revalidatePath('/gallery', 'layout');
  revalidatePath('/events');
  revalidatePath('/');

  return NextResponse.json({ images: data.images, events: data.events });
}
