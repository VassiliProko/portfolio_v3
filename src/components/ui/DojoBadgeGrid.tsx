import { CaseStudyCaption } from '@/src/components/ui/CaseStudyCaption';

const BADGES = [
  { src: 'badge-add-comment.svg', alt: 'Add comment achievement badge' },
  { src: 'badge-write-post.svg', alt: 'Write post achievement badge' },
  { src: 'badge-download-cheatsheet.svg', alt: 'Download cheatsheet achievement badge' },
  { src: 'badge-download-exam.svg', alt: 'Download exam achievement badge' },
  { src: 'badge-tag-jojo.svg', alt: 'Tag Jojo achievement badge' },
  { src: 'badge-upvote.svg', alt: 'Upvote achievement badge' },
  { src: 'badge-bulk-grader.svg', alt: 'Bulk grader achievement badge' },
  { src: 'badge-cake-day.svg', alt: 'Cake day achievement badge' },
] as const;

const BADGE_ASSET_PATH = '/images/optimized/dojo-icons/badges';

const RANKED_BADGE_FAMILIES = [
  'cheatsheets',
  'exemplars',
  'exercises',
  'flashcards',
  'hours-studied',
  'jojo',
  'lessons',
  'notes',
  'questions',
  'study-tasks-completed',
  'videos',
  'vocab',
] as const;

const BADGE_RANKS = [
  {
    id: 'bronze',
    label: 'BRONZE',
    labelClassName: 'bg-[#d9ad95] text-[#633a28] dark:bg-[#51392f] dark:text-[#e9c3ae]',
  },
  {
    id: 'silver',
    label: 'SILVER',
    labelClassName: 'bg-[#c9c9d0] text-[#45454e] dark:bg-surface-3 dark:text-[#e4e4e7]',
  },
  {
    id: 'gold',
    label: 'GOLD',
    labelClassName: 'bg-[#e7c754] text-[#5c4300] dark:bg-[#514724] dark:text-[#ead88f]',
  },
  {
    id: 'purple',
    label: 'PURPLE',
    labelClassName: 'bg-[#d5b6ee] text-[#4a2468] dark:bg-[#44344f] dark:text-[#d7bde9]',
  },
] as const;

export function DojoBadgeGrid() {
  return (
    <figure className="m-0 flex w-full flex-col gap-4 md:gap-8">
      <div
        className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-[8px] bg-surface-slate"
        aria-label="RevisionDojo achievement badge collection"
      >
        <div className="grid w-[82%] grid-cols-4 gap-[clamp(8px,3.65vw,44px)] sm:w-[74%] md:w-[64.3%]">
          {BADGES.map((badge) => (
            <div key={badge.src} className="aspect-square min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- local SVG artwork remains crisp at every responsive size */}
              <img
                src={`${BADGE_ASSET_PATH}/${badge.src}`}
                alt={badge.alt}
                width={256}
                height={256}
                className="pointer-events-none block h-full w-full select-none object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>

      <CaseStudyCaption
        captionLabel="BADGES"
        caption={
          <p>
            Achievement badges were also refreshed to be consistent with the visual style,
            helping bring a more high quality cohesive, gamified, experience.
          </p>
        }
        captionLayout="compact"
      />
    </figure>
  );
}

export function DojoRankedBadgeGrid() {
  return (
    <section
      className="w-full overflow-hidden rounded-[8px] bg-surface-1 p-xs md:p-sm"
      aria-label="RevisionDojo ranked achievement badge collection"
    >
      <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
        {BADGE_RANKS.map((rank) => (
          <div
            key={rank.id}
            className="flex min-w-0 flex-col gap-sm rounded-[8px] bg-surface-2 p-md pb-lg md:p-lg md:pb-xl"
          >
            <span
              className={`type-label self-center rounded-full px-xs py-4xs ${rank.labelClassName}`}
            >
              {rank.label}
            </span>

            <div className="grid grid-cols-4 gap-2xs md:gap-xs">
              {RANKED_BADGE_FAMILIES.map((family) => (
                <div key={family} className="flex aspect-square min-w-0 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local SVG artwork remains crisp at every responsive size */}
                  <img
                    src={`${BADGE_ASSET_PATH}/badge-${family}-${rank.id}.svg`}
                    alt={`${family.replaceAll('-', ' ')} ${rank.label.toLowerCase()} badge`}
                    width={256}
                    height={256}
                    className="pointer-events-none block h-[90%] w-[90%] max-w-[101px] select-none object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
