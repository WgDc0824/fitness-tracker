import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 rounded-lg bg-gray-900 border-2 border-gray-700',
            'text-white placeholder-gray-500',
            'focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500',
            'transition-all duration-200',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface NumberInputProps extends Omit<InputProps, 'type' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, min = 0, max, step = 1, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value) || 0;
            const clampedValue = max !== undefined ? Math.min(newValue, max) : newValue;
            onChange(Math.max(min, clampedValue));
          }}
          min={min}
          max={max}
          step={step}
          className={cn(
            'w-full px-3 py-2 rounded-lg bg-gray-900 border-2 border-gray-700',
            'text-white text-center',
            'focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500',
            'transition-all duration-200',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';