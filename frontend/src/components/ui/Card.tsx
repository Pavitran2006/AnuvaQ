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
  title,
  subtitle,
  headerAction,
}) => {
  return (
    <div
      className={clsx(
        'rounded-xl p-5 border border-slate-800/80 bg-[#0f172a]/80 backdrop-blur-md transition-scientific',
        className
      )}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div>
            {title && <h3 className="font-bold text-slate-100 text-sm font-mono tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
