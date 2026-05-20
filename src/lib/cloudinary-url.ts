/**
 * Insert width + limit transform into Cloudinary delivery URLs so the CDN
 * serves smaller bytes for thumbnails and responsive layouts.
 * Non-Cloudinary URLs are returned unchanged.
 */
const UPLOAD_MARKER = '/upload/';
const CLOUD_HOST = 'res.cloudinary.com';

export function cloudinarySizedUrl(url: string, width: number): string {
  const t = url.trim();
  if (!t || !t.includes(CLOUD_HOST) || !t.includes(UPLOAD_MARKER)) return t;
  const parts = t.split(UPLOAD_MARKER);
  if (parts.length < 2) return t;
  const prefix = parts[0];
  const rest = parts.slice(1).join(UPLOAD_MARKER);
  if (/^w_\d+/.test(rest)) return t;
  const w = Math.max(64, Math.min(Math.round(width), 4000));
  return `${prefix}${UPLOAD_MARKER}w_${w},c_limit/${rest}`;
}
