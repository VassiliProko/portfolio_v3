'use client';

import React, { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { DuckDitherCanvas } from '@/src/components/ui/duckIntro/DuckDitherCanvas';
import { DuckIntroDevPanel } from '@/src/components/ui/duckIntro/DuckIntroDevPanel';
import {
  getDuckIntroDefaultsSnapshot,
  hydrateDuckIntroDefaultsFromStorage,
  persistDuckIntroDefaults,
  subscribeDuckIntroDefaults,
} from '@/src/components/ui/duckIntro/duckIntroDefaultsStore';
import {
  DUCK_INTRO_DISPLAY_PX,
  DUCK_INTRO_PLAYGROUND,
  clampDitherDriftY,
  clampDuckIntroDuration,
  clampPopDurationMs,
  clampPopOpacityFrom,
  clampPopScaleFrom,
  clampPopTranslateY,
  getBuiltInDuckIntroDefaults,
  getDuckIntroEase,
  type DuckIntroDefaults,
} from '@/src/components/ui/duckIntro/duckIntroSettings';

type DuckIntroSplashProps = {
  active: boolean;
  playground?: boolean;
  onComplete: () => void;
};

type IntroPhase = 'idle' | 'entering' | 'dithering' | 'done';

export const DuckIntroSplash: React.FC<DuckIntroSplashProps> = ({
  active,
  playground = DUCK_INTRO_PLAYGROUND,
  onComplete,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const persisted = useSyncExternalStore(
    subscribeDuckIntroDefaults,
    getDuckIntroDefaultsSnapshot,
    getBuiltInDuckIntroDefaults,
  );
  const [draft, setDraft] = useState<DuckIntroDefaults | null>(null);
  const settings = draft ?? persisted;

  const [playToken, setPlayToken] = useState(0);
  const [phase, setPhase] = useState<IntroPhase>('idle');
  const [autoStarted, setAutoStarted] = useState(false);
  const [defaultsSaved, setDefaultsSaved] = useState(false);

  const playing = phase === 'entering' || phase === 'dithering';
  const showDuck = phase !== 'done';
  const popTranslateYPx = DUCK_INTRO_DISPLAY_PX * settings.popTranslateY;
  const ditherDriftYPx = DUCK_INTRO_DISPLAY_PX * settings.ditherDriftY;

  useEffect(() => {
    hydrateDuckIntroDefaultsFromStorage();
  }, []);

  // Production path: start the sequence once without an effect setState cascade.
  if (active && !playground && !autoStarted && prefersReducedMotion !== null) {
    setAutoStarted(true);
    setPlayToken(1);
    setPhase(prefersReducedMotion ? 'dithering' : 'entering');
  }

  const startSequence = useCallback(() => {
    setDefaultsSaved(false);
    setPlayToken((token) => token + 1);

    if (prefersReducedMotion) {
      setPhase('dithering');
      return;
    }

    setPhase('entering');
  }, [prefersReducedMotion]);

  const handlePopComplete = useCallback(() => {
    setPhase((current) => (current === 'entering' ? 'dithering' : current));
  }, []);

  const handleDitherComplete = useCallback(() => {
    setPhase('done');

    if (!playground) {
      onComplete();
    }
  }, [onComplete, playground]);

  const patchDraft = useCallback(
    (patch: Partial<DuckIntroDefaults>) => {
      setDefaultsSaved(false);
      setDraft((current) => ({ ...(current ?? settings), ...patch }));
      if (!playing) {
        setPhase('idle');
      }
    },
    [playing, settings],
  );

  const handleSetDefault = useCallback(() => {
    persistDuckIntroDefaults(settings);
    setDraft(null);
    setDefaultsSaved(true);
  }, [settings]);

  if (!active) {
    return null;
  }

  const popEase = getDuckIntroEase(settings.popEaseId);
  const ditherDriftEase = getDuckIntroEase(settings.ditherDriftEaseId);

  return (
    <div
      className="fixed inset-0 z-[55] bg-background"
      role="presentation"
      aria-hidden={!playground}
    >
      <div
        className="flex h-full w-full items-center justify-center"
        style={playground ? { paddingRight: 'min(100%, 320px)' } : undefined}
      >
        {showDuck && phase === 'idle' ? (
          <DuckDitherCanvas
            effectId={settings.effectId}
            colorModeId={settings.colorModeId}
            durationS={settings.durationS}
            playToken={playToken}
            dithering={false}
          />
        ) : null}

        {showDuck && (phase === 'entering' || phase === 'dithering') ? (
          <motion.div
            key={playToken}
            className="will-change-transform"
            initial={{
              opacity: prefersReducedMotion ? 1 : settings.popOpacityFrom,
              y: prefersReducedMotion ? 0 : popTranslateYPx,
              scale: prefersReducedMotion ? 1 : settings.popScaleFrom,
            }}
            animate={
              phase === 'dithering'
                ? { opacity: 1, y: -ditherDriftYPx, scale: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : phase === 'entering'
                  ? {
                      duration: settings.popDurationMs / 1000,
                      ease: popEase,
                    }
                  : {
                      duration: settings.durationS,
                      ease: ditherDriftEase,
                    }
            }
            onAnimationComplete={() => {
              if (phase === 'entering') {
                handlePopComplete();
              }
            }}
          >
            <DuckDitherCanvas
              effectId={settings.effectId}
              colorModeId={settings.colorModeId}
              durationS={settings.durationS}
              playToken={playToken}
              dithering={phase === 'dithering'}
              onComplete={handleDitherComplete}
            />
          </motion.div>
        ) : null}
      </div>

      {playground ? (
        <DuckIntroDevPanel
          effectId={settings.effectId}
          colorModeId={settings.colorModeId}
          durationS={settings.durationS}
          popDurationMs={settings.popDurationMs}
          popScaleFrom={settings.popScaleFrom}
          popTranslateY={settings.popTranslateY}
          popOpacityFrom={settings.popOpacityFrom}
          popEaseId={settings.popEaseId}
          ditherDriftY={settings.ditherDriftY}
          ditherDriftEaseId={settings.ditherDriftEaseId}
          playing={playing}
          defaultsSaved={defaultsSaved}
          onEffectChange={(next) => patchDraft({ effectId: next })}
          onColorModeChange={(next) => patchDraft({ colorModeId: next })}
          onDurationChange={(next) => patchDraft({ durationS: clampDuckIntroDuration(next) })}
          onPopDurationChange={(next) => patchDraft({ popDurationMs: clampPopDurationMs(next) })}
          onPopScaleFromChange={(next) => patchDraft({ popScaleFrom: clampPopScaleFrom(next) })}
          onPopTranslateYChange={(next) => patchDraft({ popTranslateY: clampPopTranslateY(next) })}
          onPopOpacityFromChange={(next) =>
            patchDraft({ popOpacityFrom: clampPopOpacityFrom(next) })
          }
          onPopEaseChange={(next) => patchDraft({ popEaseId: next })}
          onDitherDriftYChange={(next) => patchDraft({ ditherDriftY: clampDitherDriftY(next) })}
          onDitherDriftEaseChange={(next) => patchDraft({ ditherDriftEaseId: next })}
          onPlay={startSequence}
          onSetDefault={handleSetDefault}
        />
      ) : null}
    </div>
  );
};
