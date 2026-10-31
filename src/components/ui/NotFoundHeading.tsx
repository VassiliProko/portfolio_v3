'use client';

import { useId, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { FooterFluidReveal } from '@/src/components/ui/FooterFluidReveal';

export function NotFoundHeading() {
  const maskId = useId();
  const interactionRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  return (
    <h1
      ref={interactionRef}
      id="not-found-heading"
      className="w-full max-w-[800px] font-sans font-black"
    >
      <span className="sr-only">404</span>
      <svg viewBox="0 0 800 400" className="block w-full" aria-hidden="true">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="400">
            <text
              x="398"
              y="200"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="360"
              letterSpacing="-4"
              fill="white"
            >
              404
            </text>
          </mask>
        </defs>
        <foreignObject x="0" y="0" width="800" height="400" mask={`url(#${maskId})`}>
          <div className="relative h-full w-full">
            <FooterFluidReveal
              src="/images/optimized/home/footer-image.webp"
              interactionRef={interactionRef}
              reducedMotion={reducedMotion !== false}
              SPLAT_RADIUS={1.2}
            />
          </div>
        </foreignObject>
      </svg>
    </h1>
  );
}
