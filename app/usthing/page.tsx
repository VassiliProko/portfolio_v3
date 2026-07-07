import type { Metadata } from 'next';
import Image from 'next/image';
import { CaseStudyLayout } from '@/src/components/layout/CaseStudyLayout';

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

const USTHING_HERO = (
  <section
    className="flex w-full items-center justify-center rounded-[8px] p-3 md:p-5"
    style={{ background: 'var(--gradient-usthing-app)' }}
  >
    <div className="relative w-[clamp(266px,95vw,302px)]">
      <div className="absolute bottom-[5.7%] left-[7.1%] right-[7.1%] top-[6%] overflow-hidden rounded-[clamp(10px,9%,26px)]">
        <video
          className="pointer-events-none absolute top-0 h-auto w-[186%]"
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
        className="pointer-events-none h-auto w-full scale-[.92] select-none object-contain"
        sizes="(max-width: 768px) 95vw, 302px"
        priority={false}
      />
    </div>
  </section>
);

export default function USThingCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="USThing"
      subtitle="App Feature"
      hero={USTHING_HERO}
      overview={USTHING_OVERVIEW}
      meta={{
        tools: 'Cursor',
        skills: 'AI Prototyping',
      }}
    />
  );
}
