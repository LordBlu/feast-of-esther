import { readCmsData } from '@/lib/cms-store';
import HomeClient from '@/app/HomeClient';

export default async function Home() {
  const data = await readCmsData();
  return <HomeClient initialImages={data.images} initialHomeContent={data.pageContent.home ?? {}} />;
}
