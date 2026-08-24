import type { ReactNode } from 'react';
import Image from 'next/image';
import { CaseStudyCaption } from '@/src/components/ui/CaseStudyCaption';
import {
  CASE_STUDY_MEDIA_INSET_CLASS,
  caseStudyCaptionFigureGapClass,
  resolveCaseStudyCaptionLayout,
  type CaseStudyCaptionLayout,
} from '@/src/constants/caseStudy';
import { JetpacksBrandFamilyFunnel } from '@/src/components/ui/JetpacksBrandFamilyFunnel';
import { cn } from '@/src/utils/cn';

type JetpacksBrandFamilyBoardProps = {
  caption?: ReactNode;
  captionClassName?: string;
  captionLayout?: CaseStudyCaptionLayout;
};

/** General Learning family lockup — always-black board for the Jetpacks case study. */
export function JetpacksBrandFamilyBoard({
  caption,
  captionClassName,
  captionLayout,
}: JetpacksBrandFamilyBoardProps) {
  const layout = resolveCaseStudyCaptionLayout({
    captionClassName,
    captionLayout,
  });

  return (
    <figure
      className={cn(
        'm-0 flex w-full flex-col',
        caption && caseStudyCaptionFigureGapClass(layout)
      )}
    >
      <div
        className="flex w-full flex-col overflow-visible rounded-[8px] bg-jetpacks-board"
        aria-label="General Learning brand family funneling into Jetpacks"
      >
        <div className={cn(CASE_STUDY_MEDIA_INSET_CLASS, 'pb-0')}>
          <Image
            src="/images/optimized/jetpacks/general-learning-brands.svg"
            alt="General Learning wordmark above RevisionDojo, OnePrep, and MathsGenie"
            width={2656}
            height={576}
            className="pointer-events-none h-auto w-full select-none object-contain"
            sizes="(max-width: 768px) 100vw, min(100vw, 1200px)"
          />
        </div>
        <JetpacksBrandFamilyFunnel />
      </div>
      {caption ? (
        <CaseStudyCaption
          caption={caption}
          captionClassName={captionClassName}
          captionLayout={captionLayout}
        />
      ) : null}
    </figure>
  );
}
