'use client';

import { useCallback, useMemo, useState } from 'react';
import styles from './ProgrammeSection.module.css';

type SessionIcon = 'pink' | 'blue' | 'orange' | 'gray';

type ProgrammeSession = {
  time: string;
  title: string;
  icon: SessionIcon;
  details?: string[];
};

type ProgrammeDay = {
  id: string;
  dateDisplay: string;
  cardShort: string;
  title: string;
  sessions: ProgrammeSession[];
};

const PROGRAMME_DAYS: ProgrammeDay[] = [
  {
    id: 'day-1',
    dateDisplay: '18 June 2026',
    cardShort: 'Day 1',
    title: 'Welcome Reception & Opening — Arrival, worship, and fellowship',
    sessions: [
      {
        time: '14:00 – 18:00',
        title: 'Registration & hospitality desk',
        icon: 'gray',
        details: ['Check-in, name badges, conference materials'],
      },
      {
        time: '18:30 – 21:30',
        title: 'Welcome reception',
        icon: 'pink',
        details: ['Opening ceremony', 'Evening worship', 'Fellowship dinner'],
      },
    ],
  },
  {
    id: 'day-2',
    dateDisplay: '19 June 2026',
    cardShort: 'Day 2',
    title: 'Morning plenary & leadership formation — Teaching and workshops',
    sessions: [
      {
        time: '09:00 – 12:30',
        title: 'Morning plenary',
        icon: 'blue',
        details: ['Insightful teachings', 'Corporate worship'],
      },
      {
        time: '14:00 – 17:30',
        title: 'Leadership workshop',
        icon: 'orange',
        details: ['Breakout sessions', 'Prayer & ministry labs'],
      },
      {
        time: '19:00 – 21:00',
        title: 'Evening celebration',
        icon: 'pink',
        details: ['Special guests', 'Testimonies'],
      },
    ],
  },
  {
    id: 'day-3',
    dateDisplay: '20 June 2026',
    cardShort: 'Day 3',
    title: 'Ministry empowerment & send-off — Training, prayer, and commissioning',
    sessions: [
      {
        time: '09:00 – 12:00',
        title: 'Ministry empowerment sessions',
        icon: 'blue',
        details: ['Group activities', 'Equipping talks'],
      },
      {
        time: '14:00 – 16:30',
        title: 'Special prayer & commissioning',
        icon: 'orange',
        details: ['Altar ministry', 'Closing exhortation'],
      },
    ],
  },
];

const DOT_CLASS: Record<SessionIcon, string> = {
  pink: styles.dotPink,
  blue: styles.dotBlue,
  orange: styles.dotOrange,
  gray: styles.dotGray,
};

function cardSubtitle(fullTitle: string): string {
  const parts = fullTitle.split('—');
  return (parts[1] ?? parts[0]).trim();
}

export function ProgrammeSection() {
  const [activeId, setActiveId] = useState(PROGRAMME_DAYS[0].id);

  const activeIndex = useMemo(
    () => PROGRAMME_DAYS.findIndex((d) => d.id === activeId),
    [activeId]
  );

  const activeDay = PROGRAMME_DAYS[activeIndex] ?? PROGRAMME_DAYS[0];

  const goNext = useCallback(() => {
    const next = (activeIndex + 1) % PROGRAMME_DAYS.length;
    setActiveId(PROGRAMME_DAYS[next].id);
  }, [activeIndex]);

  return (
    <section className={styles.programmeSection} aria-labelledby="programme-heading">
      <h2 id="programme-heading" className={styles.mainTitle}>
        Programme
      </h2>

      <div className={styles.dayTabs} role="tablist" aria-label="Conference days">
        {PROGRAMME_DAYS.map((day) => {
          const isActive = day.id === activeId;
          return (
            <button
              key={day.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.dayCard} ${isActive ? styles.active : ''}`}
              onClick={() => setActiveId(day.id)}
            >
              <span className={styles.dateText}>{day.dateDisplay}</span>
              <span className={styles.dayLabel}>{day.cardShort}</span>
              <p className={styles.daySubtitle}>{cardSubtitle(day.title)}</p>
            </button>
          );
        })}
      </div>

      <div className={styles.programmeContentCard} role="tabpanel" aria-live="polite">
        <div className={styles.contentHeader}>
          <div className={styles.headerMain}>
            <span className={styles.currentDate}>{activeDay.dateDisplay}</span>
            <h2 className={styles.dayTitle}>{activeDay.title}</h2>
          </div>
          <button type="button" className={styles.nextBtn} onClick={goNext}>
            Next →
          </button>
        </div>

        <div className={styles.timelineList}>
          {activeDay.sessions.map((session, idx) => (
            <div key={`${session.time}-${session.title}-${idx}`} className={styles.timelineRow}>
              <div className={styles.timeCol}>{session.time}</div>
              <div className={styles.dotInfoRow}>
                <div className={styles.dotCol}>
                  <span className={`${styles.dot} ${DOT_CLASS[session.icon]}`} aria-hidden />
                </div>
                <div className={styles.infoCol}>
                  <h4>{session.title}</h4>
                  {session.details && session.details.length > 0 && (
                    <ul className={styles.detailList}>
                      {session.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
