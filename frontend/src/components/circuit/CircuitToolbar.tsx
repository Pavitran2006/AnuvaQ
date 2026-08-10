import React from 'react';
import { Play, Trash2, Undo2, Redo2, Code, Plus, Minus, Sparkles } from 'lucide-react';
import { useCircuitStore } from '../../store/useCircuitStore';
import { Button } from '../ui/Button';

interface CircuitToolbarProps {
  onOpenQasmModal: () => void;
  onSelectPreset: (presetId: string) => void;
}

export const CircuitToolbar: React.FC<CircuitToolbarProps> = ({
  onOpenQasmModal,
  onSelectPreset,
}) => {
  const {
    numQubits,
    setNumQubits,
    runSimulation,
    clearCircuit,
    undo,
    redo,
    isSimulating,
    historyIndex,
    historyStack,
  } = useCircuitStore();

  return (
    <div className="glass-panel p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
      {/* Qubit Count Controller */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-slate-400 font-medium">Qubits:</span>
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setNumQubits(numQubits - 1)}
            disabled={numQubits <= 1}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-100 disabled:opacity-30 hover:bg-slate-800"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center font-mono font-bold text-xs text-quantum-cyan">{numQubits}</span>
          <button
            onClick={() => setNumQubits(numQubits + 1)}
            disabled={numQubits >= 8}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-100 disabled:opacity-30 hover:bg-slate-800"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-quantum-violet" />
        <select
          onChange={(e) => {
            if (e.target.value) onSelectPreset(e.target.value);
          }}
          defaultValue=""
          className="bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-quantum-violet"
        >
          <option value="" disabled>Load Preset...</option>
          <option value="bell">Bell State (|Φ+⟩)</option>
          <option value="ghz">3-Qubit GHZ State</option>
          <option value="grover">Grover Search (Target |11⟩)</option>
          <option value="deutsch">Deutsch-Jozsa (Balanced)</option>
          <option value="qft">Quantum Fourier Transform</option>
        </select>
      </div>

      {/* Undo / Redo / Clear / QASM Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 disabled:opacity-30 hover:bg-slate-800 transition-colors"
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= historyStack.length - 1}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 disabled:opacity-30 hover:bg-slate-800 transition-colors"
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>
        <button
          onClick={clearCircuit}
          className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          title="Clear Circuit"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <Button variant="secondary" size="sm" onClick={onOpenQasmModal} leftIcon={<Code className="w-3.5 h-3.5" />}>
          OpenQASM 2.0
        </Button>
      </div>

      {/* Main Execute Button */}
      <Button
        variant="quantum"
        size="sm"
        onClick={() => runSimulation()}
        isLoading={isSimulating}
        leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
      >
        Simulate Circuit
      </Button>
    </div>
  );
};
