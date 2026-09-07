'use client';

import { Alignment } from '@rive-app/react-canvas';
import { CaseStudyCaption } from '@/src/components/ui/CaseStudyCaption';
import { ShowcaseRivePreview } from '@/src/components/ui/ShowcaseRivePreview';

const COURSEWORK_RIVE_ANIMATIONS = [
  {
    src: '/images/optimized/dojo-icons/rive/icon-mini-report.riv',
    label: 'Mini report animation',
  },
  {
    src: '/images/optimized/dojo-icons/rive/icon-full-report.riv',
    label: 'Full report animation',
  },
  {
    src: '/images/optimized/dojo-icons/rive/coursework-unfinished.riv',
    label: 'Incomplete coursework animation',
  },
  {
    src: '/images/optimized/dojo-icons/rive/coursework-finished.riv',
    label: 'Completed coursework animation',
  },
] as const;

export function DojoCourseworkRiveGrid() {
  return (
    <figure className="m-0 flex w-full flex-col gap-4 md:gap-8">
      <div className="grid w-full grid-cols-2 gap-xs md:gap-sm">
        {COURSEWORK_RIVE_ANIMATIONS.map((animation) => (
          <div
            key={animation.src}
            className="aspect-video overflow-hidden rounded-[8px] bg-[var(--color-coursework-grader-showcase-bg)]"
          >
            <ShowcaseRivePreview
              riveSrc={animation.src}
              ariaLabel={animation.label}
              playbackMode="entry-loop"
              riveAlignment={Alignment.Center}
            />
          </div>
        ))}
      </div>
      <CaseStudyCaption
        captionLabel="Coursework Grader"
        caption={
          <p>
            For some app features like the AI-powered Coursework Grader, I developed custom entry
            + loop animations in Rive which are also light/dark mode responsive. Key emphasis was
            put on the PRO exclusive features to improve conversion rate.
          </p>
        }
        captionLayout="section"
      />
    </figure>
  );
}
