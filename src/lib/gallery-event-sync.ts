import type { GalleryCollection, SiteEvent } from '@/lib/cms-types';
import { isGalleryCollectionComplete, normalizeGalleryCollection } from '@/lib/gallery-data';

function collectionMeta(collection: GalleryCollection) {
  return {
    collectionType: collection.collectionType === 'event' ? ('event' as const) : ('general' as const),
    linkedEventId: collection.linkedEventId?.trim() || undefined,
    eventDateLabel: collection.eventDateLabel?.trim() || '',
    eventVenue: collection.eventVenue?.trim() || '',
  };
}

function buildPastEventFromCollection(
  collection: GalleryCollection,
  existing: SiteEvent | undefined,
  now: string
): SiteEvent {
  const normalized = normalizeGalleryCollection(collection);
  const meta = collectionMeta(collection);
  return {
    id: existing?.id ?? meta.linkedEventId ?? crypto.randomUUID(),
    title: normalized.title,
    category: 'past',
    theme: existing?.theme ?? '',
    scripture: existing?.scripture ?? '',
    description: normalized.description,
    dateLabel: meta.eventDateLabel || normalized.year,
    venue: meta.eventVenue || existing?.venue || '',
    registrationUrl: existing?.registrationUrl ?? '/registration',
    ctaLabel: existing?.ctaLabel?.trim() || 'View Photos',
    heroImageUrl: existing?.heroImageUrl ?? '',
    imageUrl: normalized.imageUrls[0] ?? existing?.imageUrl ?? '',
    gallerySlug: normalized.slug,
    status: 'published',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

/**
 * Keeps past events in sync with gallery collections marked as `collectionType: 'event'`.
 * Returns updated collections (with linkedEventId filled) and events array.
 */
export function syncGalleryCollectionsToEvents(
  collections: GalleryCollection[],
  events: SiteEvent[]
): { collections: GalleryCollection[]; events: SiteEvent[] } {
  const now = new Date().toISOString();
  let nextEvents = [...events];
  const updatedCollections: GalleryCollection[] = [];

  for (const raw of collections) {
    const meta = collectionMeta(raw);
    const normalized = normalizeGalleryCollection(raw);

    if (meta.collectionType !== 'event') {
      if (meta.linkedEventId) {
        nextEvents = nextEvents.filter((e) => e.id !== meta.linkedEventId);
      }
      updatedCollections.push({
        ...normalized,
        collectionType: 'general',
        linkedEventId: undefined,
        eventDateLabel: undefined,
        eventVenue: undefined,
      });
      continue;
    }

    if (!isGalleryCollectionComplete(raw)) {
      updatedCollections.push({
        ...normalized,
        ...meta,
      });
      continue;
    }

    const existing =
      (meta.linkedEventId ? nextEvents.find((e) => e.id === meta.linkedEventId) : undefined) ??
      nextEvents.find((e) => e.gallerySlug === normalized.slug && e.category === 'past');

    const event = buildPastEventFromCollection(raw, existing, now);
    const idx = nextEvents.findIndex((e) => e.id === event.id);
    if (idx >= 0) nextEvents[idx] = event;
    else nextEvents.unshift(event);

    updatedCollections.push({
      ...normalized,
      collectionType: 'event',
      linkedEventId: event.id,
      eventDateLabel: meta.eventDateLabel || normalized.year,
      eventVenue: meta.eventVenue,
    });
  }

  return { collections: updatedCollections, events: nextEvents };
}
