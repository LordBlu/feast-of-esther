'use client';

import styles from './GalleryImageGrid.module.css';

type Props = {
  images: string[];
  title: string;
};

export default function GalleryImageGrid({ images, title }: Props) {
  return (
    <div className={styles.gridWrap}>
      <div className={styles.grid}>
        {images.map((imageUrl, idx) => (
          <figure key={`${imageUrl}-${idx}`} className={styles.cell}>
            <img
              src={imageUrl}
              alt={`${title} — photo ${idx + 1}`}
              loading={idx < 4 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
