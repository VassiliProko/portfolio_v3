import type { ReactNode } from 'react';
import {
  CASE_STUDY_CAPTION_FOOTER_CLASS,
  type CaseStudyCaptionLayout,
  resolveCaseStudyCaptionLayout,
} from '@/src/constants/caseStudy';
import { cn } from '@/src/utils/cn';

export type CaseStudyCaptionProps = {
  caption?: ReactNode;
  captionLabel?: string;
  captionClassName?: string;
  /** Override auto layout: compact for short lines, section for editorial blocks. */
  captionLayout?: CaseStudyCaptionLayout;
  hasSectionFooter?: boolean;
  className?: string;
  children?: ReactNode;
};

export function CaseStudyCaption({
  caption,
  captionLabel,
  captionClassName,
  captionLayout,
  hasSectionFooter,
  className,
  children,
}: CaseStudyCaptionProps) {
  const layout = resolveCaseStudyCaptionLayout({
    captionLabel,
    captionClassName,
    captionLayout,
    hasSectionFooter,
  });

  return (
    <figcaption
      className={cn(
        'flex w-full flex-col gap-2xs',
        layout === 'section' && CASE_STUDY_CAPTION_FOOTER_CLASS,
        className
      )}
    >
      {captionLabel ? (
        <p className="type-label m-0 text-text-subtle">{captionLabel}</p>
      ) : null}
      {caption ? (
        <div
          className={cn(
            'type-paragraph m-0 text-text [&_p]:m-0',
            captionClassName
          )}
        >
          {caption}
        </div>
      ) : null}
      {children}
    </figcaption>
  );
}

export { resolveCaseStudyCaptionLayout, caseStudyCaptionFigureGapClass } from '@/src/constants/caseStudy';
