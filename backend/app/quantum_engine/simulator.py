"""
AetherQ Main Quantum Simulator Engine
======================================

MATHEMATICAL FOUNDATIONS (Interview-Worthy Deep Dive):
1. STATE EVOLUTION PIPELINE:
   Given initial state |ψ_0⟩ and a sequence of M quantum gates with full unitary representations U_1, U_2, ..., U_M:
       |ψ_1⟩ = U_1 |ψ_0⟩
       |ψ_2⟩ = U_2 |ψ_1⟩ = U_2 U_1 |ψ_0⟩
       ...
       |ψ_M⟩ = U_M ... U_1 |ψ_0⟩

2. MID-CIRCUIT MEASUREMENT & STATE VECTOR COLLAPSE:
   When measuring qubit m in the computational basis {|0⟩, |1⟩}, we define projection operators:
       P_0 = I ⊗ ... ⊗ |0⟩⟨0|_m ⊗ ... ⊗ I
       P_1 = I ⊗ ... ⊗ |1⟩⟨1|_m ⊗ ... ⊗ I
   The probability of outcome b ∈ {0, 1} is:
       Pr(m = b) = ⟨ψ| P_b |ψ⟩ = ∑_{i: i_m = b} |α_i|^2
   Upon observing outcome b, the state vector instantaneously collapses to:
       |ψ'⟩ = P_b |ψ⟩ / √(Pr(m = b))

3. SHOT SAMPLING (BORN RULE):
   For Monte Carlo measurement sampling over N_shots runs:
   Each shot samples a computational basis state |k⟩ with probability P(k) = |α_k|^2.
"""

import numpy as np
import random
from typing import List, Dict, Any, Optional
from .state_vector import StateVector
from .gates import QuantumGateLibrary
from .matrix_ops import is_unitary, calculate_fidelity


class QuantumSimulator:
    """
    Executes quantum circuits on state vectors step-by-step, recording state evolution,
    measurement outcomes, density matrices, and Bloch sphere coordinates.
    """

    def __init__(self, num_qubits: int, initial_state: str = None):
        self.num_qubits = num_qubits
        self.state = StateVector(num_qubits, initial_state)
        self.history: List[Dict[str, Any]] = []
        self.measurement_results: Dict[int, int] = {}
        self.step_counter = 0

        # Snapshot initial state
        self._record_snapshot("INITIALIZATION", target_qubits=[], control_qubits=[])

    def apply_gate(
        self, 
        gate_name: str, 
        target_qubit: int, 
        control_qubits: Optional[List[int]] = None,
        params: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Applies a quantum gate to the current state vector.
        Supports 1-qubit, 2-qubit, rotation, and multi-control gates.
        """
        control_qubits = control_qubits or []
        params = params or {}
        gate_name_upper = gate_name.upper()

        if target_qubit < 0 or target_qubit >= self.num_qubits:
            raise ValueError(f"Target qubit index {target_qubit} out of range for {self.num_qubits}-qubit system.")

        for c in control_qubits:
            if c < 0 or c >= self.num_qubits or c == target_qubit:
                raise ValueError(f"Invalid control qubit index {c}.")

        # Retrieve or build gate matrix
        if gate_name_upper == "H":
            base_matrix = QuantumGateLibrary.H
        elif gate_name_upper in ["X", "CX", "CNOT"]:
            base_matrix = QuantumGateLibrary.X
        elif gate_name_upper in ["Y", "CY"]:
            base_matrix = QuantumGateLibrary.Y
        elif gate_name_upper in ["Z", "CZ"]:
            base_matrix = QuantumGateLibrary.Z
        elif gate_name_upper == "S":
            base_matrix = QuantumGateLibrary.S
        elif gate_name_upper == "SDG":
            base_matrix = QuantumGateLibrary.S_DAGGER
        elif gate_name_upper == "T":
            base_matrix = QuantumGateLibrary.T
        elif gate_name_upper == "TDG":
            base_matrix = QuantumGateLibrary.T_DAGGER
        elif gate_name_upper == "RX":
            theta = params.get("theta", np.pi / 2)
            base_matrix = QuantumGateLibrary.rx(theta)
        elif gate_name_upper == "RY":
            theta = params.get("theta", np.pi / 2)
            base_matrix = QuantumGateLibrary.ry(theta)
        elif gate_name_upper == "RZ":
            theta = params.get("theta", np.pi / 2)
            base_matrix = QuantumGateLibrary.rz(theta)
        elif gate_name_upper == "U":
            theta = params.get("theta", 0.0)
            phi = params.get("phi", 0.0)
            lam = params.get("lam", 0.0)
            base_matrix = QuantumGateLibrary.u_gate(theta, phi, lam)
        elif gate_name_upper == "SWAP":
            if len(control_qubits) != 1:
                raise ValueError("SWAP gate requires 1 target qubit and 1 control (second target) qubit.")
            full_matrix = QuantumGateLibrary.get_swap_full_matrix(target_qubit, control_qubits[0], self.num_qubits)
            base_matrix = None
        else:
            raise ValueError(f"Unsupported gate type: {gate_name}")

        # Construct full system matrix
        if gate_name_upper != "SWAP":
            if not control_qubits:
                full_matrix = QuantumGateLibrary.get_single_qubit_full_matrix(base_matrix, target_qubit, self.num_qubits)
            else:
                full_matrix = QuantumGateLibrary.get_controlled_gate_full_matrix(
                    base_matrix, control_qubits, target_qubit, self.num_qubits
                )

        # Apply unitary state evolution: |ψ_new⟩ = U |ψ_old⟩
        self.state.vector = full_matrix @ self.state.vector
        self.state.normalize()
        self.step_counter += 1

        snapshot = self._record_snapshot(
            gate_name_upper, target_qubits=[target_qubit], control_qubits=control_qubits, params=params
        )
        return snapshot

    def measure_qubit(self, target_qubit: int, collapse: bool = True) -> Dict[str, Any]:
        """
        Measures a single qubit according to the Born rule.
        If collapse is True, projects the state vector onto the measured eigenstate.
        """
        if target_qubit < 0 or target_qubit >= self.num_qubits:
            raise ValueError(f"Target qubit index {target_qubit} out of range.")

        probs = self.state.get_probabilities()
        
        # Calculate P(qubit = 0) and P(qubit = 1)
        p0 = 0.0
        p1 = 0.0
        for i in range(self.state.dimension):
            b_str = format(i, f'0{self.num_qubits}b')
            if b_str[target_qubit] == '0':
                p0 += probs[i]
            else:
                p1 += probs[i]

        # Sample outcome
        measured_val = 0 if random.random() < p0 else 1
        self.measurement_results[target_qubit] = measured_val

        if collapse:
            # Construct projection mask
            new_vector = np.zeros(self.state.dimension, dtype=np.complex128)
            norm_factor = np.sqrt(p0) if measured_val == 0 else np.sqrt(p1)

            if norm_factor > 1e-12:
                for i in range(self.state.dimension):
                    b_str = format(i, f'0{self.num_qubits}b')
                    if int(b_str[target_qubit]) == measured_val:
                        new_vector[i] = self.state.vector[i] / norm_factor
                self.state.vector = new_vector

            self.step_counter += 1
            self._record_snapshot(f"MEASURE_Q{target_qubit}", target_qubits=[target_qubit], control_qubits=[])

        return {
            "qubit": target_qubit,
            "measured_value": measured_val,
            "probability_0": round(p0, 6),
            "probability_1": round(p1, 6),
            "collapsed": collapse
        }

    def run_shots(self, shots: int = 1000) -> Dict[str, int]:
        """
        Simulates Monte Carlo measurement sampling over specified shot count based on final state probabilities.
        """
        shots = max(1, min(10000, int(shots)))
        probs = self.state.get_probabilities()
        basis_states = [format(i, f'0{self.num_qubits}b') for i in range(self.state.dimension)]

        # Sample from discrete distribution
        counts_array = np.random.multinomial(shots, probs)
        counts_dict = {}

        for idx, count in enumerate(counts_array):
            if count > 0:
                counts_dict[basis_states[idx]] = int(count)

        return counts_dict

    def _record_snapshot(
        self, 
        action: str, 
        target_qubits: List[int], 
        control_qubits: List[int], 
        params: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Captures full quantum state snapshot for visualizers and debug logs.
        """
        bloch_spheres = [self.state.calculate_bloch_vector(q) for q in range(self.num_qubits)]
        amplitudes = self.state.get_amplitudes()

        snapshot = {
            "step": self.step_counter,
            "action": action,
            "target_qubits": target_qubits,
            "control_qubits": control_qubits,
            "params": params or {},
            "amplitudes": amplitudes,
            "probabilities": [amp["probability"] for amp in amplitudes],
            "bloch_spheres": bloch_spheres,
            "entanglement_entropy": self.state.calculate_entanglement_entropy([0]) if self.num_qubits == 2 else 0.0
        }

        self.history.append(snapshot)
        return snapshot

    def get_execution_summary(self) -> Dict[str, Any]:
        """
        Returns full execution summary for API responses.
        """
        return {
            "num_qubits": self.num_qubits,
            "total_steps": self.step_counter,
            "final_amplitudes": self.state.get_amplitudes(),
            "final_bloch_spheres": [self.state.calculate_bloch_vector(q) for q in range(self.num_qubits)],
            "shots_summary": self.run_shots(1000),
            "step_history": self.history
        }
