import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { cmsErrorResponse } from '@/lib/cms-api-error';
import { readCmsData, writeCmsData } from '@/lib/cms-store';
import { CMS_PAGE_PATHS, revalidateAfterCmsSave } from '@/lib/revalidate-cms-pages';
import type { AboutPageContent, SiteImages, SitePageContents } from '@/lib/cms-types';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

type PlaceholdersPayload = {
  images?: Pick<SiteImages, 'placeholderUrls' | 'heroPosterUrl'>;
  about?: Pick<AboutPageContent, 'heroImageUrl'>;
  pageContent?: Pick<SitePageContents, 'about2' | 'founder'>;
};

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return unauthorized();

  const body = (await request.json()) as PlaceholdersPayload;
  const data = await readCmsData();

  if (body.images) {
    if (body.images.placeholderUrls !== undefined) {
      data.images.placeholderUrls = body.images.placeholderUrls;
    }
    if (body.images.heroPosterUrl !== undefined) {
      data.images.heroPosterUrl = body.images.heroPosterUrl;
    }
  }

  if (body.about?.heroImageUrl !== undefined) {
    data.about.heroImageUrl = body.about.heroImageUrl;
  }

  if (body.pageContent?.about2) {
    data.pageContent.about2 = { ...data.pageContent.about2, ...body.pageContent.about2 };
  }
  if (body.pageContent?.founder) {
    data.pageContent.founder = { ...data.pageContent.founder, ...body.pageContent.founder };
  }

  try {
    await writeCmsData(data);
  } catch (error) {
    return cmsErrorResponse(error, 'Could not save placeholders');
  }

  let imagesOut = data.images;
  let aboutOut = data.about;
  let pageContentOut = data.pageContent;
  try {
    const verified = await readCmsData();
    imagesOut = verified.images;
    aboutOut = verified.about;
    pageContentOut = verified.pageContent;
  } catch {
    /* return in-memory payload if re-read fails */
  }

  revalidateAfterCmsSave([
    ...CMS_PAGE_PATHS.home,
    ...CMS_PAGE_PATHS.about,
    ...CMS_PAGE_PATHS.founder,
    ...CMS_PAGE_PATHS.events,
  ]);

  return NextResponse.json({
    images: imagesOut,
    about: aboutOut,
    pageContent: pageContentOut,
  });
}
