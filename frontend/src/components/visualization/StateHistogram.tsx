import React from 'react';
import { BasisAmplitude } from '../../types/quantum';

interface StateHistogramProps {
  amplitudes: BasisAmplitude[];
  shotsSummary?: Record<string, number>;
  noisyProbabilities?: number[];
  noiseEnabled?: boolean;
}

export const StateHistogram: React.FC<StateHistogramProps> = ({
  amplitudes,
  shotsSummary,
  noisyProbabilities,
  noiseEnabled,
}) => {
  const totalShots = shotsSummary ? Object.values(shotsSummary).reduce((a, b) => a + b, 0) : 1000;

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            Measurement Outcome Probabilities P(|x⟩)
            {noiseEnabled && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Ideal vs. Noisy Dual Bar Comparison
              </span>
            )}
          </h3>
          <p className="text-[11px] text-slate-400">Born Rule probabilities and Monte Carlo shot distributions</p>
        </div>
        <div className="flex items-center gap-3">
          {noiseEnabled && (
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block" /> Ideal
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-400 inline-block" /> Noisy
              </span>
            </div>
          )}
          <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-quantum-cyan px-2.5 py-1 rounded">
            Shots: {totalShots}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 h-52 pt-6 pb-2 px-2 border-b border-slate-800">
        {amplitudes.map((amp, idx) => {
          const idealProb = amp.probability;
          const noisyProb = noisyProbabilities && noisyProbabilities[idx] !== undefined ? noisyProbabilities[idx] : idealProb;

          const idealHeight = Math.max(4, idealProb * 100);
          const noisyHeight = Math.max(4, noisyProb * 100);

          const shotCount = shotsSummary ? shotsSummary[amp.binary] || 0 : Math.round(amp.probability * totalShots);

          return (
            <div key={amp.index} className="flex-1 flex flex-col items-center h-full justify-end group">
              {/* Tooltip Probability */}
              <div className="text-[10px] font-mono font-semibold flex items-center gap-1 mb-1">
                <span className="text-cyan-400">{(idealProb * 100).toFixed(1)}%</span>
                {noiseEnabled && <span className="text-rose-400">/ {(noisyProb * 100).toFixed(1)}%</span>}
              </div>

              {/* Bar container */}
              <div className="w-full bg-slate-900/90 border border-slate-800/80 rounded-t-md relative overflow-hidden flex items-end justify-center h-full p-0.5 gap-1">
                {/* Ideal Bar */}
                <div className="flex-1 flex items-end h-full">
                  <div
                    style={{ height: `${idealHeight}%` }}
                    className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-500 rounded-t-sm opacity-90 group-hover:opacity-100"
                    title={`Ideal P(${amp.basis}) = ${(idealProb * 100).toFixed(2)}%`}
                  />
                </div>

                {/* Noisy Bar (Only rendered when noise is enabled) */}
                {noiseEnabled && (
                  <div className="flex-1 flex items-end h-full">
                    <div
                      style={{ height: `${noisyHeight}%` }}
                      className="w-full bg-gradient-to-t from-rose-600 to-rose-400 transition-all duration-500 rounded-t-sm opacity-90 group-hover:opacity-100"
                      title={`Noisy P(${amp.basis}) = ${(noisyProb * 100).toFixed(2)}%`}
                    />
                  </div>
                )}
              </div>

              {/* Basis State Label */}
              <span className="text-xs font-mono font-bold text-slate-300 mt-2">
                {amp.basis}
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                {shotCount} shots
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
