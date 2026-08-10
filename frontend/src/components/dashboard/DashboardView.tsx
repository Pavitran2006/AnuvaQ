import React from 'react';
import { Cpu, Atom, Layers, Zap, BookOpen, Folder, Play, ArrowRight, Activity, ShieldCheck, Sparkles, Plus, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface DashboardViewProps {
  onLaunchStudio: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenProjects: () => void;
  onLoadPreset: (presetId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onLaunchStudio,
  onNavigateTab,
  onOpenProjects,
  onLoadPreset,
}) => {
  const { user } = useAuthStore();
  const name = user?.full_name || 'Quantum Engineer';

  const recentProjects = [
    {
      id: 'bell',
      title: 'Bell State Entanglement',
      qubits: 2,
      gatesCount: 2,
      updatedAt: '10 mins ago',
      presetId: 'bell',
      tag: 'Superposition & EPR Pair',
    },
    {
      id: 'grover',
      title: 'Grover Search (2-Qubit Target |11⟩)',
      qubits: 2,
      gatesCount: 12,
      updatedAt: '1 hour ago',
      presetId: 'grover',
      tag: 'Quantum Amplitude Amplification',
    },
    {
      id: 'qft',
      title: 'Quantum Fourier Transform',
      qubits: 3,
      gatesCount: 5,
      updatedAt: '2 hours ago',
      presetId: 'qft',
      tag: 'Phase Estimation Engine',
    },
  ];

  return (
    <div className="flex flex-col gap-8 py-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DEVELOPER DASHBOARD</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-transparent">{name}</span> 👋
            </h1>
            <p className="text-slate-400 text-xs max-w-xl leading-relaxed">
              Your quantum computing environment is ready. Simulate complex Hilbert spaces, inspect 3D Bloch sphere projections, and export OpenQASM 2.0 assembly.
            </p>
          </div>

          <button
            onClick={onLaunchStudio}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Studio Canvas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Active Qubits Limit</span>
            <Atom className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">8 Qubits</div>
          <div className="text-[11px] text-slate-500 font-mono">Max Hilbert space 2^8 = 256 amplitudes</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Simulator Engine</span>
            <Cpu className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">PyNumPy</div>
          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> FastAPI REST Connected
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Unitaries Executed</span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">100%</div>
          <div className="text-[11px] text-slate-500 font-mono">Norm preserved ⟨ψ|ψ⟩ = 1.0</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md flex flex-col gap-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>OpenQASM 2.0</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">Active</div>
          <div className="text-[11px] text-slate-500 font-mono">Import & Export parser enabled</div>
        </div>
      </div>

      {/* Quick Action Launchers Grid */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold font-mono text-slate-400 uppercase tracking-wider">
          Quick Action Launchers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={onLaunchStudio}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-cyan-500/40 text-left transition-all group flex flex-col gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm group-hover:text-cyan-300 transition-colors">Circuit Studio Canvas</h3>
              <p className="text-slate-400 text-xs mt-1">Interactive drag-and-drop circuit matrix editor.</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('algorithms')}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-violet-500/40 text-left transition-all group flex flex-col gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm group-hover:text-violet-300 transition-colors">Algorithm Library</h3>
              <p className="text-slate-400 text-xs mt-1">Pre-built Grover, Deutsch-Jozsa, and QFT algorithms.</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('docs')}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-teal-500/40 text-left transition-all group flex flex-col gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm group-hover:text-teal-300 transition-colors">Quantum Math Handbook</h3>
              <p className="text-slate-400 text-xs mt-1">Complex vector states, unitaries, and physics proofs.</p>
            </div>
          </button>

          <button
            onClick={onOpenProjects}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-blue-500/40 text-left transition-all group flex flex-col gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors">Workspace Projects</h3>
              <p className="text-slate-400 text-xs mt-1">Manage, load, and organize saved quantum files.</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Quantum Projects Table */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold font-mono text-slate-400 uppercase tracking-wider">
            Recent Quantum Circuits & Presets
          </h2>
          <button
            onClick={onLaunchStudio}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:underline font-mono"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Circuit</span>
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden backdrop-blur-md">
          <div className="divide-y divide-slate-800/80">
            {recentProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-cyan-400 font-mono text-xs">
                    {proj.qubits}Q
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-semibold">{proj.title}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>{proj.tag}</span>
                      <span>•</span>
                      <span>{proj.gatesCount} gates</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-mono text-slate-500 hidden sm:flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {proj.updatedAt}
                  </span>
                  <button
                    onClick={() => {
                      onLoadPreset(proj.presetId);
                      onLaunchStudio();
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/50 bg-slate-800/60 hover:bg-slate-800 text-cyan-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Load Circuit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
