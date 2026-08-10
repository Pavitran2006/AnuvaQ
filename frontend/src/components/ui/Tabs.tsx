import React from 'react';
import { clsx } from 'clsx';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex space-x-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium rounded-md transition-scientific',
              isActive
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
