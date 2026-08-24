'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useReducedMotion } from 'motion/react';
import { PrettifyMinervaChromeToolbar } from '@/src/components/ui/PrettifyMinervaChromeToolbar';
import { CaseStudyCaption } from '@/src/components/ui/CaseStudyCaption';
import {
  CASE_STUDY_EXTERNAL_LINK_CLASS,
  caseStudyCaptionFigureGapClass,
  resolveCaseStudyCaptionLayout,
  type CaseStudyCaptionLayout,
} from '@/src/constants/caseStudy';
import { motion } from '@/src/tokens/motion';
import { cn } from '@/src/utils/cn';

const FADE_MS = 500;
const HOLD_MS = 3500;
const LOOP_PAUSE_MS = 2850;
const FADE_EASE = motion.easing.move;

const LOGIN_OLD_SRC = '/images/optimized/prettify-minerva/minerva-login-old.jpg';
const LOGIN_NEW_SRC = '/images/optimized/prettify-minerva/minerva-login-new.jpg';
const LOGIN_WIDTH = 2400;
const LOGIN_HEIGHT = 1354;

type Layer = 'old' | 'new';

export interface PrettifyMinervaExtensionDemoProps {
  captionLabel?: string;
  caption?: React.ReactNode;
  captionClassName?: string;
  captionLayout?: CaseStudyCaptionLayout;
  footerHref?: string;
  footerLabel?: string;
  className?: string;
}

/**
 * Chrome toolbar + login morph.
 * Incoming layer snaps to opacity 1 underneath; outgoing (top) fades 1 → 0.
 */
export const PrettifyMinervaExtensionDemo: React.FC<PrettifyMinervaExtensionDemoProps> = ({
  captionLabel,
  caption,
  captionClassName,
  captionLayout,
  footerHref,
  footerLabel,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const oldLayerRef = useRef<HTMLDivElement>(null);
  const newLayerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [oldImageReady, setOldImageReady] = useState(false);
  const [newImageReady, setNewImageReady] = useState(false);
  /** Visible result layer for a11y + toolbar (imperative z/opacity during morph). */
  const [visibleLayer, setVisibleLayer] = useState<Layer>('old');
  const imagesReady = oldImageReady && newImageReady;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.28, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cached images can skip `onLoad`; mark ready from the decoded element.
  useEffect(() => {
    const markIfComplete = (
      layer: HTMLDivElement | null,
      setReady: (ready: boolean) => void
    ) => {
      const img = layer?.querySelector('img');
      if (img?.complete && img.naturalWidth > 0) setReady(true);
    };
    markIfComplete(oldLayerRef.current, setOldImageReady);
    markIfComplete(newLayerRef.current, setNewImageReady);
  }, []);

  useEffect(() => {
    const oldEl = oldLayerRef.current;
    const newEl = newLayerRef.current;
    if (!oldEl || !newEl) return;

    const applyLayer = (el: HTMLElement, opacity: number, z: number) => {
      el.style.transition = 'none';
      el.style.opacity = String(opacity);
      el.style.zIndex = String(z);
    };

    const timeouts = new Set<number>();
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timeouts.delete(id);
          resolve();
        }, ms);
        timeouts.add(id);
      });

    if (prefersReducedMotion) {
      applyLayer(oldEl, 0, 1);
      applyLayer(newEl, 1, 2);
      setVisibleLayer('new');
      return;
    }

    if (!inView || !imagesReady) return;

    let cancelled = false;

    const morphTo = async (incoming: Layer) => {
      const outgoing: Layer = incoming === 'new' ? 'old' : 'new';
      const incomingEl = incoming === 'old' ? oldEl : newEl;
      const outgoingEl = outgoing === 'old' ? oldEl : newEl;

      applyLayer(incomingEl, 1, 1);
      applyLayer(outgoingEl, 1, 2);
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
      if (cancelled) return;

      outgoingEl.style.transition = `opacity ${FADE_MS}ms ${FADE_EASE}`;
      void outgoingEl.offsetWidth;
      outgoingEl.style.opacity = '0';
      setVisibleLayer(incoming);
      await sleep(FADE_MS);
      if (cancelled) return;

      applyLayer(incomingEl, 1, 2);
      applyLayer(outgoingEl, 0, 1);
    };

    const run = async () => {
      applyLayer(oldEl, 1, 2);
      applyLayer(newEl, 0, 1);
      setVisibleLayer('old');

      while (!cancelled) {
        await morphTo('new');
        if (cancelled) break;
        await sleep(HOLD_MS);
        if (cancelled) break;
        await morphTo('old');
        if (cancelled) break;
        await sleep(LOOP_PAUSE_MS);
      }
    };

    void run();
    return () => {
      cancelled = true;
      for (const id of timeouts) window.clearTimeout(id);
      timeouts.clear();
    };
  }, [inView, imagesReady, prefersReducedMotion]);

  const hasCaption = Boolean(caption || captionLabel || footerHref);
  const layout = resolveCaseStudyCaptionLayout({
    captionLabel,
    captionClassName,
    captionLayout,
    hasSectionFooter: Boolean(footerHref),
  });

  return (
    <figure
      className={cn(
        'flex w-full flex-col',
        hasCaption && caseStudyCaptionFigureGapClass(layout),
        className
      )}
      aria-label="Prettify Minerva browser extension transforming the Minerva login"
    >
      <div ref={rootRef} className="flex w-full flex-col gap-sm md:gap-md">
        <PrettifyMinervaChromeToolbar showExtension={visibleLayer === 'new'} />

        <div className="relative aspect-[2400/1354] w-full overflow-hidden rounded-[8px] bg-prettify-minerva-flash">
          <div
            ref={oldLayerRef}
            className="absolute inset-0 overflow-hidden"
            style={{ opacity: 1, zIndex: 2 }}
            aria-hidden={visibleLayer !== 'old'}
          >
            <Image
              src={LOGIN_OLD_SRC}
              alt="Minerva login before Prettify"
              width={LOGIN_WIDTH}
              height={LOGIN_HEIGHT}
              className="block h-full w-full object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
              draggable={false}
              onLoad={() => setOldImageReady(true)}
            />
          </div>

          <div
            ref={newLayerRef}
            className="absolute inset-0 overflow-hidden"
            style={{ opacity: 0, zIndex: 1 }}
            aria-hidden={visibleLayer !== 'new'}
          >
            <Image
              src={LOGIN_NEW_SRC}
              alt="Minerva login after Prettify"
              width={LOGIN_WIDTH}
              height={LOGIN_HEIGHT}
              className="block h-full w-full object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
              draggable={false}
              onLoad={() => setNewImageReady(true)}
            />
          </div>
        </div>
      </div>

      {hasCaption ? (
        <CaseStudyCaption
          caption={caption}
          captionLabel={captionLabel}
          captionClassName={captionClassName}
          captionLayout={captionLayout}
          hasSectionFooter={Boolean(footerHref)}
          className={footerHref ? 'gap-sm' : undefined}
        >
          {footerHref && footerLabel ? (
            <a
              href={footerHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(CASE_STUDY_EXTERNAL_LINK_CLASS, 'mt-md md:w-1/2')}
            >
              <span className="min-w-0 truncate">{footerLabel}</span>
              <ArrowUpRight className="size-5 shrink-0" size={20} aria-hidden />
            </a>
          ) : null}
        </CaseStudyCaption>
      ) : null}
    </figure>
  );
};
