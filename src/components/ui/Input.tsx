import React, { forwardRef } from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
  {
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconClick,
    className = '',
    id,
    ...props
  },
  ref) =>
  {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="w-full">
        {label &&
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground mb-1.5">

            {label}
          </label>
        }
        <div className="relative">
          {leftIcon &&
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          }
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full h-10 px-3 py-2 text-sm
              bg-background border border-input rounded-lg
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
              disabled:cursor-not-allowed disabled:opacity-50
              transition-all duration-200
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error ? 'border-destructive focus:ring-destructive' : ''}
              ${className}
            `}
            {...props} />

          {rightIcon &&
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">

              {rightIcon}
            </button>
          }
        </div>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>);

  }
);
Input.displayName = 'Input';