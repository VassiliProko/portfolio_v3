'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { trackEvent } from '@/src/utils/analytics';
import { cn } from '@/src/utils/cn';

const contactLinkClass = cn(
  'font-mono text-base inline-flex items-center justify-center h-12 px-4',
  'bg-footer-contact-bg text-footer-console-text',
  'hover:bg-footer-contact-bg-hover transition-colors duration-micro ease-snap',
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline'
);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  return (
    <footer
      ref={footerRef}
      className="relative left-1/2 mt-8 w-screen -translate-x-1/2 overflow-hidden bg-surface-dark-1 md:mt-10"
    >
      <div className="relative z-10 flex h-2 w-full shrink-0" aria-hidden>
        <div className="flex-[3] bg-surface-dark-1" />
        <div className="flex-[2] bg-surface-dark-2" />
        <div className="flex-[2] bg-primary-base" />
        <div className="flex-[1.5] bg-primary-darker" />
        <div className="flex-[0.75] bg-accent-base" />
        <div className="flex-[1] bg-footer-console-text" />
      </div>
      <div className="relative">
        <motion.div
          className="pointer-events-none absolute -inset-y-4 inset-x-0 bg-[url('/images/optimized/home/footer-image.webp')] bg-cover bg-[center_35%] opacity-25 grayscale will-change-transform"
          style={{ y: prefersReducedMotion ? 0 : imageY }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-black/60" aria-hidden />
        <div className="relative z-10 mx-auto flex w-full max-w-[var(--page-max-width)] items-center justify-start gap-4 px-[var(--page-margin)] pb-6 pt-3 md:pb-8">
          <p className="shrink-0 font-mono text-base text-footer-console-text">say hi</p>
          <div className="flex h-12 items-center gap-2">
            <a
              href="https://www.linkedin.com/in/vassili-prokopenko"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(contactLinkClass, 'relative z-10 rounded-sm')}
              onClick={() => trackEvent('linkedin_clicked')}
            >
              LinkedIn
            </a>
            <a
              href="mailto:vassiligb12@gmail.com"
              className={cn(contactLinkClass, 'relative z-0 rounded-[48px]')}
              onClick={() => trackEvent('email_clicked')}
            >
              Email Me
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
