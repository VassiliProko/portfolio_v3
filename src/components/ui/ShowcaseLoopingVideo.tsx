'use client';

type ShowcaseLoopingVideoProps = {
  src: string;
  className?: string;
  ariaLabel: string;
};

export const ShowcaseLoopingVideo: React.FC<ShowcaseLoopingVideoProps> = ({
  src,
  className,
  ariaLabel,
}) => {
  return (
    <video
      src={src}
      className={className}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-label={ariaLabel}
    />
  );
};
