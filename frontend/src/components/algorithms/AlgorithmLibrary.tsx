import React, { useState } from 'react';
import { Zap, Play, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { api } from '../../services/api';
import { SimulationResult } from '../../types/quantum';
import { StateHistogram } from '../visualization/StateHistogram';
import { StateVectorTable } from '../visualization/StateVectorTable';

interface AlgorithmDef {
  id: string;
  name: string;
  category: string;
  qubits: number;
  description: string;
  complexity: string;
  paramOptions?: { label: string; value: string }[];
}

const ALGORITHMS: AlgorithmDef[] = [
  {
    id: 'bell-state',
    name: 'Bell State Generator',
    category: 'Entanglement',
    qubits: 2,
    description: 'Generates 1 of 4 maximally entangled 2-qubit Bell states: |Φ+⟩, |Φ-⟩, |Ψ+⟩, |Ψ-⟩.',
    complexity: 'O(1)',
    paramOptions: [
      { label: '|Φ+⟩ = (|00⟩ + |11⟩)/√2', value: '0' },
      { label: '|Φ-⟩ = (|00⟩ - |11⟩)/√2', value: '1' },
      { label: '|Ψ+⟩ = (|01⟩ + |10⟩)/√2', value: '2' },
      { label: '|Ψ-⟩ = (|01⟩ - |10⟩)/√2', value: '3' },
    ],
  },
  {
    id: 'deutsch-jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    category: 'Quantum Speedup',
    qubits: 2,
    description: 'Determines whether a hidden black-box oracle function is Constant or Balanced in a single quantum query.',
    complexity: 'O(1) vs O(2^(N-1))',
    paramOptions: [
      { label: 'Constant Oracle f(x) = 0', value: 'constant' },
      { label: 'Balanced Oracle f(x) = x', value: 'balanced' },
    ],
  },
  {
    id: 'grover-search',
    name: "Grover's Search Algorithm",
    category: 'Quantum Search',
    qubits: 2,
    description: 'Provides quadratic speedup for searching an unsorted 2-qubit computational state space.',
    complexity: 'O(√N)',
    paramOptions: [
      { label: 'Target State |00⟩', value: '00' },
      { label: 'Target State |01⟩', value: '01' },
      { label: 'Target State |10⟩', value: '10' },
      { label: 'Target State |11⟩', value: '11' },
    ],
  },
  {
    id: 'qft',
    name: 'Quantum Fourier Transform (QFT)',
    category: 'Transforms',
    qubits: 3,
    description: 'Quantum version of Discrete Fourier Transform operating on complex state vector amplitudes.',
    complexity: 'O(N^2)',
  },
  {
    id: 'teleportation',
    name: 'Quantum Teleportation Protocol',
    category: 'Communication',
    qubits: 3,
    description: 'Transfers an unknown single-qubit quantum state from Alice to Bob using an EPR Bell pair and 2 classical bits.',
    complexity: 'O(1)',
  },
];

export const AlgorithmLibrary: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmDef>(ALGORITHMS[0]);
  const [selectedParam, setSelectedParam] = useState<string>(
    ALGORITHMS[0].paramOptions ? ALGORITHMS[0].paramOptions[0].value : ''
  );
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRun = async () => {
    setIsLoading(true);
    try {
      const res = await api.post(`/algorithms/run/${selectedAlgo.id}?param=${selectedParam}`);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-6 min-h-[calc(100vh-140px)]">
      {/* Algorithm Selection Sidebar */}
      <div className="w-80 flex flex-col gap-3">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
          Standard Quantum Algorithms
        </h2>
        {ALGORITHMS.map((algo) => {
          const isSelected = selectedAlgo.id === algo.id;
          return (
            <div
              key={algo.id}
              onClick={() => {
                setSelectedAlgo(algo);
                setSelectedParam(algo.paramOptions ? algo.paramOptions[0].value : '');
                setResult(null);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'glass-panel-glow border-quantum-cyan/50 ring-1 ring-quantum-cyan'
                  : 'glass-panel hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-bold text-sm text-slate-100">{algo.name}</h3>
                <Badge variant={isSelected ? 'cyan' : 'slate'}>{algo.qubits} Qubits</Badge>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{algo.description}</p>
              <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-slate-500">
                <span>{algo.category}</span>
                <span className="text-quantum-violet font-semibold">Speedup: {algo.complexity}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Algorithm Execution Stage */}
      <div className="flex-1 flex flex-col gap-6">
        <Card title={selectedAlgo.name} subtitle={selectedAlgo.description} glow>
          <div className="flex items-center justify-between py-2 border-b border-slate-800 mb-4">
            {selectedAlgo.paramOptions ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-300">Parameter Configuration:</span>
                <select
                  value={selectedParam}
                  onChange={(e) => setSelectedParam(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs font-mono text-quantum-cyan rounded-lg px-3 py-1.5 focus:outline-none focus:border-quantum-cyan"
                >
                  {selectedAlgo.paramOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-400">Default settings active</span>
            )}

            <Button
              variant="quantum"
              onClick={handleRun}
              isLoading={isLoading}
              leftIcon={<Play className="w-4 h-4 fill-current" />}
            >
              Execute Algorithm
            </Button>
          </div>

          {result && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              {result.description && (
                <div className="p-3 rounded-lg bg-quantum-cyan/10 border border-quantum-cyan/30 text-quantum-cyan font-mono text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{result.description}</span>
                </div>
              )}

              <StateHistogram amplitudes={result.final_amplitudes} shotsSummary={result.shots_summary} />
              <StateVectorTable amplitudes={result.final_amplitudes} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
