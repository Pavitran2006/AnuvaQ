import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glow = false,
  title,
  subtitle,
  headerAction,
}) => {
  return (
    <div
      className={clsx(
        'rounded-xl p-5 border transition-all duration-300',
        glow ? 'glass-panel-glow' : 'glass-panel',
        className
      )}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div>
            {title && <h3 className="font-semibold text-slate-100 text-sm tracking-wide">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
