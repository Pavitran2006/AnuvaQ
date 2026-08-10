import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'violet' | 'emerald' | 'rose' | 'amber' | 'slate';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'cyan', className }) => {
  const variants = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    slate: 'bg-slate-900 text-slate-300 border-slate-800',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium rounded border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
