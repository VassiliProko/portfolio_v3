import React from 'react';
import { cn } from '@/src/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  className,
  disabled,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-[60ms] ease-[cubic-bezier(0,.9,.1,1)] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-focus-outline disabled:opacity-40 disabled:pointer-events-none';
  
  const variantStyles = {
    primary: 'bg-primary-base text-text hover:bg-primary-darker active:bg-primary-darker active:scale-[0.98]',
    secondary: 'bg-transparent border border-primary-base text-primary-base hover:border-primary-darker hover:text-primary-darker',
    ghost: 'bg-transparent text-primary-base hover:bg-ghost-hover',
  };

  const sizeStyles = {
    sm: `h-[30px] px-5`,
    default: `h-[40px] px-5`,
    lg: `h-[50px] px-6`,
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        'rounded-none',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
