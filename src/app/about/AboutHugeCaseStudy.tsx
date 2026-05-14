'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './AboutHugeCaseStudy.module.css';
import type { About2PageContent, AboutPageContent } from '@/lib/cms-types';
import { CAROUSEL_IMAGES, CHAPTERS, type ChapterKey } from '@/lib/about-chapters';

const LOGO_SRC =
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778153398/foe_logo_mlmi16.jpg';

const defaultAbout: AboutPageContent = {
  heroEyebrow: 'About',
  heroTitle: 'We Are The Feast of Esther',
  heroImageUrl:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778132653/foe_Group_foto_twphtz.png',
  storyTitle: 'Our Journey',
  storyParagraphs: [
    'Feast of Esther is an annual divine assignment organized by Pastor (Mrs.) Folu Adeboye, wife of the General Overseer of the Redeemed Christian Church of God.',
    'Since its inception in February 2002, this gathering has grown from the Redemption Camp Nigeria to reaching across Africa and Europe, impacting the lives of women in ministry.',
  ],
  missionEyebrow: 'Mission',
  missionTitle: 'Our mission',
  missionIntro: 'To create a forum where female ministry leaders learn to:',
  missionBody:
    'A divine gathering of women in ministry, organized by Pastor (Mrs.) Folu Adeboye, wife of the General Overseer of the Redeemed Christian Church of God.',
  leadershipEyebrow: 'Leadership',
  leadershipTitle: 'Our Leadership',
  leadershipProfiles: [],
};

const VISUALS: Record<
  'about' | 'our-journey' | 'who-we-are' | 'our-vision' | 'mission' | 'leadership' | 'outreach',
  string
> = {
  about: 'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778152795/foe_group_2_q6pcp8.jpg',
  'our-journey':
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761752/20260219_223539_aetz6w.jpg',
  'who-we-are':
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761661/20250711_200106_dxgplr.jpg',
  'our-vision':
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778153398/foe_logo_mlmi16.jpg',
  mission:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761505/20250221_200317_el9dzk.jpg',
  leadership: CAROUSEL_IMAGES[0],
  outreach:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778132653/foe_Group_foto_twphtz.png',
};

const SECTION_IDS = [
  'about',
  'our-journey',
  'who-we-are',
  'our-vision',
  'mission',
  'leadership',
  'outreach',
] as const;

type SectionId = (typeof SECTION_IDS)[number];

const sectionNav: { id: SectionId; label: string }[] = [
  { id: 'about', label: 'Intro' },
  { id: 'our-journey', label: 'Journey' },
  { id: 'who-we-are', label: 'Who we are' },
  { id: 'our-vision', label: 'Vision' },
  { id: 'mission', label: 'Mission' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'outreach', label: 'Chapters' },
];

const FOCUS_ITEMS = [
  'Women in senior ministry and leadership across denominations.',
  'Fellowship, prayer, renewal, and equipping for kingdom impact.',
  'A sacred annual gathering rooted in Scripture and calling.',
];

function VisualStack({
  activeSection,
  carouselIndex,
}: {
  activeSection: SectionId;
  carouselIndex: number;
}) {
  return (
    <div className={styles.visualStack}>
      {SECTION_IDS.map((id) => {
        const src =
          id === 'leadership' ? CAROUSEL_IMAGES[carouselIndex % CAROUSEL_IMAGES.length] : VISUALS[id];
        return (
          <figure key={id} className={`${styles.visualLayer} ${activeSection === id ? styles.active : ''}`}>
            <img src={src} alt="" role="presentation" decoding="async" />
          </figure>
        );
      })}
    </div>
  );
}

export default function AboutHugeCaseStudy() {
  const [about, setAbout] = useState<AboutPageContent>(defaultAbout);
  const [about2, setAbout2] = useState<About2PageContent>({});
  const [activeSection, setActiveSection] = useState<SectionId>('about');
  const [chapter, setChapter] = useState<ChapterKey>('Texas');
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (activeSection !== 'leadership') return;
    const timer = window.setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [activeSection]);

  useEffect(() => {
    fetch('/api/site-config')
      .then((res) => res.json())
      .then((data) => {
        if (!data?.about) return;
        setAbout({
          ...defaultAbout,
          ...data.about,
          storyParagraphs: Array.isArray(data.about.storyParagraphs)
            ? data.about.storyParagraphs.filter((s: unknown) => typeof s === 'string')
            : defaultAbout.storyParagraphs,
        });
        if (data.pageContent?.about2 && typeof data.pageContent.about2 === 'object') {
          setAbout2({ ...data.pageContent.about2 });
        }
      })
      .catch(() => setAbout(defaultAbout));
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        const id = visible[0].target.id as SectionId;
        if ((SECTION_IDS as readonly string[]).includes(id)) setActiveSection(id);
      },
      { rootMargin: '-22% 0px -55% 0px', threshold: [0.08, 0.2, 0.45] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const locations = CHAPTERS[chapter];
  const overviewText = about.storyParagraphs.join(' ');
  const focusItems = [
    about2.focusItem1?.trim() || FOCUS_ITEMS[0],
    about2.focusItem2?.trim() || FOCUS_ITEMS[1],
    about2.focusItem3?.trim() || FOCUS_ITEMS[2],
  ];
  const chromeTitle = about2.chromeTitle?.trim() || 'Woman-led ministry gathering — North America';
  const megaAccent =
    about2.megaAccent?.trim() ||
    '— A global gathering of women in ministry for worship, renewal, and structural impact.';
  const ctaBarText =
    about2.ctaBarText?.trim() ||
    'Feast of Esther 2026 — June 18–20, North America. Reserve your place at the table.';

  return (
    <div className={styles.shell}>
      {/* In-flow width so the right column clears the rail; `overflow-x-hidden` on <main> breaks sticky, so the rail is `position: fixed`. */}
      <div className={styles.railPlaceholder} aria-hidden />
      <aside className={styles.visualRail} aria-hidden>
        <VisualStack activeSection={activeSection} carouselIndex={carouselIndex} />
      </aside>

      <div className={styles.mobileVisual} aria-hidden>
        <VisualStack activeSection={activeSection} carouselIndex={carouselIndex} />
      </div>

      <div className={styles.mainRail}>
        <header className={styles.chrome}>
          <div className={styles.chromeLeft}>
            <div className={styles.logoTile}>
              <img src={LOGO_SRC} alt="" width={40} height={40} decoding="async" />
            </div>
            <p className={styles.chromeTitle}>{chromeTitle}</p>
          </div>
          <Link href="/" className={styles.chromeClose} aria-label="Close and return home">
            <span>Close</span>
            <span className={styles.closeIcon} aria-hidden>
              ×
            </span>
          </Link>
        </header>

        <div className={styles.scrollBody}>
          <nav className={styles.sectionNav} aria-label="On this page">
            {sectionNav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`${styles.navLink} ${activeSection === item.id ? styles.navLinkActive : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <section id="about" className={styles.section}>
              <h1 className={styles.mega}>
                {about.heroTitle}{' '}
                <span className={styles.megaAccent}>{megaAccent}</span>
              </h1>

              <div className={styles.dual}>
                <div>
                  <h2 className={styles.colHead}>Gathering focus —</h2>
                  <ul className={styles.arrowList}>
                    {focusItems.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className={styles.colHead}>Overview —</h2>
                  <p className={styles.body}>
                    A divine gathering organized by Pastor (Mrs.) Folu Adeboye, wife of the General Overseer of the
                    Redeemed Christian Church of God. {overviewText}
                  </p>
                </div>
              </div>

              <div className={styles.ctaBar}>
                <p>{ctaBarText}</p>
                <Link href="/registration" className={styles.ctaBtn}>
                  Register ↗
                </Link>
              </div>
          </section>

          <section id="our-journey" className={styles.section}>
              <p className={styles.sectionLabel}>Our Journey —</p>
              <h2 className={styles.sectionTitle}>From one camp to many nations.</h2>
              <div className={styles.twoColText}>
                {about.storyParagraphs.map((paragraph) => (
                  <p key={paragraph} className={`${styles.body} ${styles.bodySpaced}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
          </section>

          <section id="who-we-are" className={styles.section}>
              <p className={styles.sectionLabel}>Who we are —</p>
              <h2 className={styles.sectionTitle}>Leaders called to stand in the gap.</h2>
              <div className={styles.dual}>
                <div>
                  <h2 className={styles.colHead}>Community —</h2>
                  <ul className={styles.arrowList}>
                    <li>General Overseers and heads of ministries.</li>
                    <li>Wives of General Overseers, Prelates, and Archbishops.</li>
                    <li>Women leaders across denominations.</li>
                  </ul>
                </div>
                <div>
                  <h2 className={styles.colHead}>Purpose —</h2>
                  <p className={styles.body}>
                    This sacred gathering creates space for fellowship, prayer, renewal, and growth—empowering women
                    to stand in the gap for their churches, ministries, and nations.
                  </p>
                </div>
              </div>
          </section>

          <section id="our-vision" className={styles.section}>
              <p className={styles.sectionLabel}>Our Vision —</p>
              <h2 className={styles.sectionTitle}>Pillars in God&apos;s house—equipped for what&apos;s next.</h2>
              <p className={styles.body}>
                We exist so that women in ministry are raised as pillars—globally equipped, united, and empowered for
                spiritual leadership, ministry skills, and prophetic intercession.
              </p>
              <p className={styles.visionSub}>Beliefs —</p>
              <p className={styles.body}>
                To develop excellent ministry skills in women called to support and impact the church of God for nation
                building.
              </p>
              <p className={styles.visionSub}>Values —</p>
              <p className={styles.body}>
                We empower women in ministry to stand as pillars in the house of God, equipping them for structural
                impact in the church and in society.
              </p>
          </section>

          <section id="mission" className={styles.section}>
              <p className={styles.sectionLabel}>Mission —</p>
              <ul className={styles.arrowList}>
                <li>Accomplish their divine calling in ministry.</li>
                <li>Stand in the gap for churches, ministries and nations.</li>
                <li>Build purposeful fellowship and spiritual connection.</li>
                <li>Catalyze revival through effective church leadership.</li>
                <li>Ensure the maximum harvest of souls for the kingdom.</li>
              </ul>
          </section>

          <section id="leadership" className={styles.section}>
              <p className={styles.sectionLabel}>Leadership —</p>
              <h2 className={styles.sectionTitle}>Pastor Mrs. Grace Okonrende</h2>
              <div className={styles.pills}>
                <span>Country Coordinator Feast of Esther USA</span>
                <span>Continental Evangelist RCCG America</span>
              </div>
              <p className={`${styles.body} ${styles.bodySpaced}`}>
                Pastor Grace Okonrende is a dynamic evangelist and Deliverance Minister; she and her husband are
                gifted marriage counselors, serving the Lord from her youthful days.
              </p>
              <p className={`${styles.body} ${styles.bodySpaced}`}>
                She pioneered churches in Nigeria and the UK, took RCCG to Ireland, and established RCCG in Sacramento,
                Oakland, and Stockton, California. She co-pastors the Pavilion of Redemption in Sugar Land, Texas.
              </p>
              <div className={styles.dots}>
                {CAROUSEL_IMAGES.map((img, idx) => (
                  <button
                    type="button"
                    key={img}
                    aria-label={`Leadership photo ${idx + 1}`}
                    className={idx === carouselIndex ? styles.dotActive : styles.dot}
                    onClick={() => setCarouselIndex(idx)}
                  />
                ))}
              </div>
          </section>

          <section id="outreach" className={styles.section}>
            <h2 className={styles.outreachMainTitle}>Our Chapters</h2>
            <div className={styles.outreachShowcase}>
              <div className={styles.outreachMetricIcon}>⌃</div>
              <p className={styles.outreachMetricValue}>10+</p>
              <p className={styles.outreachMetricLabel}>Sister Chapters</p>
              <p className={styles.outreachMetricCopy}>
                Explore our presence across the United States and beyond
              </p>
            </div>
            <div className={styles.chapterTabs}>
              {(Object.keys(CHAPTERS) as ChapterKey[]).map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setChapter(item)}
                  className={chapter === item ? styles.chapterTabActive : styles.chapterTab}
                >
                  <span className={styles.tabDot} />
                  {item}
                </button>
              ))}
            </div>
            <div className={styles.chapterPanel}>
              <div className={styles.chapterHeader}>
                <h3>{chapter}</h3>
                <span>
                  {locations.length} Location{locations.length === 1 ? '' : 's'}
                </span>
              </div>
              {locations.length ? (
                <div className={styles.locationsGrid}>
                  {locations.map((location) => (
                    <article key={location} className={styles.locationCard}>
                      <div className={styles.locationIcon}>📍</div>
                      <p>{location}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyLocations}>No locations listed yet for {chapter}</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
