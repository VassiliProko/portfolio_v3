'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  type Rive,
} from '@rive-app/react-canvas';

const ONEPREP_BACKGROUND_SCALE = 1.12;

type RivePlaybackTarget =
  | { kind: 'stateMachine'; name: string }
  | { kind: 'animation'; name: string };

type ResolvedRivePlayback = {
  target: RivePlaybackTarget;
  artboard?: string;
};

type ShowcaseRivePreviewProps = {
  riveSrc: string;
  backgroundSrc: string;
  backgroundScale?: number;
  ariaLabel: string;
  riveAlignment?: Alignment;
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

  const { RiveComponent } = useRive(
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

  return <RiveComponent className="h-full w-full" />;
};

type ShowcaseRiveProbeProps = {
  riveSrc: string;
  artboard?: string;
  onArtboardNeeded: (artboard: string) => void;
  onResolved: (playback: ResolvedRivePlayback | null) => void;
};

const ShowcaseRiveProbe: React.FC<ShowcaseRiveProbeProps> = ({
  riveSrc,
  artboard,
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

        const target = resolveEntryLoopTarget(rive);

        if (!target) {
          onResolved(null);
          return;
        }

        onResolved({
          target,
          artboard: artboard ?? contentArtboard,
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
          onArtboardNeeded={setProbeArtboard}
          onResolved={setPlayback}
        />
      ) : null}

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
