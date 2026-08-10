import React from 'react';
import { BasisAmplitude } from '../../types/quantum';

interface DensityMatrixHeatmapProps {
  amplitudes: BasisAmplitude[];
  noisyDensityMatrix?: { real: number[][]; imag: number[][] };
  noiseEnabled?: boolean;
}

export const DensityMatrixHeatmap: React.FC<DensityMatrixHeatmapProps> = ({
  amplitudes,
  noisyDensityMatrix,
  noiseEnabled,
}) => {
  const [viewMode, setViewMode] = React.useState<'ideal' | 'noisy'>('noisy');
  const dim = amplitudes.length;

  const showNoisy = noiseEnabled && noisyDensityMatrix && viewMode === 'noisy';

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            Density Matrix Heatmap ρ
            {showNoisy ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Noisy Mixed State ρ_noisy
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Ideal Pure State |ψ⟩⟨ψ|
              </span>
            )}
          </h3>
          <p className="text-[11px] text-slate-400">
            {showNoisy ? 'Mixed quantum state density matrix with Kraus noise' : 'Pure state outer product matrix elements'}
          </p>
        </div>

        {noiseEnabled && noisyDensityMatrix && (
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[10px] font-mono">
            <button
              onClick={() => setViewMode('ideal')}
              className={`px-2 py-1 rounded transition-colors ${
                viewMode === 'ideal' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ideal
            </button>
            <button
              onClick={() => setViewMode('noisy')}
              className={`px-2 py-1 rounded transition-colors ${
                viewMode === 'noisy' ? 'bg-rose-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Noisy
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto my-2">
        <div
          className="grid gap-1.5 p-2 bg-slate-950/80 border border-slate-800 rounded-xl"
          style={{ gridTemplateColumns: `repeat(${dim}, minmax(48px, 1fr))` }}
        >
          {amplitudes.map((rowAmp, rIdx) =>
            amplitudes.map((colAmp, cIdx) => {
              let realPart = 0;
              if (showNoisy && noisyDensityMatrix) {
                realPart = noisyDensityMatrix.real[rIdx][cIdx];
              } else {
                realPart = rowAmp.real * colAmp.real + rowAmp.imag * colAmp.imag;
              }
              const mag = Math.abs(realPart);
              const colorBg = showNoisy
                ? `rgba(244, 63, 94, ${Math.min(1, mag * 0.85 + 0.08)})`
                : `rgba(0, 242, 255, ${Math.min(1, mag * 0.85 + 0.08)})`;

              return (
                <div
                  key={`${rowAmp.index}-${colAmp.index}`}
                  title={`ρ[${rowAmp.basis}, ${colAmp.basis}] = ${realPart.toFixed(4)}`}
                  style={{ backgroundColor: colorBg }}
                  className="h-12 rounded flex flex-col items-center justify-center font-mono text-[9px] font-bold text-slate-950 transition-all hover:scale-105 shadow-sm"
                >
                  <span>{realPart.toFixed(2)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
