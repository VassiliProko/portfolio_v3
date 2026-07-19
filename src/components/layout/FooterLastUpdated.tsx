import React from 'react';
import { getLastUpdatedIso } from '@/src/utils/get-last-updated-iso';
import { formatLastUpdated } from '@/src/utils/last-updated';

export const FooterLastUpdated: React.FC = () => {
  return (
    <p className="type-paragraph-mono text-footer-last-updated shrink-0 self-start">
      {formatLastUpdated(getLastUpdatedIso())}
    </p>
  );
};
