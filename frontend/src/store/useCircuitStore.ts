import { create } from 'zustand';
import { GateStep, GateType, SimulationResult } from '../types/quantum';
import { LocalQuantumSimulator } from '../services/localSimulator';
import { api } from '../services/api';

interface CircuitState {
  numQubits: number;
  gates: GateStep[];
  selectedStepId: string | null;
  simulationResult: SimulationResult | null;
  activeHistoryStep: number;
  useBackendSimulator: boolean;
  isSimulating: boolean;
  historyStack: GateStep[][];
  historyIndex: number;

  // Noise Simulation Parameters
  noiseEnabled: boolean;
  noiseModel: string;
  noiseProbability: number;

  // Actions
  setNumQubits: (n: number) => void;
  addGate: (gate: GateType, target: number, stepIndex: number, controls?: number[], params?: { theta?: number; phi?: number; lam?: number }) => void;
  removeGate: (id: string) => void;
  clearCircuit: () => void;
  loadGates: (gates: GateStep[]) => void;
  setSelectedStepId: (id: string | null) => void;
  setUseBackendSimulator: (val: boolean) => void;
  setNoiseEnabled: (val: boolean) => void;
  setNoiseModel: (model: string) => void;
  setNoiseProbability: (p: number) => void;
  setActiveHistoryStep: (step: number) => void;
  runSimulation: () => Promise<void>;
  undo: () => void;
  redo: () => void;
}

export const useCircuitStore = create<CircuitState>((set, get) => ({
  numQubits: 2,
  gates: [
    { id: 'step-0', gate: 'H', target: 0, stepIndex: 0 },
    { id: 'step-1', gate: 'CX', target: 1, controls: [0], stepIndex: 1 },
  ],
  selectedStepId: null,
  simulationResult: null,
  activeHistoryStep: -1,
  useBackendSimulator: false,
  isSimulating: false,
  historyStack: [
    [
      { id: 'step-0', gate: 'H', target: 0, stepIndex: 0 },
      { id: 'step-1', gate: 'CX', target: 1, controls: [0], stepIndex: 1 },
    ],
  ],
  historyIndex: 0,

  noiseEnabled: false,
  noiseModel: 'bit_flip',
  noiseProbability: 0.10,

  setNumQubits: (numQubits) => {
    set({ numQubits: Math.min(8, Math.max(1, numQubits)) });
    get().runSimulation();
  },

  setNoiseEnabled: (noiseEnabled) => {
    set({ noiseEnabled });
    get().runSimulation();
  },

  setNoiseModel: (noiseModel) => {
    set({ noiseModel });
    get().runSimulation();
  },

  setNoiseProbability: (noiseProbability) => {
    set({ noiseProbability });
    get().runSimulation();
  },

  addGate: (gate, target, stepIndex, controls = [], params = {}) => {
    const { gates, historyStack, historyIndex } = get();
    const newGate: GateStep = {
      id: `gate-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      gate,
      target,
      controls,
      params,
      stepIndex,
    };

    const newGates = [...gates, newGate];
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(newGates);
    if (newStack.length > 50) newStack.shift();

    set({
      gates: newGates,
      historyStack: newStack,
      historyIndex: newStack.length - 1,
    });

    get().runSimulation();
  },

  removeGate: (id) => {
    const { gates, historyStack, historyIndex } = get();
    const newGates = gates.filter((g) => g.id !== id);
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(newGates);

    set({
      gates: newGates,
      historyStack: newStack,
      historyIndex: newStack.length - 1,
    });

    get().runSimulation();
  },

  clearCircuit: () => {
    set({ gates: [], historyStack: [[]], historyIndex: 0 });
    get().runSimulation();
  },

  loadGates: (gates) => {
    set({ gates, historyStack: [gates], historyIndex: 0 });
    get().runSimulation();
  },

  setSelectedStepId: (selectedStepId) => set({ selectedStepId }),

  setUseBackendSimulator: (useBackendSimulator) => {
    set({ useBackendSimulator });
    get().runSimulation();
  },

  setActiveHistoryStep: (activeHistoryStep) => set({ activeHistoryStep }),

  undo: () => {
    const { historyIndex, historyStack } = get();
    if (historyIndex > 0) {
      const prevGates = historyStack[historyIndex - 1];
      set({ gates: prevGates, historyIndex: historyIndex - 1 });
      get().runSimulation();
    }
  },

  redo: () => {
    const { historyIndex, historyStack } = get();
    if (historyIndex < historyStack.length - 1) {
      const nextGates = historyStack[historyIndex + 1];
      set({ gates: nextGates, historyIndex: historyIndex + 1 });
      get().runSimulation();
    }
  },

  runSimulation: async () => {
    const { numQubits, gates, useBackendSimulator, noiseEnabled, noiseModel, noiseProbability } = get();
    set({ isSimulating: true });

    try {
      if (useBackendSimulator || noiseEnabled) {
        const payload = {
          num_qubits: numQubits,
          gates: gates.map((g) => ({
            gate: g.gate,
            target: g.target,
            controls: g.controls || [],
            params: g.params || {},
          })),
          shots: 1000,
          noise_enabled: noiseEnabled,
          noise_model: noiseModel,
          noise_probability: noiseProbability,
        };
        const response = await api.post('/simulation/run', payload);
        set({ simulationResult: response.data, isSimulating: false });
      } else {
        // Run fast client-side Local Quantum Simulator
        const result = LocalQuantumSimulator.simulate(numQubits, gates, 1000);
        set({ simulationResult: result, isSimulating: false });
      }
    } catch (err) {
      console.warn('Backend simulator unavailable. Falling back to Local Simulator.', err);
      const result = LocalQuantumSimulator.simulate(numQubits, gates, 1000);
      set({ simulationResult: result, isSimulating: false });
    }
  },
}));
