import React from 'react';
import { Atom } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070a12] py-8 px-6 text-slate-400 mt-auto">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs font-mono">
        {/* Column 1: Brand */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
            <Atom className="w-4 h-4 text-cyan-400" />
            <span>AnuvaQ</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Interactive Quantum Computing & Noise Simulation Platform built from first principles with pure linear algebra.
          </p>
        </div>

        {/* Column 2: Product Links */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-300 font-semibold uppercase text-[10px] tracking-wider">Product</span>
          <button onClick={() => onNavigateTab('builder')} className="text-left hover:text-cyan-400 text-slate-400">Circuit Studio</button>
          <button onClick={() => onNavigateTab('visualizer')} className="text-left hover:text-cyan-400 text-slate-400">State Analytics</button>
          <button onClick={() => onNavigateTab('algorithms')} className="text-left hover:text-cyan-400 text-slate-400">Algorithm Library</button>
          <button onClick={() => onNavigateTab('dashboard')} className="text-left hover:text-cyan-400 text-slate-400">Developer Dashboard</button>
        </div>

        {/* Column 3: Resources */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-300 font-semibold uppercase text-[10px] tracking-wider">Resources</span>
          <button onClick={() => onNavigateTab('docs')} className="text-left hover:text-cyan-400 text-slate-400">Quantum Math Handbook</button>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 text-slate-400">GitHub Repository</a>
          <span className="text-slate-500 text-[11px]">OpenQASM 2.0 Specs</span>
        </div>

        {/* Column 4: Technology & Copyright */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-300 font-semibold uppercase text-[10px] tracking-wider">Technology</span>
          <div className="text-slate-400 text-[11px] flex flex-wrap gap-1">
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Python</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">NumPy</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">FastAPI</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">React 18</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">TypeScript</span>
          </div>
          <div className="text-slate-500 text-[10px] mt-2">
            © 2026 Pavitran. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
