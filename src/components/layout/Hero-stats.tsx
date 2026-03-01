'use client';

import React, { useEffect, useState } from 'react';

export const Hero_stat: React.FC = () => {
  const [timeAlive, setTimeAlive] = useState(0);

  useEffect(() => {
    // Calculate minutes alive
    const birthDate = new Date('2006-01-17').getTime();
    const calculateMinutes = () => {
      const now = Date.now();
      const diff = now - birthDate;
      const minutes = Math.floor(diff / (1000 * 60));
      setTimeAlive(minutes);
    };

    calculateMinutes();
    const interval = setInterval(calculateMinutes, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-lg border-none bg-surface-dark-1 text-text-inverted-1">
      <div className="mx-auto px-3 py-3">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Left: Location */}
          <div className="px-2 py-1 rounded-sm bg-primary-darker text-sm font-mono text-text-primary">
            Based in Washington D.C. Area
          </div>

          {/* Right: Time Alive Counter */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-base" aria-hidden />
            <span className="text-sm font-mono mr-2">
              alive for {timeAlive.toLocaleString()} min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
