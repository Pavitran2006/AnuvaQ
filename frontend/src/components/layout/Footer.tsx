import React from 'react';
import { Cpu, Github, BookOpen, Layers, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl mt-auto py-8 px-6 text-slate-400">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Info */}
        <div className="flex flex-col gap-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-base font-mono">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>AetherQ Studio <span className="text-xs font-normal text-cyan-400">v1.1</span></span>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Commercial-grade Quantum Computing Platform built from first principles with pure linear algebra.
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
          <button
            onClick={() => onNavigateTab('landing')}
            className="hover:text-cyan-400 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => onNavigateTab('builder')}
            className="hover:text-cyan-400 transition-colors"
          >
            Circuit Studio
          </button>
          <button
            onClick={() => onNavigateTab('visualizer')}
            className="hover:text-cyan-400 transition-colors"
          >
            State Analytics
          </button>
          <button
            onClick={() => onNavigateTab('algorithms')}
            className="hover:text-cyan-400 transition-colors"
          >
            Algorithm Library
          </button>
          <button
            onClick={() => onNavigateTab('docs')}
            className="hover:text-cyan-400 transition-colors"
          >
            Quantum Math Handbook
          </button>
        </div>

        {/* Tech Stack & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
            <span>Built with</span>
            <span className="text-slate-300 font-semibold">Python</span>
            <span>•</span>
            <span className="text-slate-300 font-semibold">FastAPI</span>
            <span>•</span>
            <span className="text-slate-300 font-semibold">NumPy</span>
            <span>•</span>
            <span className="text-slate-300 font-semibold">React</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            © 2026 <span className="text-slate-300 font-medium">Pavitran</span>. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
