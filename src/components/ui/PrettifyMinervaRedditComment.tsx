import React from 'react';
import { CaseStudyCaption } from '@/src/components/ui/CaseStudyCaption';
import { caseStudyCaptionFigureGapClass } from '@/src/constants/caseStudy';
import { cn } from '@/src/utils/cn';

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={40}
      height={40}
      viewBox="0 0 58 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M25.9798 31.5133C25.9798 30.1358 24.844 29 23.4665 29C22.089 29 20.9531 30.1358 20.9531 31.5133C20.9531 32.1799 21.2179 32.8192 21.6893 33.2905C22.1606 33.7619 22.7999 34.0267 23.4665 34.0267C24.133 34.0267 24.7723 33.7619 25.2437 33.2905C25.715 32.8192 25.9798 32.1799 25.9798 31.5133ZM34.0515 37.2408C32.964 38.3283 30.644 38.715 29.0006 38.715C27.3573 38.715 25.0373 38.3283 23.9498 37.2408C23.891 37.1779 23.8199 37.1277 23.7409 37.0934C23.6619 37.0591 23.5767 37.0414 23.4906 37.0414C23.4045 37.0414 23.3193 37.0591 23.2403 37.0934C23.1613 37.1277 23.0902 37.1779 23.0315 37.2408C22.9685 37.2996 22.9184 37.3707 22.884 37.4497C22.8497 37.5287 22.832 37.6139 22.832 37.7C22.832 37.7861 22.8497 37.8713 22.884 37.9503C22.9184 38.0293 22.9685 38.1004 23.0315 38.1592C24.7473 39.875 28.034 40.02 29.0006 40.02C29.9673 40.02 33.254 39.875 34.9698 38.1592C35.0327 38.1004 35.0829 38.0293 35.1172 37.9503C35.1515 37.8713 35.1692 37.7861 35.1692 37.7C35.1692 37.6139 35.1515 37.5287 35.1172 37.4497C35.0829 37.3707 35.0327 37.2996 34.9698 37.2408C34.7281 36.9992 34.3173 36.9992 34.0515 37.2408ZM34.5348 29C33.1573 29 32.0215 30.1358 32.0215 31.5133C32.0215 32.8908 33.1573 34.0267 34.5348 34.0267C35.9123 34.0267 37.0481 32.8908 37.0481 31.5133C37.0481 30.1358 35.9365 29 34.5348 29Z"
        fill="currentColor"
      />
      <path
        d="M29.0007 4.83301C15.6607 4.83301 4.83398 15.6597 4.83398 28.9997C4.83398 42.3397 15.6607 53.1663 29.0007 53.1663C42.3407 53.1663 53.1673 42.3397 53.1673 28.9997C53.1673 15.6597 42.3407 4.83301 29.0007 4.83301ZM43.0173 32.2138C43.0657 32.5522 43.0898 32.9147 43.0898 33.2772C43.0898 38.6905 36.7823 43.0888 29.0007 43.0888C21.219 43.0888 14.9115 38.6905 14.9115 33.2772C14.9115 32.9147 14.9357 32.5522 14.984 32.2138C13.7515 31.658 12.9057 30.4255 12.9057 28.9997C12.9021 28.3067 13.1033 27.6281 13.4842 27.0491C13.865 26.4701 14.4085 26.0166 15.0462 25.7455C15.684 25.4744 16.3877 25.3978 17.0688 25.5253C17.75 25.6528 18.3783 25.9787 18.8748 26.4622C21.3157 24.698 24.699 23.5863 28.4448 23.4655L30.2332 15.0313C30.2573 14.8622 30.354 14.7172 30.499 14.6447C30.644 14.548 30.8132 14.5238 30.9823 14.548L36.8307 15.8047C37.029 15.4025 37.3313 15.0607 37.7063 14.8148C38.0813 14.5688 38.5152 14.4277 38.9631 14.406C39.411 14.3843 39.8566 14.4828 40.2536 14.6913C40.6506 14.8999 40.9846 15.2108 41.2209 15.592C41.4571 15.9731 41.5872 16.4105 41.5974 16.8588C41.6077 17.3071 41.4978 17.75 41.2792 18.1416C41.0606 18.5331 40.7412 18.859 40.3542 19.0855C39.9672 19.312 39.5266 19.4309 39.0782 19.4297C37.7248 19.4297 36.6373 18.3663 36.5648 17.0372L31.3207 15.9255L29.7257 23.4655C33.4232 23.5863 36.734 24.7222 39.1507 26.4622C39.5211 26.1084 39.9644 25.8399 40.4495 25.6753C40.9346 25.5108 41.4498 25.4542 41.9591 25.5096C42.4683 25.5649 42.9593 25.7309 43.3977 25.9958C43.8361 26.2608 44.2114 26.6183 44.4972 27.0434C44.7829 27.4686 44.9724 27.951 45.0523 28.457C45.1321 28.963 45.1005 29.4803 44.9595 29.9728C44.8186 30.4652 44.5717 30.921 44.2362 31.3081C43.9008 31.6952 43.4848 32.0043 43.0173 32.2138Z"
        fill="currentColor"
      />
    </svg>
  );
}

export interface PrettifyMinervaRedditCommentProps {
  /** Quote body shown inside the comment card. */
  quote: React.ReactNode;
  /** Attribution label next to the Reddit icon. */
  attribution?: string;
  /** Subtitle under the orange field. */
  subtitle: React.ReactNode;
  className?: string;
}

export const PrettifyMinervaRedditComment: React.FC<PrettifyMinervaRedditCommentProps> = ({
  quote,
  attribution = 'Reddit User',
  subtitle,
  className,
}) => {
  return (
    <figure
      className={cn(
        'flex w-full flex-col text-left',
        caseStudyCaptionFigureGapClass('section'),
        className
      )}
    >
      <div
        className="flex w-full items-center justify-center rounded-[8px] px-6 py-10 md:px-10 md:py-16"
        style={{ background: 'var(--gradient-prettify-minerva-reddit)' }}
      >
        <blockquote
          className={cn(
            'm-0 flex w-full max-w-[min(100%,42ch)] flex-col gap-sm rounded-[8px]',
            'bg-surface-1 p-sm text-left md:gap-md md:p-md'
          )}
        >
          <p className="type-paragraph m-0 text-text">{quote}</p>
          <footer className="flex items-center gap-2xs">
            <RedditIcon className="size-10 shrink-0 text-text" />
            <cite className="type-paragraph not-italic text-text-muted">{attribution}</cite>
          </footer>
        </blockquote>
      </div>
      <CaseStudyCaption caption={subtitle} captionLayout="section" />
    </figure>
  );
};
