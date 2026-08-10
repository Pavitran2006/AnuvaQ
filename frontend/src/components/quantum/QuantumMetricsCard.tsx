import React from 'react';
import { QuantumMetrics } from '../../types/quantum';
import { ShieldCheck, BarChart3, Binary, Gauge, Sparkles } from 'lucide-react';

interface Props {
  metrics?: QuantumMetrics;
  noiseModel?: string;
  noiseProbability?: number;
}

export const QuantumMetricsCard: React.FC<Props> = ({ metrics, noiseModel, noiseProbability = 0 }) => {
  if (!metrics) {
    return (
      <div className="bg-[#0f172a]/60 border border-slate-800 rounded-xl p-4 text-center text-slate-500 text-xs font-mono">
        <Sparkles className="w-4 h-4 mx-auto mb-1 opacity-40 text-cyan-400" />
        Enable Noise Simulation to view Fidelity, Purity, Entropy, and Trace Distance metrics.
      </div>
    );
  }

  const fidelityPct = (metrics.fidelity * 100).toFixed(1);
  const purityPct = (metrics.purity * 100).toFixed(1);

  return (
    <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-xl p-4 backdrop-blur-md flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          Quantum Information Metrics
        </h4>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
          Noise: {((noiseProbability || 0) * 100).toFixed(0)}% ({noiseModel?.replace('_', ' ')})
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* State Fidelity */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Fidelity (F)
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400">{fidelityPct}%</div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Tr(ρ_ideal · ρ_noisy)</p>
          <div
            className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-300"
            style={{ width: `${fidelityPct}%` }}
          />
        </div>

        {/* State Purity */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1 font-mono">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Purity (𝒫)
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-cyan-400">{purityPct}%</div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Tr(ρ²)</p>
          <div
            className="absolute bottom-0 left-0 h-1 bg-cyan-500 transition-all duration-300"
            style={{ width: `${purityPct}%` }}
          />
        </div>

        {/* Von Neumann Entropy (Violet reserved for quantum entropy state) */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1 font-mono">
            <span className="flex items-center gap-1">
              <Binary className="w-3.5 h-3.5 text-violet-400" /> Entropy S(ρ)
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-violet-400">
            {metrics.entropy.toFixed(3)} <span className="text-[10px] text-slate-500 font-normal">bits</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">-Tr(ρ log₂ ρ)</p>
          <div
            className="absolute bottom-0 left-0 h-1 bg-violet-500 transition-all duration-300"
            style={{ width: `${Math.min(100, metrics.entropy * 100)}%` }}
          />
        </div>

        {/* Trace Distance */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1 font-mono">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" /> Trace Dist (D)
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-amber-400">{metrics.trace_distance.toFixed(3)}</div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">½ Tr|ρ₁ - ρ₂|</p>
          <div
            className="absolute bottom-0 left-0 h-1 bg-amber-500 transition-all duration-300"
            style={{ width: `${Math.min(100, metrics.trace_distance * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
