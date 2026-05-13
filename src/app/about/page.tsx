'use client';

import { useEffect, useState } from 'react';
import styles from './AboutSleek.module.css';
import type { AboutPageContent } from '@/lib/cms-types';
import type { ElementType, HTMLAttributes } from 'react';

type ChapterKey =
  | 'Texas'
  | 'Florida'
  | 'North Carolina'
  | 'Delaware'
  | 'New York / New Jersey'
  | 'Kentucky'
  | 'Maryland'
  | 'Georgia'
  | 'Oregon'
  | 'California'
  | 'The Caribbean';

const CHAPTERS: Record<ChapterKey, string[]> = {
  Texas: ['Houston', 'Dallas'],
  Florida: ['Orlando', 'Jacksonville', 'Hollywood', 'Tallahassee', 'Miami'],
  'North Carolina': ['Charlotte', 'Raleigh'],
  Delaware: [],
  'New York / New Jersey': [],
  Kentucky: ['Louisville'],
  Maryland: [],
  Georgia: ['Atlanta'],
  Oregon: ['Salem'],
  California: ['Oakland'],
  'The Caribbean': ['Jamaica'],
};

const CAROUSEL_IMAGES = [
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761734/20260219_131617_ocrby8.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761505/20250221_200317_el9dzk.jpg',
  'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761510/20250221_200448_xfsekz.jpg',
];

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

type TypewriterHeadingProps = {
  as?: ElementType;
  text: string;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children'>;

function TypewriterHeading({
  as: Tag = 'h2',
  text,
  className,
  id,
  ...rest
}: TypewriterHeadingProps) {
  const [typed, setTyped] = useState('');
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const node = id ? document.getElementById(id) : null;
    if (!node) {
      setStarted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: '-10% 0px -30% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [id]);

  useEffect(() => {
    setTyped('');
    setComplete(false);
    if (!started) return;
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      const next = text.slice(0, index);
      setTyped(next);
      if (index >= text.length) {
        window.clearInterval(interval);
        setComplete(true);
      }
    }, 36);
    return () => window.clearInterval(interval);
  }, [started, text]);

  return (
    <Tag
      id={id}
      className={`${className ?? ''} ${styles.typewriterHeading} ${complete ? styles.typewriterDone : ''}`}
      data-full-text={text}
      aria-label={text}
      {...rest}
    >
      {typed || text.slice(0, 1)}
    </Tag>
  );
}

export default function AboutPage() {
  const [about, setAbout] = useState<AboutPageContent>(defaultAbout);
  const [activeSection, setActiveSection] = useState('about');
  const [chapter, setChapter] = useState<ChapterKey>('Texas');
  const [carouselIndex, setCarouselIndex] = useState(0);

  const sectionNav = [
    { id: 'about', label: 'About' },
    { id: 'our-journey', label: 'Our Journey' },
    { id: 'who-we-are', label: 'Who We Are' },
    { id: 'our-vision', label: 'Our Vision' },
    { id: 'mission', label: 'Mission' },
    { id: 'leadership', label: 'Leadership' },
    { id: 'outreach', label: 'Outreach' },
  ] as const;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

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
      })
      .catch(() => setAbout(defaultAbout));
  }, []);

  useEffect(() => {
    const sections = sectionNav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-24% 0px -62% 0px', threshold: [0.25, 0.5, 0.8] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const locations = CHAPTERS[chapter];

  return (
    <div className={styles.aboutShell}>
      <main className={styles.contentColumn}>
        <section id="about" className={styles.contentSection}>
          <TypewriterHeading as="h1" id="about-title" className={styles.primaryHeading} text={about.heroTitle} />
          <p className={styles.leadCopy}>
            A divine gathering of women in ministry, organized by Pastor (Mrs.) Folu Adeboye, wife of the
            General Overseer of the Redeemed Christian Church of God.
          </p>
          <div className={styles.heroCard}>
            <img
              src="https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778152795/foe_group_2_q6pcp8.jpg"
              alt="Feast of Esther group"
              className={styles.heroImage}
            />
          </div>
        </section>

        <section id="our-journey" className={styles.contentSection}>
          <div className={styles.panel}>
            <TypewriterHeading as="h2" id="our-journey-title" className={styles.sectionTitle} text="Our Journey" />
            <div className={styles.twoColText}>
              {about.storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className={styles.heroCard + ' ' + styles.inlineImageCard}>
              <img
                src="https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761752/20260219_223539_aetz6w.jpg"
                alt="Our Journey"
                className={styles.heroImage}
              />
            </div>
          </div>
        </section>

        <section id="who-we-are" className={styles.contentSection}>
          <div className={styles.panel}>
            <TypewriterHeading as="h2" id="who-we-are-title" className={styles.sectionTitle} text="Who We Are" />
            <div className={styles.twoColText}>
              <p>
                The Feast of Esther gathers women who are General Overseers or heads of ministries, wives of
                General Overseers, Prelates, Arch Bishops, and Women Leaders across denominations.
              </p>
              <p>
                This sacred gathering creates space for fellowship, prayer, renewal, and growth, empowering
                women to stand in the gap for their churches, ministries, and nations.
              </p>
            </div>
            <div className={styles.heroCard + ' ' + styles.inlineImageCard}>
              <img
                src="https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761661/20250711_200106_dxgplr.jpg"
                alt="Who We Are"
                className={styles.heroImage}
              />
            </div>
          </div>
        </section>

        <section id="our-vision" className={styles.contentSection}>
          <TypewriterHeading as="h2" id="our-vision-title" className={styles.sectionTitle} text="Our Vision" />
          <div className={styles.visionShowcase}>
            <img
              src="https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778153398/foe_logo_mlmi16.jpg"
              alt="Feast of Esther USA logo"
              className={styles.visionLogo}
            />
            <p className={styles.visionLabel}>Who We Are</p>
            <h3 className={styles.visionHeadline}>
              We exist so that women in ministry are raised as pillars in God&apos;s house.
            </h3>
            <div className={styles.visionDivider}>✚</div>
            <div className={styles.visionCards}>
              <article className={styles.visionCard}>
                <h4>Our Beliefs</h4>
                <p>
                  To develop excellent ministry skills in women who are called to support and impact the
                  church of God for nation building.
                </p>
                <button type="button" className={styles.visionBtn}>
                  Learn more
                </button>
              </article>
              <article className={styles.visionCard}>
                <h4>Our Values</h4>
                <p>
                  We empower women in ministry to stand as pillars in the house of God, equipping them for
                  spiritual leadership, ministry skills enhancement, and prophetic intercession training.
                </p>
                <button type="button" className={styles.visionBtn}>
                  Learn more
                </button>
              </article>
            </div>
          </div>
        </section>

        <section id="mission" className={styles.contentSection}>
          <TypewriterHeading as="h2" id="mission-title" className={styles.sectionTitle} text="Mission" />
          <p className={styles.bodyCopy}>To create a forum where female ministry leaders learn to:</p>
          <ul className={styles.arrowList}>
            <li>Accomplish their divine calling in ministry</li>
            <li>Stand in the gap for churches, ministries and nations</li>
            <li>Build purposeful fellowship and spiritual connection</li>
            <li>Catalyze revival through effective church leadership</li>
            <li>Ensure the maximum harvest of souls for the kingdom</li>
          </ul>
        </section>

        <section id="leadership" className={styles.contentSection}>
          <TypewriterHeading as="h2" id="leadership-title" className={styles.sectionTitle} text="Our Leadership" />
          <div className={styles.panel}>
            <div className={styles.leadershipHero}>
              <img
                src={CAROUSEL_IMAGES[carouselIndex]}
                alt="Pastor Mrs. Grace Okonrende"
              />
              <div className={styles.leadershipText}>
                <h3 className={styles.leadershipName}>Pastor Mrs. Grace Okonrende</h3>
                <div className={styles.rolePills}>
                  <span>Country Coordinator Feast of Esther USA</span>
                  <span>Continental Evangelist RCCG America</span>
                </div>
                <p>
                  Pastor Grace Okonrende is a dynamic evangelist, and a Deliverance Minister, herself and her
                  husband, are gifted and experienced marriage counselors. She has been serving the Lord from
                  her youthful days.
                </p>
                <p>
                  She was used by the Lord to pioneer several churches in Nigeria, UK, and was the person used
                  by God to take RCCG to the Republic of Ireland. She started the first RCCG Yoruba/English
                  Church(Apata Irapada) in London, England.
                </p>
                <p>
                  The Lord established RCCG in Sacramento, Oakland, and Stockton, California through Pastor
                  Grace and her husband Pastor Ade. She co-pastors the Pavilion of Redemption in Sugarland,
                  Texas, a Branch of The Redeemed Christian Church of God.
                </p>
                <p>
                  Pastor Grace has been used mightily by God in the area of deliverance in many nations of the
                  world. Several men and women have testified of the goodness of God in their life through her
                  ministry. She was recognized, honored, and awarded the Most Outstanding Female RCCG NA Leader
                  in 2014 by WIM NA.
                </p>
                <p>
                  She was promoted at the 2016 NA Convention as the First Female Regional Evangelist in RCCG
                  World Wide, and she was also a member of the Governing body of RCCG NA. In 2021, she was
                  promoted as the First Female Continental Officer: Evangelism.
                </p>
                <p>
                  Presently, she planted five churches in Colombia between 2022 and 2023. She is presently at
                  Sint Maarten Island, planting a Parish of RCCG. The church started last year 2024. She is
                  happily married to Pastor Ade Okonrende, and they are blessed with four children.
                </p>
              </div>
            </div>
            <div className={styles.carouselDots}>
              {CAROUSEL_IMAGES.map((img, idx) => (
                <button
                  type="button"
                  key={img}
                  aria-label={`View founder image ${idx + 1}`}
                  className={idx === carouselIndex ? styles.dotActive : styles.dot}
                  onClick={() => setCarouselIndex(idx)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="outreach" className={styles.contentSection}>
          <TypewriterHeading as="h2" id="outreach-title" className={styles.sectionTitle} text="Our Chapters" />
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
              <span>{locations.length} Location{locations.length === 1 ? '' : 's'}</span>
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
      </main>

      <aside className={styles.rightRail}>
        <nav className={styles.rightNav}>
          {sectionNav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveSection(item.id)}
              aria-current={activeSection === item.id ? 'location' : undefined}
              className={activeSection === item.id ? styles.activeNavItem : ''}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  );
}
