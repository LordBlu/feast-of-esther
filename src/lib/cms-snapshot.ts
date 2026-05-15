import type { CmsData } from '@/lib/cms-types';

/** Site content editable in admin — registrations stay live on restore. */
export type CmsContentSnapshot = Omit<CmsData, 'registrations'>;

export function toContentSnapshot(data: CmsData): CmsContentSnapshot {
  const { registrations: _ignored, ...snapshot } = data;
  return JSON.parse(JSON.stringify(snapshot)) as CmsContentSnapshot;
}

export function applyContentSnapshot(current: CmsData, snapshot: CmsContentSnapshot): CmsData {
  return {
    ...current,
    ...JSON.parse(JSON.stringify(snapshot)),
    registrations: current.registrations,
  };
}
