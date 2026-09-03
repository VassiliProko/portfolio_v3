'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import { cn } from '@/src/utils/cn';

export type RiveLabFile = {
  src: string;
  name: string;
};

type RiveLabCellProps = {
  file: RiveLabFile;
};

function RiveLabCell({ file }: RiveLabCellProps) {
  const prefersReducedMotion = useReducedMotion();
  const { RiveComponent, rive } = useRive(
    {
      src: file.src,
      autoplay: false,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
    },
    { shouldResizeCanvasToContainer: true },
  );

  useEffect(() => {
    if (!rive || prefersReducedMotion) return;

    const stateMachine = rive.stateMachineNames[0];
    if (stateMachine) {
      rive.play(stateMachine);
      return;
    }

    const animation = rive.animationNames[0];
    if (animation) {
      rive.play(animation);
    }
  }, [rive, prefersReducedMotion]);

  return (
    <article className="flex min-w-0 flex-col gap-2xs border border-border-base bg-surface-1 p-[15px]">
      <div
        className="aspect-square w-full overflow-hidden bg-surface-2"
        aria-label={`${file.name} Rive preview`}
      >
        <RiveComponent className="block h-full w-full [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full" />
      </div>
      <p className="type-label m-0 font-mono text-text-subtle">{file.name}</p>
    </article>
  );
}

type RiveLabGridProps = {
  files: RiveLabFile[];
  className?: string;
};

export function RiveLabGrid({ files, className }: RiveLabGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-[15px]',
        className,
      )}
    >
      {files.map((file) => (
        <RiveLabCell key={file.src} file={file} />
      ))}
    </div>
  );
}
