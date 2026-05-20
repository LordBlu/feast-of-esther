'use client';

import type { CSSProperties } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cloudinarySizedUrl } from '@/lib/cloudinary-url';

export type SiteImageProps = Omit<ImageProps, 'src'> & {
  src: string;
  /** Max width hint for Cloudinary `w_*,c_limit` (ignored for non-Cloudinary URLs). */
  cloudWidth?: number;
};

function isOptimizableUrl(src: string): boolean {
  return (
    src.includes('res.cloudinary.com/dytdn0evx') &&
    src.includes('/image/upload/') &&
    !src.startsWith('//')
  );
}

function isLocalPublicImage(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//');
}

/**
 * Uses `next/image` for our Cloudinary account and same-origin `/…` assets;
 * falls back to `<img>` for arbitrary external URLs (not in `remotePatterns`).
 */
export default function SiteImage({
  src,
  cloudWidth = 1200,
  alt = '',
  fill,
  width,
  height,
  className,
  style,
  priority,
  sizes,
  onLoad,
  draggable,
}: SiteImageProps) {
  const trimmed = src.trim();
  if (!trimmed) return null;

  if (isOptimizableUrl(trimmed) || isLocalPublicImage(trimmed)) {
    const optimized = isOptimizableUrl(trimmed) ? cloudinarySizedUrl(trimmed, cloudWidth) : trimmed;
    return (
      <Image
        src={optimized}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        style={style}
        priority={priority}
        sizes={sizes}
        onLoad={onLoad}
        draggable={draggable}
      />
    );
  }

  const imgStyle: CSSProperties = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...(style ?? {}),
      }
    : { ...(style ?? {}) };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={trimmed}
      alt={alt}
      className={className}
      style={imgStyle}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={onLoad}
      draggable={draggable}
      width={width}
      height={height}
    />
  );
}
