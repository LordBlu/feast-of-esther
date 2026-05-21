import type { Metadata } from 'next';
import { readCmsData } from '@/lib/cms-store';
import ExecutiveClient from './ExecutiveClient';

export const metadata: Metadata = {
  title: 'Executives | Feast of Esther North America',
  description:
    'Meet the Feast of Esther USA executive committee — leadership roles and responsibilities.',
};

export default async function ExecutivePage() {
  const data = await readCmsData();
  return <ExecutiveClient content={data.executives} />;
}
