import RegistrationClient from './RegistrationClient';
import { readCmsData } from '@/lib/cms-store';

export default async function RegistrationPage() {
  const data = await readCmsData();
  return <RegistrationClient page={data.pageContent.registration} />;
}
