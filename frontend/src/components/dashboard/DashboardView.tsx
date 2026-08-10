import React from 'react';
import { Cpu, Atom, Layers, Zap, BookOpen, Folder, Play, ArrowRight, Activity, ShieldCheck, Plus, Clock, Database, CheckCircle2 } from 'lucide-react';
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
      noise: 'Ideal / Noiseless',
      updatedAt: '10 mins ago',
      presetId: 'bell',
    },
    {
      id: 'grover',
      title: 'Grover Search (Target |11⟩)',
      qubits: 2,
      gatesCount: 12,
      noise: 'Depolarizing (15%)',
      updatedAt: '1 hour ago',
      presetId: 'grover',
    },
    {
      id: 'qft',
      title: 'Quantum Fourier Transform',
      qubits: 3,
      gatesCount: 5,
      noise: 'Phase Damping (5%)',
      updatedAt: '2 hours ago',
      presetId: 'qft',
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Header & Status Bar */}
      <div className="p-6 rounded-xl border border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
            Quantum Workspace Console
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Welcome, <span className="text-cyan-400">{name}</span>
          </h1>
          {/* Telemetry Status Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mt-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Quantum Engine Online
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              API Connected
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Workspace Connected
            </span>
          </div>
        </div>

        <button
          onClick={onLaunchStudio}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-scientific"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Open Circuit Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Active Qubits</span>
            <Atom className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">8 Qubits</div>
          <div className="text-[10px] text-slate-500 font-mono">Max Hilbert space $2^8 = 256$</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Simulations</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">Dual-Engine</div>
          <div className="text-[10px] text-emerald-400 font-mono">PyNumPy + Local JS</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Saved Projects</span>
            <Database className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">Persistent</div>
          <div className="text-[10px] text-slate-500 font-mono">SQLite / PostgreSQL ORM</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Noise Models</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">5 Channels</div>
          <div className="text-[10px] text-slate-500 font-mono">Kraus Operator density $\rho$</div>
        </div>
      </div>

      {/* Quick Action Launchers */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={onLaunchStudio}
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 hover:border-cyan-500/40 text-left transition-scientific flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">New Circuit</div>
              <div className="text-[10px] text-slate-400">Open blank studio canvas</div>
            </div>
          </button>

          <button
            onClick={onLaunchStudio}
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 hover:border-blue-500/40 text-left transition-scientific flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">Run Simulation</div>
              <div className="text-[10px] text-slate-400">Execute circuit engine</div>
            </div>
          </button>

          <button
            onClick={onOpenProjects}
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 hover:border-teal-500/40 text-left transition-scientific flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-teal-400 transition-colors">Load Project</div>
              <div className="text-[10px] text-slate-400">Manage saved workspaces</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('algorithms')}
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 hover:border-slate-700 text-left transition-scientific flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">Explore Algorithms</div>
              <div className="text-[10px] text-slate-400">Pre-built quantum circuits</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
            Recent Projects & Presets
          </h2>
          <button
            onClick={onOpenProjects}
            className="text-xs font-mono text-cyan-400 hover:underline"
          >
            View All Projects →
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 font-mono text-[11px] text-slate-400 uppercase">
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-4">Qubits</th>
                <th className="py-2.5 px-4">Gates</th>
                <th className="py-2.5 px-4">Noise Channel</th>
                <th className="py-2.5 px-4">Modified</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {recentProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors text-slate-300">
                  <td className="py-3 px-4 font-bold text-slate-200">{p.title}</td>
                  <td className="py-3 px-4 text-cyan-400">{p.qubits} Qubits</td>
                  <td className="py-3 px-4">{p.gatesCount} gates</td>
                  <td className="py-3 px-4 text-slate-400">{p.noise}</td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{p.updatedAt}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        onLoadPreset(p.presetId);
                        onLaunchStudio();
                      }}
                      className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/40 text-cyan-300 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Load</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
