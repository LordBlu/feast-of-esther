import FounderCarousel from '@/components/FounderCarousel';
import FounderHero from '@/components/FounderHero';
import FounderMinistryCards from '@/components/FounderMinistryCards';
import { readCmsData } from '@/lib/cms-store';
import {
  resolveFounderCarouselFromPlaceholders,
  resolveFounderHeroBackground,
  resolveFounderMinistryCards,
} from '@/lib/site-placeholders';

export default async function FounderPage() {
  const data = await readCmsData();
  const founder = data.pageContent.founder;
  const placeholderMap = data.images.placeholderUrls;
  const slides = resolveFounderCarouselFromPlaceholders(
    data.images.founderCarouselUrls,
    placeholderMap,
  );
  const heroBg = resolveFounderHeroBackground(founder, placeholderMap);
  const ministryCards = resolveFounderMinistryCards(founder, placeholderMap);
  const storyP1 =
    founder.storyP1 ??
    "Pastor Mrs Folu Adeboye is the wife of the General Overseer of the Redeemed Christian Church of God (RCCG) Worldwide. She's a mother, a mentor, a teacher and a woman in the ministry. Over the years she has been noted for efficiency, effectiveness, excellency and balancing of roles.";
  const storyP2 =
    founder.storyP2 ??
    "In 1981, Pastor Mrs. Adeboye took up the Children Sunday School with a few teachers. She wrote the Sunday school manual now known as Zeal from 1981–1999. Presently, Teachers' Conferences are hosted annually to give teachers induction and charge them for the task ahead as the work grows stronger daily.";
  const storyP3 =
    founder.storyP3 ??
    "In 1981, Pastor E. A. Adeboye set the pace for the establishment of the formal educational arm of CRM. Mummy G.O., armed with her 15 years of teaching experience, took up the challenge. Today, there are over fifty-eight nursery/primary schools in twenty-three states in Nigeria, over six RCCG secondary schools, one science academy, and the Redeemers University for Nations (RUN). Pastor (Mrs.) Folu Adeboye continues to serve in leadership across these institutions.";

  return (
    <div className="min-h-screen bg-[#faf8fc]">
      <div className="founder-pin-track relative w-full">
        <div className="sticky top-0 z-0 h-screen w-full">
          <FounderHero backgroundSrc={heroBg} />
        </div>
      </div>

      <div className="relative z-10 bg-[#faf8fc]">
        <div className="foe-shell founder-body">
          <div className="founder-page-content">
            <div
              id="founder-story"
              className="founder-story mx-auto mb-0 grid w-full max-w-6xl scroll-mt-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-start"
            >
              <div className="founder-story-copy w-full min-w-0 text-left text-[1.06rem] leading-[1.82] text-[#303845] md:text-[1.08rem]">
                <p>{storyP1}</p>
                <p>{storyP2}</p>
                <p>{storyP3}</p>
              </div>
              <div className="founder-story-media">
                <FounderCarousel urls={slides} />
              </div>
            </div>

            <div className="founder-ministry-zone mx-auto w-full max-w-6xl">
              <FounderMinistryCards cards={ministryCards} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
