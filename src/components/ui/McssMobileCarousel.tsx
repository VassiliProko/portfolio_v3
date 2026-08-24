'use client';

import React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { cn } from '@/src/utils/cn';

const MOBILE_SCREENSHOTS = [
  { src: '/images/optimized/mcss/mobile_membership.png', alt: 'MCSS mobile membership page' },
  { src: '/images/optimized/mcss/mobile_sponsors.png', alt: 'MCSS mobile sponsors page' },
  { src: '/images/optimized/mcss/mobile_sponsors2.png', alt: 'MCSS mobile sponsor listings page' },
  { src: '/images/optimized/mcss/mobile_events.png', alt: 'MCSS mobile events page' },
  { src: '/images/optimized/mcss/mobile_home.png', alt: 'MCSS mobile homepage' },
  { src: '/images/optimized/mcss/mobile_about.png', alt: 'MCSS mobile about page' },
];

const carouselControlClass = cn(
  'inline-flex h-9 w-9 items-center justify-center rounded-[8px] border-none',
  'bg-surface-dark-2 text-footer-console-text',
  'transition-all duration-micro ease-snap',
  'hover:bg-surface-dark-1 focus-visible:bg-surface-dark-1',
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline',
  'disabled:opacity-40 disabled:pointer-events-none',
  '[&_svg]:shrink-0 [&_svg]:text-footer-console-text'
);

export const McssMobileCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
  });
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const updateScrollButtons = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    updateScrollButtons();
    emblaApi.on('select', updateScrollButtons);
    emblaApi.on('reInit', updateScrollButtons);

    return () => {
      emblaApi.off('select', updateScrollButtons);
      emblaApi.off('reInit', updateScrollButtons);
    };
  }, [emblaApi, updateScrollButtons]);

  return (
    <section
      className="w-full rounded-[8px] bg-surface-2 p-3 dark:bg-surface-dark-2 md:p-5"
      aria-label="MCSS mobile screens carousel"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y gap-3 md:gap-4">
          {MOBILE_SCREENSHOTS.map((item) => (
            <div
              key={item.src}
              className="min-w-0 flex-[0_0_72%] sm:flex-[0_0_52%] md:flex-[0_0_40%] lg:flex-[0_0_32%]"
            >
              <div className="overflow-hidden rounded-[8px] border border-border-base bg-surface-1 dark:border-transparent dark:bg-transparent">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={1290}
                  height={2796}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 640px) 72vw, (max-width: 768px) 52vw, (max-width: 1024px) 40vw, 32vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-surface-dark-1 px-3 py-3 text-footer-console-text">
        <div className="flex items-center justify-between gap-4">
          <p className="type-label text-footer-console-text">Mobile Screenshots</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous mobile screenshot"
              className={carouselControlClass}
            >
              <CaretLeft size={18} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next mobile screenshot"
              className={carouselControlClass}
            >
              <CaretRight size={18} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
