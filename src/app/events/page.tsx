import Link from 'next/link';
import styles from './EventsStyles.module.css';
import { readCmsData } from '@/lib/cms-store';
import { resolveGalleryItems } from '@/lib/gallery-data';
import { ProgrammeSection } from '@/components/events/ProgrammeSection';

const DEFAULT_EVENT_FLYER_IMAGE =
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778244638/Save_thedate_mkpbnu.jpg';

export default async function EventsPage() {
  const cms = await readCmsData();
  const galleryItems = resolveGalleryItems(cms.images.galleryCollections);
  const publishedEvents = cms.events.filter((event) => event.status === 'published');
  const upcomingEvent = publishedEvents.find((event) => event.category !== 'past') ?? publishedEvents[0] ?? null;
  const pastEvents = publishedEvents.filter((event) => event.category === 'past');

  const heroImage =
    upcomingEvent?.heroImageUrl?.trim() ||
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777728539/20250710_090859_b81076.jpg';
  const flyerImage =
    upcomingEvent?.imageUrl?.trim() ||
    DEFAULT_EVENT_FLYER_IMAGE;
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

  return (
    <div className={styles.eventsContainer}>
      <section className={styles.eventsHero} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.62)), url('${heroImage}')` }}>
        <div className={styles.heroContent}>
          <span className={styles.dateBadge}>{eventDate}</span>
          <h1>{eventTitle}</h1>
          <p>{eventDescription}</p>
          <Link href={registrationUrl} className={styles.btnPrimary}>
            Register Now →
          </Link>
        </div>
      </section>

      <section className={styles.infoCardSection}>
        <div className={styles.infoCard}>
          <div className={styles.infoImage}>
            <img src={flyerImage} alt={`${eventTitle} flyer`} />
          </div>
          <div className={styles.infoDetails}>
            <span className={styles.eyebrow}>Event Information</span>
            <h2>{eventTheme}</h2>
            <p className={styles.verse}>{eventScripture}</p>
            <div className={styles.iconList}>
              <div>📅 <span>{eventDate}</span></div>
              <div>📍 <span>{eventVenue}</span></div>
              <div>👥 <span>Women in ministry leadership</span></div>
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
          <h2>Official Conference Hotel</h2>
          <p>Experience comfort and elegance at our designated hotel</p>
        </div>
        <div className={styles.hotelGrid}>
          <div className={styles.hotelPhoto}>
            <img src={hotelImage} alt="Official conference hotel room" />
          </div>
          <div className={styles.hotelDetails}>
            <h3>Dallas/Fort Worth Airport Marriott</h3>
            <p className={styles.hotelAddress}>{eventVenue}</p>
            <p className={styles.hotelBody}>Special group rates available for Feast of Esther attendees when booking through our official link below.</p>
            <Link href="https://app.marriott.com/reslink?id=1775501475543&key=GRP&app=resvlink" target="_blank" rel="noopener noreferrer" className={styles.bookBtn}>
              Book Your Stay →
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.pastSection}>
        <h2>Past Events</h2>
        <p>View pictures from previous conferences.</p>
        <div className={styles.pastGrid}>
          {pastEvents.map((event) => {
            const galleryMatch = galleryItems.find((item) => item.slug === event.gallerySlug);
            const href = event.gallerySlug ? `/gallery/${event.gallerySlug}` : '/gallery';
            const coverImage = event.imageUrl || galleryMatch?.coverImage || heroImage;
            return (
              <article key={event.id} className={styles.pastCard}>
                <img src={coverImage} alt={event.title} />
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
