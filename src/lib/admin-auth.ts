import { cookies } from 'next/headers';

const sessionCookieName = 'foe-admin-session';

export const adminSessionToken =
  process.env.ADMIN_DASHBOARD_TOKEN ?? 'foe-dev-admin-token';

export const adminPassword =
  process.env.ADMIN_DASHBOARD_PASSWORD ?? 'change-me';

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  return token === adminSessionToken;
}

export function getAdminSessionCookieName(): string {
  return sessionCookieName;
}
