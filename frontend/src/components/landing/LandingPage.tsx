import React from 'react';
import { Cpu, Layers, Code2, ArrowRight, Play, BookOpen, ShieldCheck, Activity, Zap, Server, Atom } from 'lucide-react';

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
    <div className="flex flex-col gap-12 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b0f19]/90 p-8 md:p-12 backdrop-blur-md">
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-400 text-xs font-mono font-medium tracking-wide">
            <Atom className="w-3.5 h-3.5" />
            <span>SCIENTIFIC QUANTUM COMPUTING PLATFORM</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Explore Quantum Computing Through{' '}
            <span className="text-cyan-400">
              Interactive Simulation
            </span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">
            Design quantum circuits, simulate quantum states, model realistic noise, and analyze quantum information through an interactive scientific workspace.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onLaunchStudio}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-sm transition-scientific"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onExploreDocs}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-scientific"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explore Quantum Math</span>
            </button>
          </div>

          {/* Quick Preset Launch Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs text-slate-400 font-mono">
            <span className="text-slate-500">Quick Presets:</span>
            <button
              onClick={() => {
                onRunPreset('bell');
                onLaunchStudio();
              }}
              className="px-2.5 py-1 rounded border border-slate-800 bg-slate-900 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
            >
              Bell State (|Φ+⟩)
            </button>
            <button
              onClick={() => {
                onRunPreset('grover');
                onLaunchStudio();
              }}
              className="px-2.5 py-1 rounded border border-slate-800 bg-slate-900 hover:border-blue-500/40 hover:text-blue-400 transition-colors"
            >
              Grover Search (|11⟩)
            </button>
            <button
              onClick={() => {
                onRunPreset('qft');
                onLaunchStudio();
              }}
              className="px-2.5 py-1 rounded border border-slate-800 bg-slate-900 hover:border-teal-500/40 hover:text-teal-400 transition-colors"
            >
              Quantum Fourier Transform
            </button>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          Core Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-100 text-sm">1. Quantum Circuit Simulation</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Simulate state vectors <span className="font-mono text-cyan-400">|ψ⟩ ∈ ℂ²ⁿ</span> up to 8 qubits with unitaries, gate matrices, and Born rule collapse.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-100 text-sm">2. Quantum Noise Modeling</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Model open quantum systems with Kraus operator channels: Bit Flip, Phase Flip, Depolarizing, Amplitude Damping, and Phase Damping.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-100 text-sm">3. State Analytics</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Inspect 3D Bloch vectors, side-by-side ideal vs. noisy histograms, density matrix heatmaps, and quantum fidelity metrics (F, P, S, D).
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-300">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-100 text-sm">4. Cloud Workspaces</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Persist circuits to PostgreSQL/SQLite, export OpenQASM 2.0 specs, manage saved projects, and authenticate via secure JWT.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Algorithms Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          Supported Algorithms
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
          {[
            { name: 'Bell State', tag: 'Superposition & EPR', preset: 'bell' },
            { name: 'Grover Search', tag: 'Amplitude Amplification', preset: 'grover' },
            { name: 'Deutsch-Jozsa', tag: 'Quantum Oracle Evaluation', preset: 'deutsch' },
            { name: 'QFT', tag: 'Phase Estimation', preset: 'qft' },
            { name: 'Teleportation', tag: 'Entanglement Channel', preset: 'bell' },
          ].map((algo) => (
            <button
              key={algo.name}
              onClick={() => {
                onRunPreset(algo.preset);
                onLaunchStudio();
              }}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 hover:border-cyan-500/40 text-left transition-scientific flex flex-col justify-between gap-2"
            >
              <div className="font-bold text-slate-200">{algo.name}</div>
              <div className="text-[10px] text-slate-400">{algo.tag}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Architecture & Tech Stack */}
      <section className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <div>
            <h4 className="text-slate-200 font-semibold text-xs">Pure Linear Algebra Engine</h4>
            <p className="text-slate-400 text-[11px]">Zero black-box quantum library dependencies. 100% Pytest verified.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['Python 3.11', 'FastAPI', 'NumPy', 'React 18', 'TypeScript', 'Tailwind CSS'].map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-0.5 rounded border border-slate-800 bg-slate-900 text-slate-300 font-mono text-[10px]"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};
