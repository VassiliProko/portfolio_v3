import type { Metadata } from 'next';
import Image from 'next/image';
import { CaseStudyHeader } from '@/src/components/layout/CaseStudyHeader';

export const metadata: Metadata = {
  title: 'USThing',
  description:
    'A grade distribution feature demo built for USThing, the student-driven all-in-one app for HKUST.',
};

const USTHING_OVERVIEW = (
  <p>
    Demo of a grade distribution feature shipped for USThing, the student-driven all-in-one
    app for The Hong Kong University of Science and Technology.
  </p>
);

export default function USThingCaseStudyPage() {
  return (
    <article className="min-h-screen bg-background" aria-label="Case study: USThing">
      <CaseStudyHeader title="USThing" backHref="/#work" />

      <div className="w-full max-w-[1200px] mx-auto px-5 pt-6 animate-fade-in-up-fast">
        <section
          className="w-full rounded-[8px] p-3 md:p-5 flex items-center justify-center"
          style={{ background: 'var(--gradient-usthing-app)' }}
        >
          <div className="relative w-[clamp(266px,95vw,302px)]">
            <div className="absolute left-[6.3%] right-[6.3%] top-[5.9%] bottom-[6.1%] overflow-hidden rounded-[36px]">
              <iframe
                className="pointer-events-none absolute -left-[47%] top-0 h-full w-[194%]"
                src="https://www.youtube.com/embed/kAJ7SuiSfWk?autoplay=1&mute=1&playsinline=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&loop=1&playlist=kAJ7SuiSfWk"
                title="USThing grade distribution mobile app preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <Image
              src="/images/optimized/Other/iphone_case.webp"
              alt=""
              width={281}
              height={584}
              className="pointer-events-none select-none h-auto w-full object-contain scale-[.92]"
              sizes="(max-width: 768px) 95vw, 302px"
              priority={false}
            />
          </div>
        </section>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 py-8 md:py-10">
        <section
          className="flex flex-col md:flex-row md:gap-12 lg:gap-16 max-w-none font-sans text-md md:text-lg leading-relaxed"
          aria-labelledby="overview-heading"
        >
          <div className="flex-1 min-w-0">
            <h2 id="overview-heading" className="text-xl md:text-2xl font-bold text-text mb-4">
              Overview
            </h2>
            <div className="text-text-subtle">{USTHING_OVERVIEW}</div>
          </div>
          <div className="flex flex-1 flex-col gap-6 md:gap-8 mt-8 md:mt-0 min-w-0">
            <div className="flex flex-col gap-0">
              <span className="font-bold text-text">Time</span>
              <span className="text-text">Apr 2026</span>
            </div>
            <div className="flex flex-col gap-0">
              <span className="font-bold text-text">Tools</span>
              <span className="text-text">React Native</span>
            </div>
            <div className="flex flex-col gap-0">
              <span className="font-bold text-text">Skills</span>
              <span className="text-text">AI Prototyping</span>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
