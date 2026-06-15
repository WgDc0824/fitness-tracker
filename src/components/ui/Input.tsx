import { InputHTMLAttributes, forwardRef, useState, useEffect } from 'react';
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

interface NumberInputProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, min = 0, max, step = 1, label, error, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState<string>(value === 0 ? '' : String(value));

    useEffect(() => {
      setDisplayValue(value === 0 ? '' : String(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;

      if (raw === '' || raw === '-') {
        setDisplayValue(raw);
        return;
      }

      const normalized = raw.replace(/[^\d.]/g, '');
      const parts = normalized.split('.');
      const sanitized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : normalized;

      setDisplayValue(sanitized);
    };

    const handleBlur = () => {
      if (displayValue === '' || displayValue === '-') {
        onChange(0);
        setDisplayValue('');
        return;
      }

      let num = parseFloat(displayValue);
      if (isNaN(num)) num = 0;
      if (max !== undefined) num = Math.min(num, max);
      num = Math.max(min, num);

      const rounded = step < 1
        ? Math.round(num * 10) / 10
        : Math.round(num);

      onChange(rounded);
      setDisplayValue(rounded === 0 ? '' : String(rounded));
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
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