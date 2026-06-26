import 'server-only';

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const dataDirectory = path.join(process.cwd(), 'data');

export const CMS_DATA_LOCAL_PATH = path.join(dataDirectory, 'cms-data.json');
export const CMS_HISTORY_LOCAL_PATH = path.join(dataDirectory, 'cms-history.json');

// Paths inside your Cloudflare R2 bucket
const R2_CMS_PATH = 'feast-of-esther/cms-data.json';
const R2_HISTORY_PATH = 'feast-of-esther/cms-history.json';

export type CmsStorageMode = 'r2' | 'filesystem';

// Initialize the Cloudflare R2 S3 Client
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || '';

export function getCmsStorageMode(): CmsStorageMode {
  // If R2 credentials are set up in environment variables, use R2 storage
  return process.env.R2_ACCESS_KEY_ID?.trim() && process.env.R2_SECRET_ACCESS_KEY?.trim() ? 'r2' : 'filesystem';
}

export function isVercelRuntime(): boolean {
  return process.env.VERCEL === '1';
}

/** Throws a clear error when production Vercel has no writable CMS backend. */
export function assertCmsWritable(): void {
  if (isVercelRuntime() && getCmsStorageMode() !== 'r2') {
    throw new Error(
      'Admin saves cannot be stored on Vercel without Cloudflare R2 configured. Please add R2_ACCOUNT_ID, R2_BUCKET_NAME, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY to your Vercel Environment Variables.',
    );
  }
}

async function readLocalFile(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}

async function writeLocalFile(filePath: string, content: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, 'utf8');
}

/* --- Cloudflare R2 Helper Functions --- */

async function readR2Text(key: string): Promise<string | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    const response = await s3Client.send(command);
    return (await response.Body?.transformToString()) || null;
  } catch (error: any) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      return null;
    }
    console.error(`Error reading ${key} from Cloudflare R2:`, error);
    return null;
  }
}

async function writeR2Text(key: string, content: string): Promise<void> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: content,
      ContentType: 'application/json',
    });
    await s3Client.send(command);
  } catch (error) {
    console.error(`Error writing ${key} to Cloudflare R2:`, error);
    throw error;
  }
}

async function r2ObjectExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    return false;
  }
}

/* --- Public Core API Methods --- */

export function isCmsWritable(): boolean {
  if (isVercelRuntime()) {
    return getCmsStorageMode() === 'r2';
  }
  return true;
}

export async function readCmsDataRaw(): Promise<string> {
  if (getCmsStorageMode() === 'r2') {
    const fromR2 = await readR2Text(R2_CMS_PATH);
    if (fromR2) return fromR2;
  }

  const fromDisk = await readLocalFile(CMS_DATA_LOCAL_PATH);
  if (fromDisk) return fromDisk;

  throw new Error('CMS data file is missing. Restore data/cms-data.json or seed R2 storage.');
}

export async function writeCmsDataRaw(content: string): Promise<void> {
  assertCmsWritable();

  if (getCmsStorageMode() === 'r2') {
    await writeR2Text(R2_CMS_PATH, content);
    return;
  }

  await writeLocalFile(CMS_DATA_LOCAL_PATH, content);
}

export async function readCmsHistoryRaw(): Promise<string | null> {
  if (getCmsStorageMode() === 'r2') {
    const fromR2 = await readR2Text(R2_HISTORY_PATH);
    if (fromR2) return fromR2;
  }
  return readLocalFile(CMS_HISTORY_LOCAL_PATH);
}

export async function writeCmsHistoryRaw(content: string): Promise<void> {
  assertCmsWritable();

  if (getCmsStorageMode() === 'r2') {
    await writeR2Text(R2_HISTORY_PATH, content);
    return;
  }

  await writeLocalFile(CMS_HISTORY_LOCAL_PATH, content);
}

export async function ensureCmsDataFileExists(defaultJson: string): Promise<void> {
  if (getCmsStorageMode() === 'r2') {
    if (await r2ObjectExists(R2_CMS_PATH)) return;
    const fromDisk = await readLocalFile(CMS_DATA_LOCAL_PATH);
    await writeR2Text(R2_CMS_PATH, fromDisk ?? defaultJson);
    return;
  }

  const fromDisk = await readLocalFile(CMS_DATA_LOCAL_PATH);
  if (!fromDisk) {
    await writeLocalFile(CMS_DATA_LOCAL_PATH, defaultJson);
  }
}