import React from 'react';
import { BasisAmplitude } from '../../types/quantum';

interface StateVectorTableProps {
  amplitudes: BasisAmplitude[];
}

export const StateVectorTable: React.FC<StateVectorTableProps> = ({ amplitudes }) => {
  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-200">
          Complex Amplitude Spectrum Vector |ψ⟩
        </h3>
        <span className="text-[10px] font-mono text-slate-400">
          Normalized: ∑|α_i|² = 1.0
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-2 px-3">Basis</th>
              <th className="py-2 px-3">Complex Amplitude α_k</th>
              <th className="py-2 px-3">Real (Re)</th>
              <th className="py-2 px-3">Imag (Im)</th>
              <th className="py-2 px-3">Magnitude |α_k|</th>
              <th className="py-2 px-3">Probability |α_k|²</th>
              <th className="py-2 px-3">Phase (θ)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {amplitudes.map((amp) => (
              <tr key={amp.index} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-3 font-bold text-quantum-cyan">{amp.basis}</td>
                <td className="py-2.5 px-3 text-slate-200">
                  {amp.real >= 0 ? `${amp.real.toFixed(4)}` : `${amp.real.toFixed(4)}`}
                  {amp.imag >= 0 ? ` + ${amp.imag.toFixed(4)}i` : ` - ${Math.abs(amp.imag).toFixed(4)}i`}
                </td>
                <td className="py-2.5 px-3 text-slate-400">{amp.real.toFixed(4)}</td>
                <td className="py-2.5 px-3 text-slate-400">{amp.imag.toFixed(4)}</td>
                <td className="py-2.5 px-3 text-slate-300">{amp.magnitude.toFixed(4)}</td>
                <td className="py-2.5 px-3 font-semibold text-emerald-400">
                  {(amp.probability * 100).toFixed(1)}%
                </td>
                <td className="py-2.5 px-3 text-quantum-violet font-semibold">
                  {amp.phase_deg.toFixed(1)}°
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
