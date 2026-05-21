'use client';

import SiteImage from '@/components/SiteImage';
import type { ExecutiveProfile, ExecutivesPageContent } from '@/lib/cms-types';
import styles from './ExecutivePage.module.css';

function ResponsibilityList({ items }: { items: string[] }) {
  return (
    <ul className={styles.excoList}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function ExcoCard({ member }: { member: ExecutiveProfile }) {
  return (
    <article className={styles.excoCard} tabIndex={0}>
      <div className={styles.excoSlot}>
        <div className={styles.excoFace}>
          <div className={styles.excoAvatar}>
            <SiteImage
              src={member.imageUrl}
              alt=""
              width={200}
              height={200}
              cloudWidth={400}
            />
          </div>
          <h3 className={styles.excoName}>{member.name}</h3>
          <p className={styles.excoRole}>{member.title}</p>
          {member.subtitle ? <p className={styles.excoSubtitle}>{member.subtitle}</p> : null}
        </div>

        <div className={styles.excoDetail}>
          <h3 className={styles.excoDetailName}>{member.name}</h3>
          <p className={styles.excoDetailRole}>{member.title}</p>
          {member.subtitle ? <p className={styles.excoSubtitle}>{member.subtitle}</p> : null}
          <ResponsibilityList items={member.responsibilities} />
        </div>
      </div>
    </article>
  );
}

export interface ExecutiveClientProps {
  content: ExecutivesPageContent;
}

export default function ExecutiveClient({ content }: ExecutiveClientProps) {
  const chair = content.chairperson;
  const pills = [
    chair.title,
    chair.subtitle,
    ...(content.heroBadges ?? []),
  ].filter(Boolean) as string[];

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="executive-hero-title">
        <div className={styles.heroInner}>
          <header className={styles.heroHeading}>
            <p className={styles.heroEyebrow}>{content.heroEyebrow}</p>
            <h1 id="executive-hero-title" className={styles.heroTitle}>
              {content.heroTitle}
            </h1>
            <div className={styles.heroRule} aria-hidden />
          </header>

          <article className={styles.profileCard}>
            <div className={styles.profileImageWrap}>
              <SiteImage
                src={chair.imageUrl}
                alt={chair.name}
                fill
                sizes="(max-width: 768px) 100vw, 34vw"
                cloudWidth={900}
                priority
              />
            </div>
            <div className={styles.profileBody}>
              <h2 className={styles.profileName}>{chair.name}</h2>
              <div className={styles.pills}>
                {pills.map((label) => (
                  <span key={label} className={styles.pill}>
                    {label}
                  </span>
                ))}
              </div>
              {chair.bioParagraphs?.length ? (
                <div className={styles.profileBio}>
                  {chair.bioParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        </div>
      </section>

      <section className={styles.gridSection} aria-labelledby="executive-grid-title">
        <div className={styles.gridInner}>
          <header className={styles.gridHeader}>
            <h2 id="executive-grid-title" className={styles.gridTitle}>
              {content.gridTitle}
            </h2>
            <p className={styles.gridLead}>{content.gridLead}</p>
          </header>

          <div className={styles.excoGrid} role="list">
            {content.committee.map((member) => (
              <div key={member.id} role="listitem">
                <ExcoCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
