import type { ReactNode } from 'react';
import Image from 'next/image';
import { CaseStudyCaption } from '@/src/components/ui/CaseStudyCaption';
import {
  caseStudyCaptionFigureGapClass,
  resolveCaseStudyCaptionLayout,
  type CaseStudyCaptionLayout,
} from '@/src/constants/caseStudy';
import { cn } from '@/src/utils/cn';

type JetpacksLogoBoardProps = {
  captionLabel?: string;
  caption?: ReactNode;
  captionClassName?: string;
  captionLayout?: CaseStudyCaptionLayout;
};

/** Theme-aware Jetpacks logo lockup for the case study body. */
export function JetpacksLogoBoard({
  captionLabel,
  caption,
  captionClassName,
  captionLayout,
}: JetpacksLogoBoardProps) {
  const hasCaption = Boolean(caption || captionLabel);
  const layout = resolveCaseStudyCaptionLayout({
    captionLabel,
    captionClassName,
    captionLayout,
  });

  return (
    <figure
      className={cn(
        'm-0 flex w-full flex-col',
        hasCaption && caseStudyCaptionFigureGapClass(layout)
      )}
    >
      <div
        className="flex w-full items-center justify-center overflow-hidden rounded-[8px] bg-surface-1 px-md py-xl dark:bg-jetpacks-media md:px-xl md:py-2xl"
        aria-label="Jetpacks logo"
      >
        <Image
          src="/images/optimized/jetpacks/jetpacks-logo-light-mode.svg"
          alt=""
          width={770}
          height={240}
          className="pointer-events-none h-auto w-full max-w-[420px] select-none object-contain dark:hidden"
          sizes="(max-width: 768px) 80vw, 420px"
          priority={false}
        />
        <Image
          src="/images/optimized/jetpacks/jetpacks-logo-dark-mode.svg"
          alt=""
          width={770}
          height={240}
          className="pointer-events-none hidden h-auto w-full max-w-[420px] select-none object-contain dark:block"
          sizes="(max-width: 768px) 80vw, 420px"
          priority={false}
        />
      </div>
      {hasCaption ? (
        <CaseStudyCaption
          caption={caption}
          captionLabel={captionLabel}
          captionClassName={captionClassName}
          captionLayout={captionLayout}
        />
      ) : null}
    </figure>
  );
}
