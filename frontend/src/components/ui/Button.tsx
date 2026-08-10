import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'quantum';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-scientific focus:outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold shadow-sm',
    secondary: 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800',
    ghost: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60',
    outline: 'border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10',
    danger: 'bg-rose-950/40 text-rose-300 border border-rose-800 hover:bg-rose-900/40',
    quantum: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold shadow-sm',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-xs gap-2',
    lg: 'px-4.5 py-2 text-sm gap-2.5',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
