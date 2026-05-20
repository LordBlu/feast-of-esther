import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { isCloudinaryUploadConfigured, uploadImageToCloudinary } from '@/lib/cloudinary-upload';

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9.\-_]/g, '-');
}

function extensionForMime(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    default:
      return '.png';
  }
}

async function saveLocal(buffer: Buffer, mime: string): Promise<string> {
  const extension = extensionForMime(mime);
  const fileName = sanitizeFileName(`${Date.now()}-${crypto.randomUUID()}${extension}`);
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, fileName);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: 'Only JPEG, PNG, WebP, and GIF images are allowed' },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be 8 MB or smaller' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    if (isCloudinaryUploadConfigured()) {
      const url = await uploadImageToCloudinary(buffer, file.type);
      return NextResponse.json({ url, storage: 'cloudinary' });
    }

    const url = await saveLocal(buffer, file.type);
    return NextResponse.json({
      url,
      storage: 'local',
      warning:
        'Saved to /public/uploads (may not persist on Vercel). Set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET for CDN uploads.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
