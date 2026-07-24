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
  caption?: string;
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
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes: string;
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
  width = 1920,
  height = 1080,
  priority = false,
  className,
}) => {
  const isRow = Boolean(images && images.length > 0);

  return (
    <figure className={cn('flex w-full flex-col gap-2xs', className)}>
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
        />
      ) : null}
      {caption ? (
        <figcaption className="type-paragraph m-0 text-text-subtle">{caption}</figcaption>
      ) : null}
    </figure>
  );
};
