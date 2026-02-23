import React from 'react';
import { cn } from '@/src/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'cover' | 'top-image' | 'inset' | 'horizontal';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'bg-card border border-border-base rounded-none transition-all duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)] hover:border-border-hover hover:-translate-y-[1px] active:scale-[0.99]';
  
  const variantStyles = {
    default: 'p-[15px]',
    cover: 'p-0 overflow-hidden',
    'top-image': 'p-0 overflow-hidden',
    inset: 'p-[15px]',
    horizontal: 'p-[15px]',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
