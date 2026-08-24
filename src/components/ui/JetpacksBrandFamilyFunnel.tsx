'use client';

import { useReducedMotion } from 'motion/react';
import { cn } from '@/src/utils/cn';

const VIEW_WIDTH = 1000;
/** Extra headroom above y=0 so pop-in circles are not clipped. */
const VIEW_TOP_PAD = 14;
const VIEW_HEIGHT = 176 + VIEW_TOP_PAD;

/** X centers under each brand lockup (derived from SVG layout at 2656px width). */
const SPOKES = [
  { id: 'revision-dojo', startX: 188 },
  { id: 'oneprep', startX: 500 },
  { id: 'mathsgenie', startX: 822 },
] as const;

const MERGE_X = 500;
/** Y where side spokes finish their curve and join the shared vertical stem. */
const MERGE_Y = 112;
/** Bottom of SVG — dots disappear behind the Jetpacks tag here. */
const END_Y = 170;
/** Vertical drop before each side spoke curves inward. */
const STRAIGHT_TOP = 52;

const LOOP_DURATION_S = 2.8;
/** Cubic ease-in-out on path travel. */
const MOTION_EASING_SPLINE = '0.65 0 0.35 1';

function spokePath(startX: number, isCenter: boolean) {
  if (isCenter) {
    return `M ${startX} 0 L ${startX} ${END_Y}`;
  }

  return `M ${startX} 0 L ${startX} ${STRAIGHT_TOP} C ${startX} ${MERGE_Y - 10} ${MERGE_X} ${STRAIGHT_TOP + 8} ${MERGE_X} ${MERGE_Y} L ${MERGE_X} ${END_Y}`;
}

export function JetpacksBrandFamilyFunnel() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="relative flex w-full flex-col items-center overflow-visible px-6 pb-6 md:px-10 md:pb-10"
      aria-hidden
    >
      <svg
        viewBox={`0 ${-VIEW_TOP_PAD} ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        overflow="visible"
        className="block h-auto w-full max-w-[920px] overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {SPOKES.map((spoke) => {
            const isCenter = spoke.id === 'oneprep';
            const path = spokePath(spoke.startX, isCenter);

            return (
              <path
                key={`line-${spoke.id}`}
                d={path}
                fill="none"
                stroke="var(--color-text-muted)"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </g>
        {!prefersReducedMotion ? (
          <g>
            {SPOKES.map((spoke) => {
              const isCenter = spoke.id === 'oneprep';
              const path = spokePath(spoke.startX, isCenter);

              return (
                <g key={`dot-${spoke.id}`}>
                  <animateMotion
                    dur={`${LOOP_DURATION_S}s`}
                    repeatCount="indefinite"
                    path={path}
                    calcMode="spline"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    keySplines={MOTION_EASING_SPLINE}
                  />
                  <circle r={5} fill="var(--color-primary-base)">
                    <animate
                      attributeName="r"
                      dur={`${LOOP_DURATION_S}s`}
                      repeatCount="indefinite"
                      values="0;7.5;5;5;0"
                      keyTimes="0;0.07;0.14;0.9;1"
                    />
                    <animate
                      attributeName="opacity"
                      dur={`${LOOP_DURATION_S}s`}
                      repeatCount="indefinite"
                      values="1;1;1;1;0"
                      keyTimes="0;0.14;0.88;0.94;1"
                    />
                  </circle>
                </g>
              );
            })}
          </g>
        ) : null}
      </svg>
      <span
        className={cn(
          'relative z-20 -mt-4 inline-flex rounded-full',
          'bg-jetpacks-tag-bg text-jetpacks-tag-text',
          'px-xs py-4xs font-mono font-normal uppercase',
          'text-[length:calc(var(--type-label-size)*1.5)] tracking-[0.08em]'
        )}
      >
        Jetpacks
      </span>
    </div>
  );
}
