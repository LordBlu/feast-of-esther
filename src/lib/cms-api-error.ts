import { NextResponse } from 'next/server';

export function cmsErrorResponse(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  console.error(`[cms] ${fallback}:`, error);
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function readApiErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string };
    if (typeof data.error === 'string' && data.error.trim()) return data.error;
  } catch {
    /* non-JSON body */
  }
  return `${fallback} (HTTP ${response.status})`;
}
