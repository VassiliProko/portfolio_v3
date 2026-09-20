'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import React from 'react';
import { ImagePreview, type ImagePreviewItem } from '@/src/components/ui/ImagePreview';
import { cn } from '@/src/utils/cn';
import styles from './OnePrepOnboardingPreview.module.css';

const SLIDES = [
  {
    key: 'questions',
    src: '/images/optimized/oneprep-onboarding/01-exam-questions.svg',
    alt: 'Grind with 7k+ exam questions',
  },
  {
    key: 'planner',
    src: '/images/optimized/oneprep-onboarding/02-study-planner.svg',
    alt: 'Plan each week with Study Planner',
  },
  {
    key: 'walkthroughs',
    src: '/images/optimized/oneprep-onboarding/03-walkthroughs.svg',
    alt: 'Learn through walkthroughs',
  },
  {
    key: 'analytics',
    src: '/images/optimized/oneprep-onboarding/04-analytics.svg',
    alt: 'Know your weak spots with analytics',
  },
  {
    key: 'tutor',
    src: '/images/optimized/oneprep-onboarding/05-ai-tutor.svg',
    alt: 'Your personal 24/7 AI tutor',
  },
] as const;

const ONEPREP_ONBOARDING_LIGHTBOX: ImagePreviewItem = {
  src: '/images/optimized/oneprep-onboarding/01-exam-questions.svg',
  name: 'OnePrep Product Tour',
  description: 'Pre-onboarding screens for OnePrep mobile',
  alt: 'Animated OnePrep mobile product tour in an iPhone frame',
  width: 16,
  height: 9,
  mediaBackground: 'var(--gradient-usthing-app)',
};

const SLIDE_INTERVAL_MS = 3200;

function FixedOnboardingFooter() {
  return (
    <div className={styles.fixedFooter}>
      <div className={styles.footerIntro}>
        <div className={styles.wordmark}>
          <Image src="/images/optimized/oneprep-onboarding/preppy.svg" alt="" width={42} height={40} />
          <strong>OnePrep</strong>
        </div>
        <p>The #1 Digital SAT Platform. Now<br />with APs and ACTs.</p>
      </div>
      <div className={styles.ctas}>
        <span className={styles.primaryCta}>Sign up for free</span>
        <span className={styles.secondaryCta}>I already have an account</span>
      </div>
    </div>
  );
}

type PhoneCarouselProps = {
  shouldPlay?: boolean;
  className?: string;
  onDragInteraction?: () => void;
};

function PhoneCarousel({ shouldPlay = true, className, onDragInteraction }: PhoneCarouselProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPointerPaused, setIsPointerPaused] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    if (!shouldPlay || prefersReducedMotion || isPointerPaused || isDragging) return;
    const interval = window.setInterval(
      () => setActiveIndex((current) => (current + 1) % SLIDES.length),
      SLIDE_INTERVAL_MS,
    );
    return () => window.clearInterval(interval);
  }, [isDragging, isPointerPaused, prefersReducedMotion, shouldPlay]);

  const showAdjacentSlide = React.useCallback((direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + SLIDES.length) % SLIDES.length);
  }, []);

  const slideTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <motion.div
      className={cn(styles.phone, className)}
      role="img"
      aria-label="Five-screen OnePrep mobile product tour carousel"
      data-dragging={isDragging || undefined}
      onPointerEnter={() => setIsPointerPaused(true)}
      onPointerLeave={() => setIsPointerPaused(false)}
      onPanStart={() => setIsDragging(true)}
      onPanEnd={(_, info) => {
        setIsDragging(false);
        const shouldChangeSlide = Math.abs(info.offset.x) > 28 || Math.abs(info.velocity.x) > 320;
        if (!shouldChangeSlide) return;
        onDragInteraction?.();
        const horizontalIntent = Math.abs(info.offset.x) > 28 ? info.offset.x : info.velocity.x;
        showAdjacentSlide(horizontalIntent < 0 ? 1 : -1);
      }}
    >
      <div className={styles.screen}>
        <div className={styles.slideViewport}>
          <div className={styles.dynamicIslandSafeArea} aria-hidden="true" />
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={SLIDES[activeIndex].key}
              className={styles.slideMotion}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
              transition={slideTransition}
            >
              <div className={styles.figmaSlide}>
                <Image
                  src={SLIDES[activeIndex].src}
                  alt={SLIDES[activeIndex].alt}
                  fill
                  sizes="(max-width: 767px) 220px, 300px"
                  priority={activeIndex === 0}
                  draggable={false}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className={styles.carouselChrome} aria-hidden="true">
          <div className={styles.dotTrack} style={{ '--active-dot-offset': `${activeIndex * 5.09}cqw` } as React.CSSProperties}>
            {SLIDES.map((slide) => <span key={slide.key} className={styles.dot} />)}
            <span className={styles.activeDot} />
          </div>
        </div>
        <FixedOnboardingFooter />
      </div>
      <Image
        src="/images/optimized/Other/iphone_case.webp"
        alt=""
        fill
        className={styles.phoneFrame}
        sizes="(max-width: 767px) 260px, (max-width: 1279px) 300px, 330px"
        draggable={false}
      />
    </motion.div>
  );
}

type OnePrepOnboardingPreviewProps = { onPreviewOpen?: () => void };

export function OnePrepOnboardingPreview({ onPreviewOpen }: OnePrepOnboardingPreviewProps) {
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [triggerFocused, setTriggerFocused] = React.useState(false);
  const suppressNextOpenRef = React.useRef(false);

  const openPreview = () => {
    if (suppressNextOpenRef.current) {
      suppressNextOpenRef.current = false;
      return;
    }
    setPreviewOpen(true);
    onPreviewOpen?.();
  };

  const handleDragInteraction = () => {
    suppressNextOpenRef.current = true;
    window.setTimeout(() => {
      suppressNextOpenRef.current = false;
    }, 250);
  };

  return (
    <>
      <button
        type="button"
        className={cn(styles.trigger, 'cursor-zoom-in focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline')}
        aria-label="Open OnePrep Product Tour preview"
        onClick={openPreview}
        onFocus={() => setTriggerFocused(true)}
        onBlur={() => setTriggerFocused(false)}
      >
        <PhoneCarousel
          shouldPlay={!previewOpen && !triggerFocused}
          onDragInteraction={handleDragInteraction}
        />
      </button>
      <ImagePreview
        item={ONEPREP_ONBOARDING_LIGHTBOX}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        media={<div className={styles.lightboxStage}><PhoneCarousel className={styles.lightboxPhone} /></div>}
      />
    </>
  );
}
