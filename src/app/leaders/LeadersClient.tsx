'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

type RegionKey =
  | 'Texas'
  | 'Florida'
  | 'North Carolina'
  | 'Delaware'
  | 'New York / New Jersey'
  | 'Kentucky'
  | 'Maryland'
  | 'Georgia'
  | 'Oregon'
  | 'California'
  | 'The Caribbean';

const DATA: Record<RegionKey, string[]> = {
  Texas: ['Houston', 'Dallas'],
  Florida: ['Miami', 'Tampa'],
  'North Carolina': ['Charlotte', 'Raleigh'],
  Delaware: ['Wilmington'],
  'New York / New Jersey': ['Newark', 'Brooklyn'],
  Kentucky: ['Louisville'],
  Maryland: ['Baltimore'],
  Georgia: ['Atlanta', 'Savannah'],
  Oregon: ['Portland'],
  California: ['Los Angeles', 'Sacramento'],
  'The Caribbean': ['Kingston', 'Nassau'],
};

const ORDER: RegionKey[] = [
  'Texas',
  'Florida',
  'North Carolina',
  'Delaware',
  'New York / New Jersey',
  'Kentucky',
  'Maryland',
  'Georgia',
  'Oregon',
  'California',
  'The Caribbean',
];

const PRIMARY_LEADER = {
  name: 'Pastor Mrs. Grace Okonrende',
  roleA: 'Country Coordinator Feast of Esther USA',
  roleB: 'Continental Evangelist RCCG America',
  image:
    'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790096/205A6045_irlj0v.jpg',
  social: ['Instagram', 'Facebook'],
  funFact: 'Pioneered RCCG missions across Nigeria, UK, Ireland, and North America.',
  bio: [
    'Pastor Grace Okonrende is a dynamic evangelist and deliverance minister. She and her husband are gifted marriage counselors who have served the Lord faithfully over many years.',
    'She was used by God to pioneer churches in Nigeria and the UK, and was instrumental in taking RCCG to the Republic of Ireland. She started the first RCCG Yoruba/English Church in London.',
    'The Lord established RCCG expressions in Sacramento, Oakland, and Stockton through Pastor Grace and her husband. They currently co-pastor in Sugar Land, Texas.',
    'Her ministry has impacted many nations of the world through healing, deliverance, and revival. Many women have testified to the goodness of God in their lives through her ministry.',
    'She was promoted as the first female regional evangelist in RCCG and later as the first female continental evangelist. She and Pastor Ade Okonrende are blessed with children.',
  ],
};

const LEADER_SPOTLIGHTS = [
  {
    name: 'Pastor Martha Emmanuel Kure',
    image: 'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790078/MA3_txk1xd.jpg',
    title: 'Regional Women Leader',
    blurb: 'Empowering women in ministry through discipleship and practical mentorship.',
    funFact: 'Known for mentoring young women leaders across multiple states.',
  },
  {
    name: 'Rev. Mrs Mary Bosede Oluwatunbi',
    image: 'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790070/MA_m27h6y.jpg',
    title: 'Prayer & Intercession Lead',
    blurb: 'Carries a strong burden for revival and altar restoration in women gatherings.',
    funFact: 'Authored ministry devotionals used in women fellowships.',
  },
  {
    name: 'Pastor Olatundun Aminu',
    image: 'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790096/_MG_3358-2_hz4xxv.jpg',
    title: 'Leadership Formation Team',
    blurb: 'Supports curriculum and leadership formation sessions for conference delegates.',
    funFact: 'Coordinates leadership workshops for emerging ministry heads.',
  },
  {
    name: 'Pastor Martha Oluwadare',
    image: 'https://res.cloudinary.com/dytdn0evx/image/upload/q_auto/f_auto/v1777790073/MA1_pgqf35.jpg',
    title: 'Hospitality & Care Team',
    blurb: 'Leads hospitality structures that ensure women feel seen, safe, and supported.',
    funFact: 'Built a chapter-wide volunteer care framework used at annual gatherings.',
  },
] as const;

export default function LeadersClient() {
  const [region, setRegion] = useState<RegionKey>('Texas');
  const cities = DATA[region];
  const countLabel = useMemo(() => `${cities.length} Location${cities.length === 1 ? '' : 's'}`, [cities.length]);
  const sliderViewportRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const [dragLimit, setDragLimit] = useState(0);

  useEffect(() => {
    function measureDrag() {
      const viewport = sliderViewportRef.current;
      const track = sliderTrackRef.current;
      if (!viewport || !track) return;
      const nextLimit = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setDragLimit(nextLimit);
    }

    measureDrag();
    window.addEventListener('resize', measureDrag);
    return () => window.removeEventListener('resize', measureDrag);
  }, [cities.length]);

  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-20 pt-10 md:pt-14">
      <div className="foe-shell space-y-10">
        <section className="space-y-5">
          <div className="text-center">
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-[#7f858c]">Our Chapters</p>
            <h1 className="mt-2 text-[clamp(2.1rem,4.5vw,3.6rem)] text-[#1f1f26]" style={{ fontFamily: 'var(--font-display)' }}>
              Leadership Across Regions
            </h1>
          </div>

          <div ref={sliderViewportRef} className="overflow-hidden rounded-2xl border border-[#e6e7ea] bg-white px-3 py-4 md:px-5">
            <motion.div
              ref={sliderTrackRef}
              drag="x"
              dragConstraints={{ left: -dragLimit, right: 0 }}
              className="flex w-max items-center gap-2.5"
            >
              {ORDER.map((r) => {
                const active = r === region;
                return (
                  <motion.button
                    key={r}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setRegion(r)}
                    className="flex items-center gap-2 rounded-full border px-4 py-2.5 text-[0.96rem] transition"
                    style={{
                      fontFamily: 'var(--font-body)',
                      borderColor: active ? '#1f1f26' : '#dadde1',
                      background: active ? '#1f1f26' : '#fff',
                      color: active ? '#fff' : '#444a52',
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                    {r}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="overflow-hidden rounded-2xl border border-[#e7e8eb] bg-white shadow-[0_12px_30px_rgba(12,18,28,0.06)]">
            <div className="group relative">
              <img
                src={PRIMARY_LEADER.image}
                alt={PRIMARY_LEADER.name}
                className="h-[460px] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-[0.72rem] uppercase tracking-[0.2em] text-white/80">Fun Fact</p>
                <p className="mt-2 text-[1.02rem] leading-relaxed">{PRIMARY_LEADER.funFact}</p>
                <p className="mt-3 text-[0.78rem] uppercase tracking-[0.18em] text-[var(--gold-light)]">
                  {PRIMARY_LEADER.social.join('  ·  ')}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-[#e7e8eb] bg-white p-6 shadow-[0_12px_30px_rgba(12,18,28,0.06)] md:p-8">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#80868d]">Leader Spotlight</p>
            <h2 className="mt-2 text-[clamp(2.05rem,4vw,3rem)] text-[#202229]" style={{ fontFamily: 'var(--font-display)' }}>
              {PRIMARY_LEADER.name}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f2f3f5] px-3 py-1 text-[0.76rem] font-semibold text-[#30353b]">
                {PRIMARY_LEADER.roleA}
              </span>
              <span className="rounded-full bg-[#f2f3f5] px-3 py-1 text-[0.76rem] font-semibold text-[#30353b]">
                {PRIMARY_LEADER.roleB}
              </span>
            </div>

            <div className="mt-5 space-y-3 text-[1.03rem] leading-relaxed text-[#444951]">
              {PRIMARY_LEADER.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[1.9rem] text-[#202229]" style={{ fontFamily: 'var(--font-display)' }}>
              {region}
            </h3>
            <span className="rounded-full bg-white px-3 py-1 text-[0.85rem] text-[#70767c] border border-[#e4e5e8]">{countLabel}</span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {LEADER_SPOTLIGHTS.map((leader) => (
              <article key={leader.name} className="group overflow-hidden rounded-2xl border border-[#e7e8eb] bg-white shadow-[0_10px_26px_rgba(12,18,28,0.05)]">
                <div className="relative">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="h-[290px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/68 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/80">Fun Fact</p>
                    <p className="mt-1 text-[0.94rem] leading-relaxed">{leader.funFact}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#7f858c]">{leader.title}</p>
                  <h4 className="mt-1 text-[1.55rem] text-[#202229]" style={{ fontFamily: 'var(--font-display)' }}>
                    {leader.name}
                  </h4>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-[#4a5057]">{leader.blurb}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#e7e8eb] bg-white p-6">
            <h4 className="text-[1.5rem] text-[#202229]" style={{ fontFamily: 'var(--font-display)' }}>
              Chapter Locations
            </h4>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {cities.map((city) => (
                <span key={city} className="rounded-full border border-[#dfe3e8] bg-[#f9fafb] px-4 py-2 text-[0.95rem] text-[#40464d]">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
