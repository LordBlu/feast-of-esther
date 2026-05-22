import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import {
  getCmsStorageMode,
  isCmsWritable,
  isVercelRuntime,
} from '@/lib/cms-persistence';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return unauthorized();

  const storage = getCmsStorageMode();
  const vercel = isVercelRuntime();
  const writable = isCmsWritable();

  return NextResponse.json({
    storage,
    vercel,
    writable,
    hint: writable
      ? null
      : 'Connect Vercel Blob storage to this project (Storage → Blob → Connect), then redeploy so BLOB_READ_WRITE_TOKEN is set.',
  });
}
