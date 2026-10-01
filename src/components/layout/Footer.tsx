'use client';

import { trackEvent } from '@/src/utils/analytics';
import { cn } from '@/src/utils/cn';

const contactLinkClass = cn(
  'font-mono text-base inline-flex items-center justify-center h-12 px-4',
  'bg-footer-contact-bg text-footer-console-text',
  'hover:bg-footer-contact-bg-hover transition-colors duration-micro ease-snap',
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-outline'
);

export function Footer() {
  return (
    <footer className="w-full py-8 md:py-10">
      <div className="flex flex-col items-start gap-3">
        <p className="font-mono text-base text-footer-console-text">Contact me</p>
        <div className="flex h-12 items-start gap-2">
          <a
            href="https://www.linkedin.com/in/vassili-prokopenko"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(contactLinkClass, 'relative z-10 rounded-sm')}
            onClick={() => trackEvent('linkedin_clicked')}
          >
            LinkedIn
          </a>
          <a
            href="mailto:vassiligb12@gmail.com"
            className={cn(contactLinkClass, 'relative z-0 rounded-[48px]')}
            onClick={() => trackEvent('email_clicked')}
          >
            Email Me
          </a>
        </div>
      </div>
    </footer>
  );
}
