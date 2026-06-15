import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: 'orange' | 'green' | 'blue' | 'red';
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, showLabel = false, color = 'orange', ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && (
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">进度</span>
            <span className="text-sm font-semibold text-white">{Math.round(percentage)}%</span>
          </div>
        )}
        <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              {
                'bg-gradient-to-r from-orange-600 to-orange-400': color === 'orange',
                'bg-gradient-to-r from-green-600 to-green-400': color === 'green',
                'bg-gradient-to-r from-blue-600 to-blue-400': color === 'blue',
                'bg-gradient-to-r from-red-600 to-red-400': color === 'red'
              }
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';