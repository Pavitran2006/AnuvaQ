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
    { id: 'bit_flip', name: 'Bit Flip Channel', desc: 'Applies Pauli-X flip with probability p' },
    { id: 'phase_flip', name: 'Phase Flip Channel', desc: 'Applies Pauli-Z phase flip with probability p' },
    { id: 'depolarizing', name: 'Depolarizing Channel', desc: 'Symmetric Pauli X, Y, Z noise map' },
    { id: 'amplitude_damping', name: 'Amplitude Damping', desc: 'Energy relaxation & spontaneous emission (|1⟩ → |0⟩)' },
    { id: 'phase_damping', name: 'Phase Damping', desc: 'Pure quantum dephasing without energy loss' },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Quantum Noise Simulation
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                v1.4 Kraus Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">Compare Ideal State vs. Realistic Noisy Quantum System</p>
          </div>
        </div>

        {/* Noise Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={noiseEnabled}
            onChange={(e) => setNoiseEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-violet-500"></div>
          <span className="ml-2.5 text-xs font-mono font-medium text-slate-300">
            {noiseEnabled ? 'NOISY ON' : 'IDEAL'}
          </span>
        </label>
      </div>

      {noiseEnabled && (
        <div className="space-y-4 pt-1 animate-fadeIn">
          {/* Model Selection Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Noise Channel Model
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {noiseModels.find((m) => m.id === noiseModel)?.name}
              </span>
            </label>
            <select
              value={noiseModel}
              onChange={(e) => setNoiseModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            >
              {noiseModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <Info className="w-3 h-3 text-violet-400 shrink-0" />
              {noiseModels.find((m) => m.id === noiseModel)?.desc}
            </p>
          </div>

          {/* Noise Probability Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-violet-400" /> Error Probability (p)
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/30">
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
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0% (Ideal)</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100% (Pure Noise)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
