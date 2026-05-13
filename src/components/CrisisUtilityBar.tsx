import Link from 'next/link';
import styles from './CrisisUtilityBar.module.css';

export default function CrisisUtilityBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <p className={styles.crisis}>
          <strong>In crisis?</strong> Call or text{' '}
          <a href="tel:988">988</a> — the Suicide &amp; Crisis Lifeline (24/7, free, confidential).
        </p>
        <nav className={styles.links} aria-label="Quick links">
          <Link href="/contact">Contact</Link>
          <Link href="/donate">Holiday Giving</Link>
        </nav>
      </div>
    </div>
  );
}
