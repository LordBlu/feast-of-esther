import GalleryVerticalFeed from '@/components/GalleryVerticalFeed';
import { resolveGalleryItems } from '@/lib/gallery-data';
import { readCmsData } from '@/lib/cms-store';

export default async function GalleryPage() {
  const data = await readCmsData();
  const items = resolveGalleryItems(data.images.galleryCollections);
  return <GalleryVerticalFeed items={items} />;
}
