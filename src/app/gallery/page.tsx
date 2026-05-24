import GalleryVerticalFeed from '@/components/GalleryVerticalFeed';
import { resolveGalleryItems } from '@/lib/gallery-data';
import { readCmsData } from '@/lib/cms-store';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const data = await readCmsData();
  const items = resolveGalleryItems(data.images.galleryCollections);
  return <GalleryVerticalFeed items={items} pageTitle={data.pageContent.gallery.pageTitle} pageSubtitle={data.pageContent.gallery.pageSubtitle} />;
}
