import { readCmsData } from '@/lib/cms-store';
import ContactClient from './ContactClient';

export default async function ContactPage() {
  const data = await readCmsData();
  return <ContactClient page={data.pageContent.contact} socialLinks={data.socialLinks} />;
}
