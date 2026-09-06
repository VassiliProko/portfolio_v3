const PLANS = [
  {
    label: 'FREE',
    src: '/images/optimized/jetpacks/assets/jetpacks-free.svg',
    alt: 'Jetpacks Free plan illustration',
    panelClassName: 'bg-surface-1 dark:bg-jetpacks-media',
    labelClassName: 'bg-surface-2 text-text-muted dark:bg-surface-dark-2 dark:text-text-inverted-2',
  },
  {
    label: 'PRO',
    src: '/images/optimized/jetpacks/assets/jetpacks-pro.svg',
    alt: 'Jetpacks Pro plan illustration',
    panelClassName:
      'bg-[linear-gradient(105deg,#eff5f6_0%,#eaf5f8_24%,#f2eff9_50%,#e4f3f7_74%,#cde7f2_100%)] dark:bg-[linear-gradient(105deg,#27272a_0%,#282c30_28%,#2d2a32_53%,#293137_76%,#2c3840_100%)]',
    labelClassName: 'bg-[#cfe8ff] text-[#35678f] dark:bg-[#244560] dark:text-[#b9dcf5]',
  },
] as const;

/** Side-by-side Jetpacks Free and Pro plan illustrations. */
export function JetpacksPlanBoard() {
  return (
    <section className="w-full" aria-label="Jetpacks Free and Pro plan illustrations">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
        {PLANS.map((plan) => (
          <div key={plan.label}>
            <div
              className={`relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-[8px] px-lg py-md md:px-xl md:py-lg ${plan.panelClassName}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand assets; keep crisp vectors */}
              <img
                src={plan.src}
                alt={plan.alt}
                width={300}
                height={200}
                className="pointer-events-none h-auto w-full max-w-[300px] select-none object-contain"
                loading="lazy"
                decoding="async"
              />
              <span
                className={`type-label absolute bottom-md left-1/2 inline-flex -translate-x-1/2 rounded-full px-xs py-4xs ${plan.labelClassName}`}
              >
                {plan.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
