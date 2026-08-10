import React from 'react';
import { useCircuitStore } from '../../store/useCircuitStore';
import { Activity, Sliders, Zap, Info } from 'lucide-react';

export const NoiseSettingsPanel: React.FC = () => {
  const {
    noiseEnabled,
    noiseModel,
    noiseProbability,
    setNoiseEnabled,
    setNoiseModel,
    setNoiseProbability,
  } = useCircuitStore();

  const noiseModels = [
    { id: 'bit_flip', name: 'Bit Flip Channel', desc: 'Applies Pauli-X errors with probability p.' },
    { id: 'phase_flip', name: 'Phase Flip Channel', desc: 'Applies Pauli-Z phase flips with probability p.' },
    { id: 'depolarizing', name: 'Depolarizing Channel', desc: 'Depolarizing noise randomly applies Pauli errors, reducing state fidelity.' },
    { id: 'amplitude_damping', name: 'Amplitude Damping', desc: 'Models energy relaxation and spontaneous decay (|1⟩ → |0⟩).' },
    { id: 'phase_damping', name: 'Phase Damping', desc: 'Models pure quantum dephasing without energy loss.' },
  ];

  return (
    <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-xl p-4 backdrop-blur-md flex flex-col gap-3">
      {/* Header with Title & IDEAL / NOISY Switch */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
              Quantum Noise Model
            </h3>
            <p className="text-[11px] text-slate-400">Density Matrix Kraus Operator Simulation Engine</p>
          </div>
        </div>

        {/* IDEAL / NOISY Toggle */}
        <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 font-mono text-[11px]">
          <button
            onClick={() => setNoiseEnabled(false)}
            className={`px-3 py-1 rounded-md font-bold transition-scientific ${
              !noiseEnabled ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            IDEAL
          </button>
          <button
            onClick={() => setNoiseEnabled(true)}
            className={`px-3 py-1 rounded-md font-bold transition-scientific ${
              noiseEnabled ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            NOISY
          </button>
        </div>
      </div>

      {noiseEnabled && (
        <div className="flex flex-col gap-3 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Model Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-300 font-mono flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Noise Channel Model
              </label>
              <select
                value={noiseModel}
                onChange={(e) => setNoiseModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono"
              >
                {noiseModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Probability Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-300 font-mono">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" /> Error Probability (p)
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-400 font-mono font-bold text-xs border border-slate-800">
                  {(noiseProbability * 100).toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.01"
                value={noiseProbability}
                onChange={(e) => setNoiseProbability(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>0% (Ideal)</span>
                <span>50%</span>
                <span>100% (Pure Noise)</span>
              </div>
            </div>
          </div>

          {/* Compact Explanation Box */}
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{noiseModels.find((m) => m.id === noiseModel)?.desc}</span>
          </div>
        </div>
      )}
    </div>
  );
};
