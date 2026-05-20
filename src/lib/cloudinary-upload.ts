import { createHash } from 'node:crypto';

const DEFAULT_CLOUD_NAME = 'dytdn0evx';

export function isCloudinaryUploadConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_API_KEY?.trim() && process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

function cloudName(): string {
  return process.env.CLOUDINARY_CLOUD_NAME?.trim() || DEFAULT_CLOUD_NAME;
}

/** Upload buffer to Cloudinary (signed). Returns HTTPS delivery URL. */
export async function uploadImageToCloudinary(
  buffer: Buffer,
  mime: string,
): Promise<string> {
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!apiKey || !apiSecret) {
    throw new Error('Cloudinary API credentials are not configured');
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || 'feast-of-esther';

  const signaturePayload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash('sha1').update(signaturePayload).digest('hex');

  const body = new FormData();
  body.append(
    'file',
    new Blob([new Uint8Array(buffer)], { type: mime }),
  );
  body.append('api_key', apiKey);
  body.append('timestamp', String(timestamp));
  body.append('signature', signature);
  body.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName()}/image/upload`,
    { method: 'POST', body },
  );

  const data = (await response.json()) as { secure_url?: string; error?: { message?: string } };
  if (!response.ok) {
    const msg = data.error?.message ?? `Cloudinary upload failed (${response.status})`;
    throw new Error(msg);
  }

  const url = data.secure_url?.trim();
  if (!url) throw new Error('Cloudinary returned no image URL');
  return url;
}
