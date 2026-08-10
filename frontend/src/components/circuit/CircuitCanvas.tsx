import React, { useState } from 'react';
import { Trash2, Link, Zap } from 'lucide-react';
import { useCircuitStore } from '../../store/useCircuitStore';
import { GateType } from '../../types/quantum';

interface CircuitCanvasProps {
  selectedPaletteGate: GateType | null;
  onClearPaletteGate: () => void;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  selectedPaletteGate,
  onClearPaletteGate,
}) => {
  const { numQubits, gates, addGate, removeGate } = useCircuitStore();

  const MAX_STEPS = 12;
  const steps = Array.from({ length: MAX_STEPS }, (_, i) => i);
  const qubits = Array.from({ length: numQubits }, (_, i) => i);

  const [controlSource, setControlSource] = useState<{ qubit: number; step: number } | null>(null);

  const handleCellClick = (qubitIndex: number, stepIndex: number) => {
    // Check if a gate already exists in this slot
    const existingGate = gates.find((g) => g.target === qubitIndex && g.stepIndex === stepIndex);

    if (existingGate) {
      removeGate(existingGate.id);
      return;
    }

    if (!selectedPaletteGate) return;

    if (['CX', 'CZ', 'SWAP'].includes(selectedPaletteGate)) {
      if (!controlSource) {
        // First click sets control qubit
        setControlSource({ qubit: qubitIndex, step: stepIndex });
      } else {
        if (controlSource.step === stepIndex && controlSource.qubit !== qubitIndex) {
          // Second click sets target qubit and places controlled gate
          addGate(selectedPaletteGate, qubitIndex, stepIndex, [controlSource.qubit]);
          setControlSource(null);
          onClearPaletteGate();
        } else {
          setControlSource({ qubit: qubitIndex, step: stepIndex });
        }
      }
    } else if (['RX', 'RY', 'RZ'].includes(selectedPaletteGate)) {
      const angleStr = prompt('Enter rotation angle θ in radians (e.g. 1.5708 for π/2):', '1.5708');
      const theta = angleStr ? parseFloat(angleStr) : Math.PI / 2;
      addGate(selectedPaletteGate, qubitIndex, stepIndex, [], { theta });
      onClearPaletteGate();
    } else {
      addGate(selectedPaletteGate, qubitIndex, stepIndex);
      onClearPaletteGate();
    }
  };

  return (
    <div className="glass-panel p-6 rounded-xl border border-slate-800 flex-1 overflow-x-auto min-h-[420px] flex flex-col justify-between">
      {/* Canvas Header info */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-quantum-cyan animate-pulse"></span>
          <span className="font-mono text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Quantum Circuit Register Canvas
          </span>
        </div>
        {selectedPaletteGate && (
          <div className="flex items-center gap-2 bg-quantum-cyan/10 border border-quantum-cyan/30 text-quantum-cyan text-xs font-mono px-3 py-1 rounded-md animate-pulse">
            <Zap className="w-3.5 h-3.5" />
            <span>Selected Gate: <strong>{selectedPaletteGate}</strong> (Click grid slot to place)</span>
          </div>
        )}
        {controlSource && (
          <div className="flex items-center gap-2 bg-quantum-violet/10 border border-quantum-violet/30 text-quantum-violet text-xs font-mono px-3 py-1 rounded-md">
            <Link className="w-3.5 h-3.5" />
            <span>Control Qubit Set at q[{controlSource.qubit}]. Now click Target Qubit at step {controlSource.step}.</span>
          </div>
        )}
      </div>

      {/* Grid Wire System */}
      <div className="relative my-auto py-4">
        {qubits.map((qIndex) => (
          <div key={qIndex} className="relative flex items-center h-16 my-2">
            {/* Qubit Wire Label */}
            <div className="w-24 shrink-0 flex items-center justify-between pr-4 border-r border-slate-800">
              <span className="font-mono text-xs font-semibold text-slate-300">q[{qIndex}]</span>
              <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                |0⟩
              </span>
            </div>

            {/* Continuous Wire Line */}
            <div className="absolute left-24 right-0 h-0.5 bg-slate-700/80 z-0"></div>

            {/* Time Step Slots */}
            <div className="flex-1 flex items-center justify-around z-10 pl-4">
              {steps.map((sIndex) => {
                const gateAtCell = gates.find((g) => g.target === qIndex && g.stepIndex === sIndex);
                const isControlSlot = gates.some(
                  (g) => g.stepIndex === sIndex && g.controls?.includes(qIndex)
                );
                const isControlPending = controlSource?.qubit === qIndex && controlSource?.step === sIndex;

                return (
                  <div
                    key={sIndex}
                    onClick={() => handleCellClick(qIndex, sIndex)}
                    className={`w-12 h-12 rounded-lg border flex items-center justify-center cursor-pointer transition-all duration-200 ${
                      gateAtCell
                        ? 'bg-slate-900 border-quantum-cyan shadow-lg shadow-quantum-cyan/20 scale-105'
                        : isControlPending
                        ? 'bg-quantum-violet/20 border-quantum-violet ring-2 ring-quantum-violet animate-pulse'
                        : isControlSlot
                        ? 'bg-slate-900 border-quantum-violet'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-600 hover:bg-slate-800/30'
                    }`}
                  >
                    {gateAtCell ? (
                      <div className="flex flex-col items-center justify-center font-mono font-bold text-xs text-quantum-cyan">
                        <span>{gateAtCell.gate}</span>
                        {gateAtCell.params?.theta && (
                          <span className="text-[9px] text-slate-400 font-normal">
                            {(gateAtCell.params.theta).toFixed(2)}
                          </span>
                        )}
                      </div>
                    ) : isControlSlot ? (
                      <div className="w-3 h-3 rounded-full bg-quantum-violet shadow-md"></div>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-400 opacity-0 hover:opacity-100">+</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Grid Footer Time Steps Axis */}
      <div className="flex items-center justify-around pl-28 pt-3 border-t border-slate-800/80 font-mono text-[10px] text-slate-400">
        {steps.map((sIndex) => (
          <span key={sIndex} className="w-12 text-center">Step {sIndex}</span>
        ))}
      </div>
    </div>
  );
};
