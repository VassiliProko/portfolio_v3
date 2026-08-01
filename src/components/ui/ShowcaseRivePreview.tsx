'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import {
  Alignment,
  EventType,
  Fit,
  Layout,
  useRive,
  type Event,
  type LoopEvent,
  type Rive,
} from '@rive-app/react-canvas';

const ONEPREP_BACKGROUND_SCALE = 1.12;

type RivePlaybackTarget =
  | { kind: 'stateMachine'; name: string }
  | { kind: 'animation'; name: string };

type ResolvedRivePlayback = {
  target: RivePlaybackTarget;
  artboard?: string;
  /** After the primary animation stops, play this once, then return to entry. */
  followUpAnimation?: string;
  /** Treat a looping follow-up as one-shot (one cycle), then restart entry. */
  followUpOneShot?: boolean;
};

/**
 * `entry-loop` — Entry+Loop / state machines (continuous).
 * `entry-then-loop-once` — Entry → Loop (one cycle) → Entry… repeating.
 */
export type ShowcaseRivePlaybackMode = 'entry-loop' | 'entry-then-loop-once';

type ShowcaseRivePreviewProps = {
  riveSrc: string;
  backgroundSrc?: string;
  backgroundScale?: number;
  ariaLabel: string;
  riveAlignment?: Alignment;
  playbackMode?: ShowcaseRivePlaybackMode;
  className?: string;
};

const pickArtboardWithContent = (rive: Rive) => {
  if (rive.animationNames.length > 0 || rive.stateMachineNames.length > 0) {
    return rive.activeArtboard;
  }

  const artboard = rive.contents?.artboards?.find(
    (board) => board.animations.length > 0 || board.stateMachines.length > 0,
  );

  return artboard?.name;
};

const resolveEntryLoopTarget = (rive: Rive): RivePlaybackTarget | null => {
  const stateMachineNames = rive.stateMachineNames;
  const animationNames = rive.animationNames;

  const entryLoopAnimation = animationNames.find(
    (name) => /entry/i.test(name) && /loop/i.test(name),
  );
  if (entryLoopAnimation) {
    return { kind: 'animation', name: entryLoopAnimation };
  }

  const stateMachine2 = stateMachineNames.find((name) => /state machine 2/i.test(name));
  if (stateMachine2) {
    return { kind: 'stateMachine', name: stateMachine2 };
  }

  const entryLoopStateMachine = stateMachineNames.find(
    (name) => /entry/i.test(name) && /loop/i.test(name),
  );
  if (entryLoopStateMachine) {
    return { kind: 'stateMachine', name: entryLoopStateMachine };
  }

  if (stateMachineNames[0]) {
    return { kind: 'stateMachine', name: stateMachineNames[0] };
  }

  if (animationNames[0]) {
    return { kind: 'animation', name: animationNames[0] };
  }

  return null;
};

const resolveEntryThenLoopOnce = (rive: Rive): ResolvedRivePlayback | null => {
  const animationNames = rive.animationNames;
  const artboard = pickArtboardWithContent(rive);

  const entryAnimation = animationNames.find(
    (name) => /entry/i.test(name) && !/loop/i.test(name),
  );
  const loopAnimation = animationNames.find(
    (name) => /loop/i.test(name) && !/entry/i.test(name),
  );

  if (entryAnimation && loopAnimation) {
    return {
      target: { kind: 'animation', name: entryAnimation },
      artboard,
      followUpAnimation: loopAnimation,
      followUpOneShot: true,
    };
  }

  if (entryAnimation) {
    return {
      target: { kind: 'animation', name: entryAnimation },
      artboard,
    };
  }

  const fallback = resolveEntryLoopTarget(rive);
  if (!fallback) return null;

  return { target: fallback, artboard };
};

const resolvePlayback = (
  rive: Rive,
  mode: ShowcaseRivePlaybackMode,
): ResolvedRivePlayback | null => {
  if (mode === 'entry-then-loop-once') {
    return resolveEntryThenLoopOnce(rive);
  }

  const target = resolveEntryLoopTarget(rive);
  if (!target) return null;

  return {
    target,
    artboard: pickArtboardWithContent(rive),
  };
};

const eventMentionsAnimation = (data: Event['data'], animationName: string) => {
  return (
    data == null ||
    data === animationName ||
    (Array.isArray(data) && data.includes(animationName))
  );
};

type ShowcaseRiveCanvasProps = {
  riveSrc: string;
  playback: ResolvedRivePlayback;
  autoplay: boolean;
  riveAlignment: Alignment;
};

const ShowcaseRiveCanvas: React.FC<ShowcaseRiveCanvasProps> = ({
  riveSrc,
  playback,
  autoplay,
  riveAlignment,
}) => {
  const playbackConfig =
    playback.target.kind === 'stateMachine'
      ? { stateMachines: playback.target.name }
      : { animations: playback.target.name };

  const { RiveComponent, rive } = useRive(
    {
      src: riveSrc,
      artboard: playback.artboard,
      ...playbackConfig,
      autoplay,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: riveAlignment,
      }),
    },
    { shouldResizeCanvasToContainer: true },
  );

  useEffect(() => {
    const followUp = playback.followUpAnimation;
    if (
      !rive ||
      !autoplay ||
      !followUp ||
      playback.target.kind !== 'animation'
    ) {
      return;
    }

    const entryName = playback.target.name;
    const followUpOneShot = Boolean(playback.followUpOneShot);
    let active = true;
    let phase: 'entry' | 'followUp' = 'entry';

    const runSafe = (action: () => void) => {
      queueMicrotask(() => {
        if (!active) return;
        try {
          action();
        } catch {
          // Artboard may already be deleted during viewport/layout remounts.
        }
      });
    };

    const restartEntry = () => {
      if (phase !== 'followUp') return;
      phase = 'entry';
      runSafe(() => {
        rive.stop(followUp);
        rive.play(entryName);
      });
    };

    const handleStop = (event: Event) => {
      if (!active) return;

      if (phase === 'entry' && eventMentionsAnimation(event.data, entryName)) {
        phase = 'followUp';
        runSafe(() => {
          rive.play(followUp);
        });
        return;
      }

      if (phase === 'followUp' && eventMentionsAnimation(event.data, followUp)) {
        // Follow-up was already oneshot in the file — cycle back to entry.
        restartEntry();
      }
    };

    const handleLoop = (event: Event) => {
      if (!active || !followUpOneShot) return;

      const loopEvent = event.data as LoopEvent | undefined;
      if (!loopEvent || typeof loopEvent !== 'object' || !('animation' in loopEvent)) {
        return;
      }

      if (loopEvent.animation !== followUp) return;

      // One full Loop cycle finished — return to Entry and repeat.
      restartEntry();
    };

    rive.on(EventType.Stop, handleStop);
    if (followUpOneShot) {
      rive.on(EventType.Loop, handleLoop);
    }

    return () => {
      active = false;
      rive.off(EventType.Stop, handleStop);
      if (followUpOneShot) {
        rive.off(EventType.Loop, handleLoop);
      }
    };
  }, [rive, autoplay, playback]);

  return <RiveComponent className="h-full w-full" />;
};

type ShowcaseRiveProbeProps = {
  riveSrc: string;
  artboard?: string;
  playbackMode: ShowcaseRivePlaybackMode;
  onArtboardNeeded: (artboard: string) => void;
  onResolved: (playback: ResolvedRivePlayback | null) => void;
};

const ShowcaseRiveProbe: React.FC<ShowcaseRiveProbeProps> = ({
  riveSrc,
  artboard,
  playbackMode,
  onArtboardNeeded,
  onResolved,
}) => {
  const { RiveComponent } = useRive(
    {
      src: riveSrc,
      artboard,
      autoplay: false,
      onRiveReady: (rive) => {
        const contentArtboard = pickArtboardWithContent(rive);

        if (!artboard && contentArtboard) {
          onArtboardNeeded(contentArtboard);
          return;
        }

        const resolved = resolvePlayback(rive, playbackMode);

        if (!resolved) {
          onResolved(null);
          return;
        }

        onResolved({
          ...resolved,
          artboard: artboard ?? resolved.artboard ?? contentArtboard,
        });
      },
    },
    { shouldResizeCanvasToContainer: true },
  );

  return (
    <RiveComponent
      className="pointer-events-none absolute h-px w-px opacity-0"
      aria-hidden
    />
  );
};

export const ShowcaseRivePreview: React.FC<ShowcaseRivePreviewProps> = ({
  riveSrc,
  backgroundSrc,
  backgroundScale = ONEPREP_BACKGROUND_SCALE,
  ariaLabel,
  riveAlignment = Alignment.BottomCenter,
  playbackMode = 'entry-loop',
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [probeArtboard, setProbeArtboard] = useState<string | undefined>(undefined);
  const [playback, setPlayback] = useState<ResolvedRivePlayback | null | undefined>(undefined);

  return (
    <div
      className={['relative h-full w-full overflow-hidden', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
    >
      {playback === undefined ? (
        <ShowcaseRiveProbe
          key={probeArtboard ?? 'initial-artboard'}
          riveSrc={riveSrc}
          artboard={probeArtboard}
          playbackMode={playbackMode}
          onArtboardNeeded={setProbeArtboard}
          onResolved={setPlayback}
        />
      ) : null}

      {backgroundSrc ? (
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <Image
            src={backgroundSrc}
            alt=""
            fill
            className="pointer-events-none select-none object-cover object-center"
            style={{ transform: `scale(${backgroundScale})` }}
            sizes="(max-width: 768px) 100vw, (max-width: 1279px) 50vw, 33vw"
            priority={false}
            aria-hidden
          />
        </div>
      ) : null}

      <div className="absolute inset-0 flex items-end justify-center">
        {playback ? (
          <ShowcaseRiveCanvas
            key={`${playback.artboard ?? 'default'}-${playback.target.kind}-${playback.target.name}`}
            riveSrc={riveSrc}
            playback={playback}
            autoplay={!prefersReducedMotion}
            riveAlignment={riveAlignment}
          />
        ) : null}
      </div>
    </div>
  );
};
