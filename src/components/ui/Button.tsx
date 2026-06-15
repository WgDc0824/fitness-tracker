import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'rounded-lg font-semibold transition-all duration-200 active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-orange-500/30':
              variant === 'primary',
            'bg-gray-700 text-white hover:bg-gray-600':
              variant === 'secondary',
            'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white':
              variant === 'outline',
            'text-gray-400 hover:text-white hover:bg-gray-800':
              variant === 'ghost'
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg'
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';