import Link from 'next/link';
import { notFound } from 'next/navigation';
import GalleryBackUnderLogo from '@/components/GalleryBackUnderLogo';
import GalleryImageGrid from '@/components/GalleryImageGrid';
import { resolveGalleryItems } from '@/lib/gallery-data';
import { readCmsData } from '@/lib/cms-store';

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await readCmsData();
  const item = resolveGalleryItems(data.images.galleryCollections).find((row) => row.slug === slug);
  if (!item) notFound();

  return (
    <div className="bg-white text-neutral-900">
      <GalleryBackUnderLogo />
      <header className="foe-shell pt-24 pb-12 text-center md:pt-32 md:pb-16">
        <h1
          className="mx-auto mb-8 max-w-4xl text-[clamp(2.5rem,8vw,4.5rem)] font-light leading-[1.05] tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {item.title}
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 md:text-lg">{item.description}</p>
      </header>

      <section className="border-t border-neutral-200 bg-neutral-50 py-10 md:py-14">
        <GalleryImageGrid images={item.images} title={item.title} />
      </section>

      <div className="foe-shell flex flex-col items-center gap-4 border-t border-neutral-200 py-16 md:flex-row md:justify-center md:py-20">
        <Link
          href="/gallery"
          className="border border-neutral-900 px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          All collections
        </Link>
        <Link
          href="/registration"
          className="border border-[var(--primary)] bg-[var(--primary)] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Register for 2026
        </Link>
      </div>
    </div>
  );
}
