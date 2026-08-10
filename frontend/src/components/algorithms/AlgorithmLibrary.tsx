import React, { useState } from 'react';
import { Zap, Play, CheckCircle2, Atom, Code2, BookOpen } from 'lucide-react';
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
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  paramOptions?: { label: string; value: string }[];
}

const ALGORITHMS: AlgorithmDef[] = [
  {
    id: 'bell-state',
    name: 'Bell State Generator',
    category: 'Entanglement',
    qubits: 2,
    difficulty: 'Beginner',
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
    difficulty: 'Intermediate',
    description: 'Determines whether a hidden oracle function is Constant or Balanced in a single quantum query.',
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
    difficulty: 'Intermediate',
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
    difficulty: 'Advanced',
    description: 'Quantum counterpart of the Discrete Fourier Transform operating on state vector amplitudes.',
    complexity: 'O(N^2)',
  },
  {
    id: 'teleportation',
    name: 'Quantum Teleportation Protocol',
    category: 'Communication',
    qubits: 3,
    difficulty: 'Advanced',
    description: 'Transfers an unknown single-qubit quantum state using an EPR Bell pair and 2 classical channel bits.',
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
    <div className="flex flex-col md:flex-row gap-6 py-4">
      {/* Algorithm Selection Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-3 shrink-0">
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
              className={`p-3.5 rounded-xl border cursor-pointer transition-scientific ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500/50 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-xs text-slate-100 font-mono">{algo.name}</h3>
                <Badge variant={isSelected ? 'cyan' : 'slate'}>{algo.qubits} Qubits</Badge>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{algo.description}</p>
              <div className="flex items-center justify-between mt-2.5 text-[10px] font-mono text-slate-500">
                <span className="text-cyan-400">{algo.difficulty}</span>
                <span>Speedup: {algo.complexity}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Algorithm Execution Stage */}
      <div className="flex-1 flex flex-col gap-5">
        <div className="bg-[#0f172a]/80 border border-slate-800/80 rounded-xl p-5 backdrop-blur-md flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-100 font-mono">{selectedAlgo.name}</h3>
              <Badge variant="cyan">{selectedAlgo.category}</Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{selectedAlgo.description}</p>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-slate-800">
            {selectedAlgo.paramOptions ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-300">Target State / Oracle:</span>
                <select
                  value={selectedParam}
                  onChange={(e) => setSelectedParam(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500/50"
                >
                  {selectedAlgo.paramOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-500">Default settings active</span>
            )}

            <Button
              variant="quantum"
              onClick={handleRun}
              isLoading={isLoading}
              leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            >
              Run Algorithm
            </Button>
          </div>

          {result && (
            <div className="flex flex-col gap-5 pt-2 border-t border-slate-800 animate-fadeIn">
              {result.description && (
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 font-mono text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{result.description}</span>
                </div>
              )}

              <StateHistogram amplitudes={result.final_amplitudes} shotsSummary={result.shots_summary} />
              <StateVectorTable amplitudes={result.final_amplitudes} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
