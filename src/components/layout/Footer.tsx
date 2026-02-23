'use client';

import React, { useEffect, useState } from 'react';

export const Footer: React.FC = () => {
  const [timeAlive, setTimeAlive] = useState(0);

  useEffect(() => {
    // Calculate minutes alive (example: born on Jan 1, 2000)
    const birthDate = new Date('2000-01-01').getTime();
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
    <footer className="w-full bg-surface-dark-1 text-text-inverted-1">
      <div className="max-w-[1200px] mx-auto px-5 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Location */}
          <div className="px-3 py-1.5 rounded-sm bg-primary-darker text-sm font-medium text-text-inverted-1">
            Based in Washington D.C. Area
          </div>

          {/* Right: Time Alive Counter */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-base" aria-hidden />
            <span className="text-sm font-mono">
              alive for {timeAlive.toLocaleString()} min
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
