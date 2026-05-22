import 'server-only';

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dataDirectory = path.join(process.cwd(), 'data');

export const CMS_DATA_LOCAL_PATH = path.join(dataDirectory, 'cms-data.json');
export const CMS_HISTORY_LOCAL_PATH = path.join(dataDirectory, 'cms-history.json');

const BLOB_CMS_PATH = 'feast-of-esther/cms-data.json';
const BLOB_HISTORY_PATH = 'feast-of-esther/cms-history.json';

export type CmsStorageMode = 'blob' | 'filesystem';

export function getCmsStorageMode(): CmsStorageMode {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() ? 'blob' : 'filesystem';
}

export function isVercelRuntime(): boolean {
  return process.env.VERCEL === '1';
}

/** Throws a clear error when production Vercel has no writable CMS backend. */
export function assertCmsWritable(): void {
  if (isVercelRuntime() && getCmsStorageMode() !== 'blob') {
    throw new Error(
      'Admin saves cannot be stored on Vercel without Blob storage. In the Vercel dashboard: Storage → Create Blob Store → Connect to feast-of-esther (this adds BLOB_READ_WRITE_TOKEN). Redeploy, then try Save again.',
    );
  }
}

async function readLocalFile(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, 'utf8');
  } catch {
    return null;
  }
}

async function writeLocalFile(filePath: string, content: string): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(filePath, content, 'utf8');
}

async function readBlobText(blobPathname: string): Promise<string | null> {
  const { get } = await import('@vercel/blob');
  try {
    const result = await get(blobPathname, { access: 'private' });
    if (result.statusCode !== 200 || !result.stream) return null;
    return await new Response(result.stream).text();
  } catch {
    return null;
  }
}

async function writeBlobText(blobPathname: string, content: string): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured.');
  }

  const { put } = await import('@vercel/blob');
  await put(blobPathname, content, {
    access: 'private',
    allowOverwrite: true,
    contentType: 'application/json',
    token,
  });
}

export async function readCmsDataRaw(): Promise<string> {
  if (getCmsStorageMode() === 'blob') {
    const fromBlob = await readBlobText(BLOB_CMS_PATH);
    if (fromBlob) return fromBlob;
  }

  const fromDisk = await readLocalFile(CMS_DATA_LOCAL_PATH);
  if (fromDisk) return fromDisk;

  throw new Error('CMS data file is missing. Restore data/cms-data.json or seed Blob storage.');
}

export async function writeCmsDataRaw(content: string): Promise<void> {
  assertCmsWritable();

  if (getCmsStorageMode() === 'blob') {
    await writeBlobText(BLOB_CMS_PATH, content);
    return;
  }

  await writeLocalFile(CMS_DATA_LOCAL_PATH, content);
}

export async function readCmsHistoryRaw(): Promise<string | null> {
  if (getCmsStorageMode() === 'blob') {
    const fromBlob = await readBlobText(BLOB_HISTORY_PATH);
    if (fromBlob) return fromBlob;
  }
  return readLocalFile(CMS_HISTORY_LOCAL_PATH);
}

export async function writeCmsHistoryRaw(content: string): Promise<void> {
  assertCmsWritable();

  if (getCmsStorageMode() === 'blob') {
    await writeBlobText(BLOB_HISTORY_PATH, content);
    return;
  }

  await writeLocalFile(CMS_HISTORY_LOCAL_PATH, content);
}

export async function ensureCmsDataFileExists(defaultJson: string): Promise<void> {
  if (getCmsStorageMode() === 'blob') {
    const fromBlob = await readBlobText(BLOB_CMS_PATH);
    if (fromBlob) return;
    const fromDisk = await readLocalFile(CMS_DATA_LOCAL_PATH);
    await writeBlobText(BLOB_CMS_PATH, fromDisk ?? defaultJson);
    return;
  }

  const fromDisk = await readLocalFile(CMS_DATA_LOCAL_PATH);
  if (fromDisk) return;

  await writeLocalFile(CMS_DATA_LOCAL_PATH, defaultJson);
}

export function isCmsWritable(): boolean {
  return getCmsStorageMode() === 'blob' || !isVercelRuntime();
}
