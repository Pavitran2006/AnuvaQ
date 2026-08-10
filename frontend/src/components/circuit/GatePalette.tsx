import React from 'react';
import { GateType } from '../../types/quantum';

interface GateDef {
  type: GateType;
  label: string;
  category: 'single' | 'phase' | 'rotation' | 'controlled' | 'measure';
  color: string;
  description: string;
}

const GATES: GateDef[] = [
  // Single Qubit
  { type: 'H', label: 'H', category: 'single', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', description: 'Hadamard (Creates Equal Superposition)' },
  { type: 'X', label: 'X', category: 'single', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', description: 'Pauli-X (Quantum NOT / Bit Flip)' },
  { type: 'Y', label: 'Y', category: 'single', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', description: 'Pauli-Y (Bit & Phase Flip)' },
  { type: 'Z', label: 'Z', category: 'single', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', description: 'Pauli-Z (Phase Flip)' },
  
  // Phase
  { type: 'S', label: 'S', category: 'phase', color: 'bg-violet-500/20 text-violet-300 border-violet-500/40', description: 'Phase Gate (π/2 Phase Shift)' },
  { type: 'T', label: 'T', category: 'phase', color: 'bg-violet-500/20 text-violet-300 border-violet-500/40', description: 'T Gate (π/4 Phase Shift)' },
  { type: 'SDG', label: 'S†', category: 'phase', color: 'bg-violet-500/20 text-violet-300 border-violet-500/40', description: 'S-Dagger (-π/2 Phase Shift)' },
  
  // Rotation
  { type: 'RX', label: 'Rx', category: 'rotation', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', description: 'Rotation around X-axis by θ' },
  { type: 'RY', label: 'Ry', category: 'rotation', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', description: 'Rotation around Y-axis by θ' },
  { type: 'RZ', label: 'Rz', category: 'rotation', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', description: 'Rotation around Z-axis by θ' },

  // Controlled
  { type: 'CX', label: 'CNOT', category: 'controlled', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', description: 'Controlled-NOT (Generates Entanglement)' },
  { type: 'CZ', label: 'CZ', category: 'controlled', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', description: 'Controlled-Phase Flip' },
  { type: 'SWAP', label: 'SWAP', category: 'controlled', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', description: 'Swaps state between two qubits' },

  // Measure
  { type: 'MEASURE', label: 'M', category: 'measure', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', description: 'Measurement (State Collapse)' },
];

interface GatePaletteProps {
  onSelectGate: (gate: GateType) => void;
  selectedGate: GateType | null;
}

export const GatePalette: React.FC<GatePaletteProps> = ({ onSelectGate, selectedGate }) => {
  return (
    <div className="w-64 glass-panel p-4 rounded-xl border border-slate-800 flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-1">Gate Library</h3>
        <p className="text-[11px] text-slate-400">Click a gate to select, then click canvas to place.</p>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
        {['single', 'phase', 'rotation', 'controlled', 'measure'].map((cat) => {
          const categoryGates = GATES.filter((g) => g.category === cat);
          const categoryLabels: Record<string, string> = {
            single: 'Pauli & Superposition',
            phase: 'Phase Operators',
            rotation: 'Parametric Rotations',
            controlled: 'Multi-Qubit Entanglement',
            measure: 'Measurement Operators',
          };

          return (
            <div key={cat} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                {categoryLabels[cat]}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {categoryGates.map((g) => {
                  const isSelected = selectedGate === g.type;
                  return (
                    <button
                      key={g.type}
                      onClick={() => onSelectGate(g.type)}
                      title={g.description}
                      className={`h-10 rounded-lg border font-mono font-bold text-xs flex items-center justify-center transition-all duration-200 ${g.color} ${
                        isSelected ? 'ring-2 ring-quantum-cyan ring-offset-2 ring-offset-slate-950 scale-105 shadow-md' : 'hover:opacity-90'
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
