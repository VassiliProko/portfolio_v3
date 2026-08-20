'use client';

import React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Button } from '@/src/components/ui/Button';

const MOBILE_SCREENSHOTS = [
  { src: '/images/optimized/mcss/mobile_membership.png', alt: 'MCSS mobile membership page' },
  { src: '/images/optimized/mcss/mobile_sponsors.png', alt: 'MCSS mobile sponsors page' },
  { src: '/images/optimized/mcss/mobile_sponsors2.png', alt: 'MCSS mobile sponsor listings page' },
  { src: '/images/optimized/mcss/mobile_events.png', alt: 'MCSS mobile events page' },
  { src: '/images/optimized/mcss/mobile_home.png', alt: 'MCSS mobile homepage' },
  { src: '/images/optimized/mcss/mobile_about.png', alt: 'MCSS mobile about page' },
];

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

  const arrowButtonClass = 'h-9 w-9 rounded-[8px] border-none bg-surface-dark-2 p-0 text-text-inverted-1 hover:bg-surface-dark-1 focus-visible:bg-surface-dark-1';

  return (
    <section className="w-full rounded-[8px] bg-surface-2 p-3 md:p-5" aria-label="MCSS mobile screens carousel">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y gap-3 md:gap-4">
          {MOBILE_SCREENSHOTS.map((item) => (
            <div
              key={item.src}
              className="min-w-0 flex-[0_0_72%] sm:flex-[0_0_52%] md:flex-[0_0_40%] lg:flex-[0_0_32%]"
            >
              <div className="overflow-hidden rounded-[8px] border border-border-base bg-surface-1">
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

      <div className="mt-4 rounded-lg bg-surface-dark-1 px-3 py-3 text-text-inverted-1">
        <div className="flex items-center justify-between gap-4">
          <p className="type-label text-text-inverted-1">Mobile Screenshots</p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous mobile screenshot"
              className={arrowButtonClass}
            >
              <CaretLeft size={18} aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next mobile screenshot"
              className={arrowButtonClass}
            >
              <CaretRight size={18} aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
