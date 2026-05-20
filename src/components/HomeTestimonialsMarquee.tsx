'use client';

import type { HomeTestimonial } from '@/lib/cms-types';
import SiteImage from '@/components/SiteImage';
import styles from './HomeTestimonialsMarquee.module.css';

interface HomeTestimonialsMarqueeProps {
  title?: string;
  items: HomeTestimonial[];
}

export default function HomeTestimonialsMarquee({
  title = 'Voices from the gathering',
  items,
}: HomeTestimonialsMarqueeProps) {
  if (!items.length) return null;

  const loop = [...items, ...items];

  return (
    <section className={styles.section} aria-labelledby="home-testimonials-heading">
      <div className="foe-shell">
        <header className={styles.header}>
          <p className={styles.eyebrow}>Testimonies</p>
          <h2 id="home-testimonials-heading" className={styles.title}>
            {title}
          </h2>
        </header>
      </div>

      <div className={styles.trackWrap}>
        <div className={styles.track} role="list">
          {loop.map((item, index) => (
            <article key={`${item.name}-${index}`} className={styles.card} role="listitem">
              <p className={styles.quote}>{item.quote}</p>
              <div className={styles.author}>
                {item.imageUrl?.trim() ? (
                  <SiteImage
                    src={item.imageUrl.trim()}
                    alt=""
                    width={48}
                    height={48}
                    cloudWidth={96}
                    className={styles.avatar}
                  />
                ) : (
                  <span className={styles.avatarPlaceholder} aria-hidden />
                )}
                <div>
                  <p className={styles.name}>{item.name}</p>
                  {item.role?.trim() ? <p className={styles.role}>{item.role}</p> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
