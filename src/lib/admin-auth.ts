import { cookies } from 'next/headers';

const sessionCookieName = 'foe-admin-session';

/** True in production runtime — false during `next build` so builds do not require admin env. */
function isProductionRuntime(): boolean {
  return (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PHASE !== 'phase-production-build'
  );
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `${name} must be set in production. Add it in Vercel project settings (Environment Variables).`,
    );
  }
  return value;
}

/** Session token stored in the admin cookie after login. */
export function getAdminSessionToken(): string {
  if (isProductionRuntime()) {
    return requireEnv('ADMIN_DASHBOARD_TOKEN');
  }
  return process.env.ADMIN_DASHBOARD_TOKEN?.trim() || 'foe-dev-admin-token';
}

export function getAdminPassword(): string {
  if (isProductionRuntime()) {
    return requireEnv('ADMIN_DASHBOARD_PASSWORD');
  }
  return process.env.ADMIN_DASHBOARD_PASSWORD?.trim() || 'change-me';
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  return token === getAdminSessionToken();
}

export function getAdminSessionCookieName(): string {
  return sessionCookieName;
}
