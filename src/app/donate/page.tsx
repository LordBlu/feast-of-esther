import DonateClient from './DonateClient';
import { readCmsData } from '@/lib/cms-store';

export default async function DonatePage() {
  const data = await readCmsData();
  return <DonateClient page={data.pageContent.donate} />;
}
