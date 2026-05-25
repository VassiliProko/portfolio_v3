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
            <div className="absolute left-[7.1%] right-[7.1%] top-[6%] bottom-[5.7%] overflow-hidden rounded-[34px]">
              <video
                className="pointer-events-none absolute top-0 w-[186%] h-auto"
                src="/other/grade_distribution_showcase_short.webm"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Grade Distribution mobile app preview"
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
              <span className="text-text">React Native, Cursor</span>
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
