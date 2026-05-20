import Link from 'next/link';
import SiteImage from '@/components/SiteImage';
import styles from './EventsStyles.module.css';
import { readCmsData } from '@/lib/cms-store';
import { resolveGalleryItems } from '@/lib/gallery-data';
import { resolveEventsDefaultFlyer, resolveEventsDefaultHero } from '@/lib/site-placeholders';
import { ProgrammeSection } from '@/components/events/ProgrammeSection';

export default async function EventsPage() {
  const cms = await readCmsData();
  const galleryItems = resolveGalleryItems(cms.images.galleryCollections);
  const publishedEvents = cms.events.filter((event) => event.status === 'published');
  const upcomingEvent = publishedEvents.find((event) => event.category !== 'past') ?? publishedEvents[0] ?? null;
  const pastEvents = publishedEvents.filter((event) => event.category === 'past');

  const placeholderMap = cms.images.placeholderUrls;
  const heroImage =
    upcomingEvent?.heroImageUrl?.trim() || resolveEventsDefaultHero(placeholderMap);
  const flyerImage =
    upcomingEvent?.imageUrl?.trim() || resolveEventsDefaultFlyer(placeholderMap);
  const eventTitle = upcomingEvent?.title || 'Feast of Esther 2026';
  const eventTheme = upcomingEvent?.theme || 'The Anointing That Endures';
  const eventDate = upcomingEvent?.dateLabel || 'June 18TH - 20TH, 2026';
  const eventVenue =
    upcomingEvent?.venue ||
    'Dallas/Fort Worth Airport Marriott, 8440 Freeport Parkway, Irving, Texas, USA, 75063';
  const eventScripture = upcomingEvent?.scripture || '2 Kings 13:20-21';
  const eventDescription =
    upcomingEvent?.description ||
    'An exclusive forum for the first lady in ministry and Christian organizations. Join us for this transformative gathering of women in leadership.';
  const registrationUrl = upcomingEvent?.registrationUrl || '/registration';
  const registrationLabel = upcomingEvent?.ctaLabel?.trim() || 'Register for this Event';
  const hotelImage =
    cms.images.hotelRoomUrl ||
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778163272/Accom_x5ajjc.jpg';
  const pe = cms.pageContent.events;
  const hotelSectionTitle = pe.hotelSectionTitle ?? 'Official Conference Hotel';
  const hotelSectionSubtitle = pe.hotelSectionSubtitle ?? 'Experience comfort and elegance at our designated hotel';
  const hotelName = pe.hotelName ?? 'Dallas/Fort Worth Airport Marriott';
  const hotelBody =
    pe.hotelBody ??
    'Special group rates available for Feast of Esther attendees when booking through our official link below.';
  const bookStayUrl =
    pe.bookStayUrl ?? 'https://app.marriott.com/reslink?id=1775501475543&key=GRP&app=resvlink';
  const pastEventsTitle = pe.pastEventsTitle ?? 'Past Events';
  const pastEventsSubtitle = pe.pastEventsSubtitle ?? 'View pictures from previous conferences.';
  const audienceLine = pe.audienceLine ?? 'Women in ministry leadership';
  const heroRegisterCta = pe.heroRegisterCta ?? 'Register Now →';

  return (
    <div className={styles.eventsContainer}>
      <section className={styles.eventsHero}>
        <div className={styles.eventsHeroMedia} aria-hidden>
          <SiteImage
            src={heroImage}
            alt=""
            fill
            sizes="100vw"
            cloudWidth={1920}
            priority
            className="object-cover object-center"
          />
          <div className={styles.eventsHeroScrim} />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.dateBadge}>{eventDate}</span>
          <h1>{eventTitle}</h1>
          <p>{eventDescription}</p>
          <Link href={registrationUrl} className={styles.btnPrimary}>
            {heroRegisterCta}
          </Link>
        </div>
      </section>

      <section className={styles.infoCardSection}>
        <div className={styles.infoCard}>
          <div className={styles.infoImage}>
            <SiteImage
              src={flyerImage}
              alt={`${eventTitle} flyer`}
              width={640}
              height={800}
              cloudWidth={800}
              className="fx-media fx-zoom-in h-auto w-full"
            />
          </div>
          <div className={styles.infoDetails}>
            <span className={styles.eyebrow}>Event Information</span>
            <h2>{eventTheme}</h2>
            <p className={styles.verse}>{eventScripture}</p>
            <div className={styles.iconList}>
              <div>📅 <span>{eventDate}</span></div>
              <div>📍 <span>{eventVenue}</span></div>
              <div>👥 <span>{audienceLine}</span></div>
            </div>
            <Link href={registrationUrl} className={styles.regBtn}>
              {registrationLabel}
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.programmeSectionOuter}>
        <ProgrammeSection />
      </div>

      <section className={styles.hotelSection}>
        <div className={styles.hotelHeader}>
          <h2>{hotelSectionTitle}</h2>
          <p>{hotelSectionSubtitle}</p>
        </div>
        <div className={styles.hotelGrid}>
          <div className={`${styles.hotelPhoto} ${styles.mediaFill}`}>
            <SiteImage
              src={hotelImage}
              alt="Official conference hotel room"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              cloudWidth={960}
              className="fx-media fx-pan-vertical object-cover"
            />
          </div>
          <div className={styles.hotelDetails}>
            <h3>{hotelName}</h3>
            <p className={styles.hotelAddress}>{eventVenue}</p>
            <p className={styles.hotelBody}>{hotelBody}</p>
            <Link href={bookStayUrl} target="_blank" rel="noopener noreferrer" className={styles.bookBtn}>
              Book Your Stay →
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.pastSection}>
        <h2>{pastEventsTitle}</h2>
        <p>{pastEventsSubtitle}</p>
        <div className={styles.pastGrid}>
          {pastEvents.map((event) => {
            const galleryMatch = galleryItems.find((item) => item.slug === event.gallerySlug);
            const href = event.gallerySlug ? `/gallery/${event.gallerySlug}` : '/gallery';
            const coverImage = event.imageUrl || galleryMatch?.coverImage || heroImage;
            return (
              <article key={event.id} className={styles.pastCard}>
                <div className={styles.pastCardMedia}>
                  <SiteImage
                    src={coverImage}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    cloudWidth={560}
                    className="object-cover"
                  />
                </div>
                <div className={styles.pastCardBody}>
                  <h3>{event.title}</h3>
                  <p>{event.dateLabel}</p>
                  <Link href={href}>View Photos →</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
