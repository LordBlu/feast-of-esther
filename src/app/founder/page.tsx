import FounderCarousel from '@/components/FounderCarousel';
import FounderHero from '@/components/FounderHero';
import FounderMinistryCards from '@/components/FounderMinistryCards';
import { resolveFounderCarouselSlides } from '@/lib/founder-carousel-resolve';
import { readCmsData } from '@/lib/cms-store';
import { FOUNDER_HERO_CLOUDINARY } from '@/lib/site-content';

export default async function FounderPage() {
  const data = await readCmsData();
  const slides = resolveFounderCarouselSlides(data.images.founderCarouselUrls);
  const founder = data.pageContent.founder;
  const heroBg = founder.heroBackgroundUrl?.trim() || FOUNDER_HERO_CLOUDINARY;
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
      {/*
        Dockers-style pin: tall scroll track keeps the hero in view (sticky) while the user
        moves through this segment, then the rest of the page scrolls normally.
      */}
      <div className="relative h-[120vh] w-full md:h-[112vh]">
        <div className="sticky top-0 z-0 h-screen w-full">
          <FounderHero backgroundSrc={heroBg} />
        </div>
      </div>

      <div className="relative z-10 bg-[#faf8fc]">
        <div className="foe-shell py-14 md:py-20">
          <div
            id="founder-story"
            className="mx-auto mb-0 grid w-full max-w-6xl scroll-mt-28 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:items-start"
          >
            <div className="mx-auto w-full max-w-3xl text-left text-[1.06rem] leading-[1.82] text-[#303845] md:text-[1.08rem]">
              <div className="space-y-5 md:space-y-6">
                <p>{storyP1}</p>
                <p>{storyP2}</p>
                <p>{storyP3}</p>
              </div>
            </div>
            <div className="flex w-full justify-center lg:justify-end">
              <FounderCarousel urls={slides} />
            </div>
          </div>

          <div className="mx-auto mt-14 mb-[72px] w-full max-w-[1100px] px-[28px] md:mt-16 md:mb-[96px] md:px-[56px] lg:px-[72px]">
            <FounderMinistryCards />
          </div>
        </div>
      </div>
    </div>
  );
}
