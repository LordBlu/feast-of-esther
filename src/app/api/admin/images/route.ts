import { CMS_PAGE_PATHS, revalidateAfterCmsSave } from '@/lib/revalidate-cms-pages';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { syncGalleryCollectionsToEvents } from '@/lib/gallery-event-sync';
import { cmsErrorResponse } from '@/lib/cms-api-error';
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

  try {
    await writeCmsData(data);
  } catch (error) {
    return cmsErrorResponse(error, 'Could not save images');
  }

  revalidateAfterCmsSave([
    ...CMS_PAGE_PATHS.home,
    ...CMS_PAGE_PATHS.gallery,
    ...CMS_PAGE_PATHS.events,
    ...CMS_PAGE_PATHS.founder,
    ...CMS_PAGE_PATHS.about,
  ]);

  return NextResponse.json({ images: data.images, events: data.events });
}
