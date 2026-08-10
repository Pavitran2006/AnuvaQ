import React, { useState } from 'react';
import { Search } from 'lucide-react';
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
  { type: 'H', label: 'H', category: 'single', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20', description: 'Hadamard (Creates Equal Superposition)' },
  { type: 'X', label: 'X', category: 'single', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20', description: 'Pauli-X (Quantum NOT / Bit Flip)' },
  { type: 'Y', label: 'Y', category: 'single', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20', description: 'Pauli-Y (Bit & Phase Flip)' },
  { type: 'Z', label: 'Z', category: 'single', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20', description: 'Pauli-Z (Phase Flip)' },
  
  // Phase
  { type: 'S', label: 'S', category: 'phase', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20', description: 'Phase Gate (π/2 Phase Shift)' },
  { type: 'T', label: 'T', category: 'phase', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20', description: 'T Gate (π/4 Phase Shift)' },
  { type: 'SDG', label: 'S†', category: 'phase', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20', description: 'S-Dagger (-π/2 Phase Shift)' },
  
  // Rotation
  { type: 'RX', label: 'Rx', category: 'rotation', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500/20', description: 'Rotation around X-axis by θ' },
  { type: 'RY', label: 'Ry', category: 'rotation', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500/20', description: 'Rotation around Y-axis by θ' },
  { type: 'RZ', label: 'Rz', category: 'rotation', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500/20', description: 'Rotation around Z-axis by θ' },

  // Controlled
  { type: 'CX', label: 'CNOT', category: 'controlled', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20', description: 'Controlled-NOT (Generates Entanglement)' },
  { type: 'CZ', label: 'CZ', category: 'controlled', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20', description: 'Controlled-Phase Flip' },
  { type: 'SWAP', label: 'SWAP', category: 'controlled', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20', description: 'Swaps state between two qubits' },

  // Measure
  { type: 'MEASURE', label: 'M', category: 'measure', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20', description: 'Measurement (State Collapse)' },
];

interface GatePaletteProps {
  onSelectGate: (gate: GateType) => void;
  selectedGate: GateType | null;
}

export const GatePalette: React.FC<GatePaletteProps> = ({ onSelectGate, selectedGate }) => {
  const [search, setSearch] = useState('');

  const filteredGates = GATES.filter(
    (g) =>
      g.label.toLowerCase().includes(search.toLowerCase()) ||
      g.type.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-60 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-3 shrink-0">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-0.5">Gate Palette</h3>
        <p className="text-[10px] text-slate-500">Select gate & click canvas to place.</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        <input
          type="text"
          placeholder="Search gates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
        {['single', 'phase', 'rotation', 'controlled', 'measure'].map((cat) => {
          const categoryGates = filteredGates.filter((g) => g.category === cat);
          if (categoryGates.length === 0) return null;

          const categoryLabels: Record<string, string> = {
            single: 'Single Qubit',
            phase: 'Phase Operators',
            rotation: 'Parametric Rotations',
            controlled: 'Multi-Qubit',
            measure: 'Measurement',
          };

          return (
            <div key={cat} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                {categoryLabels[cat]}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {categoryGates.map((g) => {
                  const isSelected = selectedGate === g.type;
                  return (
                    <button
                      key={g.type}
                      onClick={() => onSelectGate(g.type)}
                      title={g.description}
                      className={`h-9 rounded-md border font-mono font-bold text-xs flex items-center justify-center transition-scientific ${g.color} ${
                        isSelected ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-950 scale-105 shadow-sm' : ''
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
