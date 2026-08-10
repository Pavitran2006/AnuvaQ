import React from 'react';
import { Sparkles, Cpu, Layers, Code2, ArrowRight, Play, BookOpen, ShieldCheck, Activity } from 'lucide-react';

interface LandingPageProps {
  onLaunchStudio: () => void;
  onExploreDocs: () => void;
  onRunPreset: (presetId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchStudio,
  onExploreDocs,
  onRunPreset,
}) => {
  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-8 md:p-16 backdrop-blur-xl shadow-2xl shadow-cyan-950/40">
        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 text-xs font-mono font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMERCIAL QUANTUM COMPUTING PLATFORM</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Explore Quantum Mechanics Through{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-transparent">
              Interactive Linear Algebra
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
            AetherQ Studio is an enterprise-grade quantum simulator built from first principles. 
            Simulate complex state vectors <span className="font-mono text-cyan-300">|ψ⟩ ∈ ℂ²ⁿ</span>, 
            analyze 3D Bloch spheres, compute density matrix heatmaps, and run quantum algorithms from Grover&apos;s search to QFT.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onLaunchStudio}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDocs}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Quantum Math Guide</span>
            </button>
          </div>

          {/* Quick Preset Launch Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6 text-xs text-slate-400 font-mono">
            <span className="text-slate-500">Quick Presets:</span>
            <button
              onClick={() => {
                onRunPreset('bell');
                onLaunchStudio();
              }}
              className="px-3 py-1 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
            >
              ⚡ Bell State (|Φ+⟩)
            </button>
            <button
              onClick={() => {
                onRunPreset('grover');
                onLaunchStudio();
              }}
              className="px-3 py-1 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-violet-500/50 hover:text-violet-300 transition-colors"
            >
              🔍 Grover Search (|11⟩)
            </button>
            <button
              onClick={() => {
                onRunPreset('qft');
                onLaunchStudio();
              }}
              className="px-3 py-1 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-teal-500/50 hover:text-teal-300 transition-colors"
            >
              🌊 Quantum Fourier Transform
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-base">Pure NumPy Engine</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Built from scratch with zero black-box quantum framework dependencies. Computes complex state vectors, unitary matrices, and partial trace operations directly in Python/NumPy.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-base">Dual-Mode Simulation</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Instant client-side TypeScript simulator for zero-latency UI interaction paired with a high-precision FastAPI NumPy backend for heavy computational workloads.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-base">3D Visual Analytics</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Dynamic 3D SVG Bloch spheres, Born rule probability histograms, 4x4 density matrix heatmaps, and comprehensive complex amplitude spectrum tables.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white text-base">OpenQASM 2.0 Specs</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Full bidirectional OpenQASM 2.0 code import and export. Seamlessly translate circuit canvas matrices into standardized quantum assembly language.
          </p>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="p-8 rounded-2xl border border-slate-800 bg-slate-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          <div>
            <h4 className="text-white font-semibold text-sm">Enterprise Software Standards</h4>
            <p className="text-slate-400 text-xs">100% automated test coverage, JWT security, and double-precision linear algebra verification.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['Python 3.10', 'FastAPI', 'NumPy', 'React 18', 'TypeScript', 'Tailwind CSS', 'Zustand'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full border border-slate-700/80 bg-slate-800/50 text-slate-300 font-mono text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};
