import type { ReactNode } from 'react';
import Image from 'next/image';
import { CaseStudyCaption } from '@/src/components/ui/CaseStudyCaption';
import { cn } from '@/src/utils/cn';

export type McssPhaseSectionProps = {
  title: string;
  body: ReactNode;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  mediaBackground: string;
  mediaFrameClassName?: string;
  captionClassName?: string;
};

export function McssPhaseSection({
  title,
  body,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  mediaBackground,
  mediaFrameClassName,
  captionClassName,
}: McssPhaseSectionProps) {
  return (
    <figure className="grid w-full grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-8">
      <CaseStudyCaption
        captionLabel={title}
        caption={body}
        captionClassName={captionClassName}
        captionLayout="section"
        className="order-2 mb-0 lg:order-1"
      />
      <div
        className="order-1 flex justify-center rounded-[8px] px-5 py-6 md:px-6 md:py-8 lg:order-2"
        style={{ background: mediaBackground }}
      >
        <div
          className={cn(
            'w-full max-w-[220px] overflow-hidden rounded-[8px] border border-border-base bg-surface-1',
            mediaFrameClassName
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className="block h-auto w-full rounded-[8px]"
            sizes="(max-width: 1024px) 55vw, 220px"
          />
        </div>
      </div>
    </figure>
  );
}
