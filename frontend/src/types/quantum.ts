export type GateType = 
  | 'H' | 'X' | 'Y' | 'Z' 
  | 'S' | 'SDG' | 'T' | 'TDG' 
  | 'RX' | 'RY' | 'RZ' | 'U' 
  | 'CX' | 'CY' | 'CZ' | 'SWAP' | 'CCX' | 'CSWAP'
  | 'MEASURE';

export interface GateStep {
  id: string;
  gate: GateType;
  target: number;
  controls?: number[];
  params?: {
    theta?: number;
    phi?: number;
    lam?: number;
  };
  stepIndex: number;
}

export interface BasisAmplitude {
  index: number;
  basis: string;
  binary: string;
  real: number;
  imag: number;
  magnitude: number;
  probability: number;
  phase_rad: number;
  phase_deg: number;
}

export interface BlochVector {
  qubit: number;
  x: number;
  y: number;
  z: number;
  radius: number;
  theta_rad: number;
  theta_deg: number;
  phi_rad: number;
  phi_deg: number;
  purity: number;
}

export interface StepSnapshot {
  step: number;
  action: string;
  target_qubits: number[];
  control_qubits: number[];
  amplitudes: BasisAmplitude[];
  probabilities: number[];
  bloch_spheres: BlochVector[];
  entanglement_entropy?: number;
}

export interface QuantumMetrics {
  fidelity: number;
  purity: number;
  entropy: number;
  trace_distance: number;
  noise_strength: number;
}

export interface SimulationResult {
  num_qubits: number;
  total_steps: number;
  final_amplitudes: BasisAmplitude[];
  final_bloch_spheres: BlochVector[];
  shots_summary: Record<string, number>;
  step_history: StepSnapshot[];
  algorithm_name?: string;
  description?: string;
  noise_enabled?: boolean;
  noise_model?: string;
  noise_probability?: number;
  noisy_probabilities?: number[];
  noisy_bloch_spheres?: { x: number; y: number; z: number; length: number; theta: number; phi: number }[];
  noisy_density_matrix?: { real: number[][]; imag: number[][] };
  quantum_metrics?: QuantumMetrics;
}

export interface QuantumAlgorithm {
  id: string;
  name: string;
  category: string;
  qubits: number;
  description: string;
  complexity: string;
}

export interface CircuitProject {
  id: string;
  name: string;
  description?: string;
  num_qubits: number;
  gates_json: string;
  qasm_code?: string;
  workspace_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}
