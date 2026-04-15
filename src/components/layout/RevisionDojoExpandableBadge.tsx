import Image from 'next/image'
import React from 'react'

const RD_HREF = 'https://revisiondojo.com'
const LABEL = 'Incoming designer at RevisionDojo (YC24)'

export function RevisionDojoExpandableBadge() {
  return (
    <a
      href={RD_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full max-w-full rounded-full focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-outline focus-visible:outline-offset-2 md:inline-block md:w-auto"
      aria-label={`${LABEL}. Opens in a new tab.`}
    >
      {/* &lt; md: always expanded, no hover morph (stacked under McGill in hero) */}
      <span className="flex w-full max-w-full flex-row items-center gap-sm rounded-full bg-surface-dark-3 px-2 py-2 md:hidden">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-dark-3">
          <Image
            src="/revision_dojo.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-cover"
            aria-hidden
          />
        </span>
        <span className="min-w-0 flex-1 font-sans text-sm font-medium leading-snug text-text-inverted-1" aria-hidden>
          {LABEL}
        </span>
      </span>

      {/* md+: max-width on flex clips reliably; transitions live in globals (beat * + reduced-motion) */}
      <span
        className={[
          'rd-badge-shell hidden h-11 max-h-11 min-w-0 max-w-[2.75rem] md:inline-flex',
          'items-center overflow-hidden rounded-full bg-surface-dark-3 pl-1 pr-1',
          'group-hover:max-w-[min(26rem,calc(100vw-6rem))] group-hover:pr-3',
          'group-focus-visible:max-w-[min(26rem,calc(100vw-6rem))] group-focus-visible:pr-3',
          'motion-reduce:max-w-[min(26rem,calc(100vw-6rem))] motion-reduce:pr-3 motion-reduce:transition-none',
        ].join(' ')}
      >
        <span className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-dark-3">
          <Image
            src="/revision_dojo.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-cover"
            aria-hidden
          />
        </span>
        <span
          className={[
            'rd-badge-label shrink-0 overflow-hidden pl-2 font-sans text-sm font-medium text-text-inverted-1',
            'whitespace-nowrap opacity-0 select-none',
            'group-hover:opacity-100 group-focus-visible:opacity-100',
            'motion-reduce:opacity-100 motion-reduce:transition-none',
          ].join(' ')}
          aria-hidden
        >
          {LABEL}
        </span>
      </span>
    </a>
  )
}
