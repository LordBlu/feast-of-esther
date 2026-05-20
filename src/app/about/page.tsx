import { readCmsData } from '@/lib/cms-store';
import AboutHugeCaseStudy from './AboutHugeCaseStudy';

export default async function AboutPage() {
  const data = await readCmsData();
  return (
    <AboutHugeCaseStudy
      initialAbout={data.about}
      initialAbout2={data.pageContent.about2 ?? {}}
      placeholderUrls={data.images.placeholderUrls}
    />
  );
}
