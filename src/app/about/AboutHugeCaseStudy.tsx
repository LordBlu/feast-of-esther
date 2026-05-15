'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styles from './AboutHugeCaseStudy.module.css';
import type { About2PageContent, AboutPageContent, LeadershipProfile } from '@/lib/cms-types';
import { CHAPTERS, type ChapterKey } from '@/lib/about-chapters';

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

const VISUALS: Record<SectionId, string> = {
  about: 'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778152795/foe_group_2_q6pcp8.jpg',
  'our-journey':
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761752/20260219_223539_aetz6w.jpg',
  'who-we-are':
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761661/20250711_200106_dxgplr.jpg',
  'our-vision':
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1778153398/foe_logo_mlmi16.jpg',
  mission:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761505/20250221_200317_el9dzk.jpg',
  leadership:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777761734/20260219_131617_ocrby8.jpg',
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

const FOCUS_ITEMS = [
  'Women in senior ministry and leadership across denominations.',
  'Fellowship, prayer, renewal, and equipping for kingdom impact.',
  'A sacred annual gathering rooted in Scripture and calling.',
];

function sectionImagesFromAbout2(about2: About2PageContent): Record<SectionId, string> {
  return {
    about: about2.visualAbout?.trim() || VISUALS.about,
    'our-journey': about2.visualOurJourney?.trim() || VISUALS['our-journey'],
    'who-we-are': about2.visualWhoWeAre?.trim() || VISUALS['who-we-are'],
    'our-vision': about2.visualOurVision?.trim() || VISUALS['our-vision'],
    mission: about2.visualMission?.trim() || VISUALS.mission,
    leadership: about2.visualLeadership?.trim() || VISUALS.leadership,
    outreach: about2.visualOutreach?.trim() || VISUALS.outreach,
  };
}

function VisualStack({
  activeSection,
  sectionImages,
  leadershipImage,
}: {
  activeSection: SectionId;
  sectionImages: Record<SectionId, string>;
  leadershipImage: string;
}) {
  return (
    <div className={styles.visualStack}>
      {SECTION_IDS.map((id) => {
        const src = id === 'leadership' ? leadershipImage : sectionImages[id];
        return (
          <figure key={id} className={`${styles.visualLayer} ${activeSection === id ? styles.active : ''}`}>
            <img src={src} alt="" role="presentation" decoding="async" />
          </figure>
        );
      })}
    </div>
  );
}

function LeaderBlurb({ text }: { text: string }) {
  const parts = text.split(/\n\n+/).filter(Boolean);
  if (!parts.length) return null;
  return (
    <>
      {parts.map((paragraph) => (
        <p key={paragraph} className={`${styles.body} ${styles.bodySpaced}`}>
          {paragraph}
        </p>
      ))}
    </>
  );
}

export default function AboutHugeCaseStudy() {
  const [about, setAbout] = useState<AboutPageContent>(defaultAbout);
  const [about2, setAbout2] = useState<About2PageContent>({});
  const [activeSection, setActiveSection] = useState<SectionId>('about');
  const [activeLeaderIndex, setActiveLeaderIndex] = useState(0);
  const [chapter, setChapter] = useState<ChapterKey>('Texas');

  const sectionImages = useMemo(() => sectionImagesFromAbout2(about2), [about2]);

  const leadershipProfiles = useMemo(() => {
    const rows = about.leadershipProfiles?.filter((p) => p.name?.trim());
    return rows?.length ? rows : [];
  }, [about.leadershipProfiles]);

  const featuredLeader = leadershipProfiles[0] ?? null;
  const regionalLeaders = leadershipProfiles.slice(1, 4);

  const leadershipImage = useMemo(() => {
    const profile = leadershipProfiles[activeLeaderIndex];
    const url = profile?.imageUrl?.trim();
    return url || sectionImages.leadership;
  }, [leadershipProfiles, activeLeaderIndex, sectionImages.leadership]);

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
          leadershipProfiles: Array.isArray(data.about.leadershipProfiles)
            ? data.about.leadershipProfiles
            : defaultAbout.leadershipProfiles,
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

  useEffect(() => {
    if (!leadershipProfiles.length) return;
    const blocks = document.querySelectorAll<HTMLElement>('[data-leader-profile]');
    if (!blocks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        const idx = Number(visible[0].target.getAttribute('data-leader-profile'));
        if (!Number.isNaN(idx)) setActiveLeaderIndex(idx);
      },
      { rootMargin: '-28% 0px -48% 0px', threshold: [0.12, 0.35, 0.55] },
    );

    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, [leadershipProfiles]);

  const locations = CHAPTERS[chapter];
  const overviewText = about.storyParagraphs.join(' ');
  const focusItems = [
    about2.focusItem1?.trim() || FOCUS_ITEMS[0],
    about2.focusItem2?.trim() || FOCUS_ITEMS[1],
    about2.focusItem3?.trim() || FOCUS_ITEMS[2],
  ];
  const megaAccent =
    about2.megaAccent?.trim() ||
    '— A global gathering of women in ministry for worship, renewal, and structural impact.';
  const ctaBarText =
    about2.ctaBarText?.trim() ||
    'Feast of Esther 2026 — June 18–20, North America. Reserve your place at the table.';

  return (
    <div className={styles.shell}>
      <div className={styles.railPlaceholder} aria-hidden />
      <aside className={styles.visualRail} aria-hidden>
        <VisualStack
          activeSection={activeSection}
          sectionImages={sectionImages}
          leadershipImage={leadershipImage}
        />
      </aside>

      <div className={styles.mobileVisual} aria-hidden>
        <VisualStack
          activeSection={activeSection}
          sectionImages={sectionImages}
          leadershipImage={leadershipImage}
        />
      </div>

      <div className={styles.mainRail}>
        <div className={styles.scrollBody}>
          <section id="about" className={styles.section}>
            <h1 className={styles.mega}>
              {about.heroTitle} <span className={styles.megaAccent}>{megaAccent}</span>
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
                  This sacred gathering creates space for fellowship, prayer, renewal, and growth—empowering women to
                  stand in the gap for their churches, ministries, and nations.
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
            <p className={styles.sectionLabel}>{about.leadershipEyebrow || 'Leadership'} —</p>
            <h2 className={styles.sectionTitle}>{about.leadershipTitle || 'Our Leadership'}</h2>

            {featuredLeader ? (
              <article data-leader-profile={0} className={styles.leaderBlock}>
                <h3 className={styles.leaderName}>{featuredLeader.name}</h3>
                <div className={styles.pills}>
                  <span>{featuredLeader.role}</span>
                </div>
                <LeaderBlurb text={featuredLeader.blurb?.trim() ?? ''} />
              </article>
            ) : null}

            {regionalLeaders.length > 0 ? (
              <div className={styles.leaderRow} role="list">
                {regionalLeaders.map((profile: LeadershipProfile, idx) => {
                  const profileIndex = idx + 1;
                  const imageUrl = profile.imageUrl?.trim();
                  return (
                    <article
                      key={`${profile.name}-${profileIndex}`}
                      role="listitem"
                      tabIndex={0}
                      data-leader-profile={profileIndex}
                      className={styles.leaderCard}
                      onMouseEnter={() => setActiveLeaderIndex(profileIndex)}
                      onFocus={() => setActiveLeaderIndex(profileIndex)}
                    >
                      <div className={styles.leaderAvatar}>
                        {imageUrl ? (
                          <img src={imageUrl} alt={profile.name} decoding="async" />
                        ) : null}
                      </div>
                      <h3 className={styles.leaderCardName}>{profile.name}</h3>
                      <p className={styles.leaderCardRole}>{profile.role}</p>
                    </article>
                  );
                })}
              </div>
            ) : null}
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
