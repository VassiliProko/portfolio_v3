'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/src/utils/cn';

/** Half of CaseStudyLayout children spacing (`gap-4 md:gap-8` → `gap-2 md:gap-4`). */
const CASE_STUDY_MEDIA_GAP_CLASS = 'gap-2 md:gap-4';

export interface CaseStudyImageItem {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface CaseStudyImageProps {
  /**
   * Single image (use with `alt`). Ignored when `images` is provided.
   */
  src?: string;
  alt?: string;
  /**
   * Two or more images in a responsive row (1 col on small viewports, side-by-side from md).
   */
  images?: CaseStudyImageItem[];
  /**
   * Subtitle paragraph under the image(s).
   * Use for a short description of the visual above.
   */
  caption?: React.ReactNode;
  /**
   * Optional label above the caption (same pattern as case study Overview).
   * Rendered with `type-label` + `gap-2xs` before the subtitle.
   */
  captionLabel?: string;
  /** Extra classes for the caption body (e.g. overview two-column measure). */
  captionClassName?: string;
  /**
   * Full-width dark contrast bar (16px) flush under the media.
   * Image + bar share one rounded frame.
   */
  mediaBar?: boolean;
  /** Intrinsic width for a single Next Image (defaults to 1920) */
  width?: number;
  /** Intrinsic height for a single Next Image (defaults to 1080) */
  height?: number;
  priority?: boolean;
  className?: string;
}

function CaseStudyMediaFrame({
  src,
  alt,
  width = 1920,
  height = 1080,
  priority = false,
  sizes,
  mediaBar = false,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes: string;
  mediaBar?: boolean;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-[8px] bg-surface-2">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="block h-auto w-full"
        sizes={sizes}
        priority={priority}
      />
      {mediaBar ? (
        <div className="h-4 w-full bg-surface-dark-2" aria-hidden />
      ) : null}
    </div>
  );
}

/**
 * Case study media block: full-width image (or responsive image row) with an optional
 * subtitle paragraph beneath.
 */
export const CaseStudyImage: React.FC<CaseStudyImageProps> = ({
  src,
  alt = '',
  images,
  caption,
  captionLabel,
  captionClassName,
  mediaBar = false,
  width = 1920,
  height = 1080,
  priority = false,
  className,
}) => {
  const isRow = Boolean(images && images.length > 0);
  const hasCaption = Boolean(caption || captionLabel);

  return (
    <figure
      className={cn(
        'flex w-full flex-col',
        // Labeled captions sit further from the media (overview-like section rhythm).
        captionLabel ? 'gap-md' : 'gap-2xs',
        className
      )}
    >
      {isRow ? (
        <div className={cn('grid grid-cols-1 md:grid-cols-2', CASE_STUDY_MEDIA_GAP_CLASS)}>
          {images!.map((item) => (
            <CaseStudyMediaFrame
              key={item.src}
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              priority={priority}
              sizes="(max-width: 768px) 100vw, min(50vw, 600px)"
            />
          ))}
        </div>
      ) : src ? (
        <CaseStudyMediaFrame
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(max-width: 768px) 100vw, min(100vw, 1200px)"
          mediaBar={mediaBar}
        />
      ) : null}
      {hasCaption ? (
        <figcaption className="flex w-full flex-col gap-2xs">
          {captionLabel ? (
            <p className="type-label m-0 text-text-subtle">{captionLabel}</p>
          ) : null}
          {caption ? (
            <div
              className={cn(
                'type-paragraph m-0 text-text-subtle [&_p]:m-0',
                captionClassName
              )}
            >
              {caption}
            </div>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
};
