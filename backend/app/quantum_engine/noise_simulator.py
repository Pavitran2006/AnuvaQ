"""
AnuvaQ Noisy Quantum Simulator Engine
========================================

MATHEMATICAL FOUNDATIONS (Density Matrices & Kraus Operators):
1. DENSITY MATRIX REPRESENTATION:
   A quantum system of N qubits is described by a density operator ρ ∈ ℂ^(2^N × 2^N).
   For a pure initial state |ψ_0⟩, the initial density matrix is:
       ρ_0 = |ψ_0⟩⟨ψ_0|

2. UNITARY GATE EVOLUTION:
   Applying an ideal unitary gate U to density matrix ρ:
       ρ' = U ρ U^†

3. KRAUS OPERATOR NOISE CHANNELS:
   A noisy quantum channel E is a Completely Positive Trace-Preserving (CPTP) map defined by Kraus operators {E_k}:
       E(ρ) = ∑_k E_k ρ E_k^†,   where ∑_k E_k^† E_k = I

   NOISE MODELS SUPPORTED (noise_probability p ∈ [0, 1]):
   - Bit Flip: E_0 = √(1-p) I,  E_1 = √p X
   - Phase Flip: E_0 = √(1-p) I,  E_1 = √p Z
   - Depolarizing: E_0 = √(1 - 3p/4) I,  E_1 = √(p/4) X,  E_2 = √(p/4) Y,  E_3 = √(p/4) Z
   - Amplitude Damping: E_0 = [[1, 0], [0, √(1-p)]],  E_1 = [[0, √p], [0, 0]]
   - Phase Damping: E_0 = [[1, 0], [0, √(1-p)]],  E_1 = [[0, 0], [0, √p]]

4. QUANTUM INFORMATION METRICS:
   - Purity: P(ρ) = Tr(ρ^2)
   - Fidelity: F(ρ_ideal, ρ_noisy) = Tr(ρ_ideal ρ_noisy)
   - Von Neumann Entropy: S(ρ) = -Tr(ρ log_2 ρ) = -∑ λ_i log_2 λ_i
   - Trace Distance: D(ρ_ideal, ρ_noisy) = (1/2) Tr|ρ_ideal - ρ_noisy|
   - Single-qubit Bloch Vector: (r_x, r_y, r_z) where r_i = Tr(ρ_q σ_i), length r = √(r_x^2 + r_y^2 + r_z^2)
"""

import numpy as np
import math
from typing import List, Dict, Any, Optional, Tuple
from .gates import QuantumGateLibrary
from .state_vector import StateVector


class NoisyQuantumSimulator:
    """
    Simulates quantum circuits using density matrix mechanics ρ and Kraus noise channels.
    Calculates Fidelity, Purity, Von Neumann Entropy, and Trace Distance.
    """

    def __init__(self, num_qubits: int, initial_state: Optional[str] = None):
        self.num_qubits = num_qubits
        self.dimension = 2 ** num_qubits

        # Initialize pure state vector |ψ_0⟩
        sv = StateVector(num_qubits, initial_state)
        psi = sv.vector.reshape(-1, 1)

        # Construct initial density matrix ρ_0 = |ψ_0⟩⟨ψ_0|
        self.rho = psi @ psi.conj().T

    @staticmethod
    def get_kraus_operators(noise_model: str, p: float) -> List[np.ndarray]:
        """
        Returns single-qubit Kraus operators {E_k} for the specified noise model and probability p.
        Guarantees trace preservation: ∑ E_k^† E_k = I
        """
        p = max(0.0, min(1.0, float(p)))
        model = noise_model.lower().strip()

        I = QuantumGateLibrary.I
        X = QuantumGateLibrary.X
        Y = QuantumGateLibrary.Y
        Z = QuantumGateLibrary.Z

        if p == 0.0 or model in ["none", "ideal"]:
            return [I]

        if model == "bit_flip":
            # E_0 = √(1-p) I, E_1 = √p X
            return [
                np.sqrt(1.0 - p) * I,
                np.sqrt(p) * X
            ]

        elif model == "phase_flip":
            # E_0 = √(1-p) I, E_1 = √p Z
            return [
                np.sqrt(1.0 - p) * I,
                np.sqrt(p) * Z
            ]

        elif model == "depolarizing":
            # E_0 = √(1 - 3p/4) I, E_1 = √(p/4) X, E_2 = √(p/4) Y, E_3 = √(p/4) Z
            return [
                np.sqrt(1.0 - 0.75 * p) * I,
                np.sqrt(0.25 * p) * X,
                np.sqrt(0.25 * p) * Y,
                np.sqrt(0.25 * p) * Z
            ]

        elif model == "amplitude_damping":
            # E_0 = [[1, 0], [0, √(1-p)]], E_1 = [[0, √p], [0, 0]]
            E0 = np.array([[1.0, 0.0], [0.0, np.sqrt(1.0 - p)]], dtype=np.complex128)
            E1 = np.array([[0.0, np.sqrt(p)], [0.0, 0.0]], dtype=np.complex128)
            return [E0, E1]

        elif model == "phase_damping":
            # E_0 = [[1, 0], [0, √(1-p)]], E_1 = [[0, 0], [0, √p]]
            E0 = np.array([[1.0, 0.0], [0.0, np.sqrt(1.0 - p)]], dtype=np.complex128)
            E1 = np.array([[0.0, 0.0], [0.0, np.sqrt(p)]], dtype=np.complex128)
            return [E0, E1]

        else:
            raise ValueError(f"Unsupported noise model '{noise_model}'.")

    def apply_unitary(self, full_unitary: np.ndarray):
        """
        Evolves density matrix unitarily: ρ → U ρ U^†
        """
        self.rho = full_unitary @ self.rho @ full_unitary.conj().T

    def apply_noise_channel(self, noise_model: str, p: float, target_qubit: int):
        """
        Applies Kraus noise channel {E_k} to specified target qubit:
            ρ → ∑_k (E_k ⊗ I) ρ (E_k ⊗ I)^†
        """
        kraus_ops = self.get_kraus_operators(noise_model, p)
        if len(kraus_ops) == 1 and np.array_equal(kraus_ops[0], QuantumGateLibrary.I):
            return

        new_rho = np.zeros_like(self.rho, dtype=np.complex128)
        for E in kraus_ops:
            # Embed single-qubit Kraus operator into full N-qubit Hilbert space
            E_full = QuantumGateLibrary.get_single_qubit_full_matrix(E, target_qubit, self.num_qubits)
            new_rho += E_full @ self.rho @ E_full.conj().T

        self.rho = new_rho

    def get_probabilities(self) -> np.ndarray:
        """
        Returns measurement probability distribution P(k) = Re(ρ_kk).
        Enforces non-negativity and normalization ∑ P(k) = 1.
        """
        probs = np.real(np.diag(self.rho))
        probs = np.maximum(0.0, probs)
        total = np.sum(probs)
        if total > 1e-12:
            probs /= total
        return probs

    def get_reduced_density_matrix(self, target_qubit: int) -> np.ndarray:
        """
        Traces out all qubits except target_qubit to produce 2x2 reduced density matrix ρ_q.
        """
        rho_q = np.zeros((2, 2), dtype=np.complex128)

        for i in range(self.dimension):
            for j in range(self.dimension):
                b_i = format(i, f'0{self.num_qubits}b')
                b_j = format(j, f'0{self.num_qubits}b')

                # Match non-target bits for partial trace
                match = True
                for q in range(self.num_qubits):
                    if q != target_qubit and b_i[q] != b_j[q]:
                        match = False
                        break

                if match:
                    r_idx = int(b_i[target_qubit])
                    c_idx = int(b_j[target_qubit])
                    rho_q[r_idx, c_idx] += self.rho[i, j]

        return rho_q

    def get_bloch_vector(self, target_qubit: int) -> Dict[str, float]:
        """
        Calculates Bloch sphere coordinates (x, y, z) and vector length r for mixed state ρ_q.
        r_x = 2 Re(ρ_01)
        r_y = 2 Im(ρ_10)
        r_z = ρ_00 - ρ_11
        r = √(r_x^2 + r_y^2 + r_z^2)
        """
        rho_q = self.get_reduced_density_matrix(target_qubit)
        x = float(2.0 * np.real(rho_q[0, 1]))
        y = float(2.0 * np.imag(rho_q[1, 0]))
        z = float(np.real(rho_q[0, 0] - rho_q[1, 1]))
        length = float(np.sqrt(x**2 + y**2 + z**2))

        # Spherical coordinates
        theta = float(np.arccos(np.clip(z / (length + 1e-12), -1.0, 1.0)))
        phi = float(np.arctan2(y, x))

        return {
            "x": round(x, 6),
            "y": round(y, 6),
            "z": round(z, 6),
            "length": round(length, 6),
            "theta": round(theta, 6),
            "phi": round(phi, 6)
        }

    def compute_purity(self) -> float:
        """
        Calculates purity P(ρ) = Tr(ρ^2).
        For pure states P = 1; for mixed states P < 1.
        """
        rho_sq = self.rho @ self.rho
        purity = float(np.real(np.trace(rho_sq)))
        return round(max(0.0, min(1.0, purity)), 6)

    def compute_entropy(self) -> float:
        """
        Calculates Von Neumann entropy S(ρ) = -Tr(ρ log_2 ρ) = -∑ λ_i log_2 λ_i.
        """
        eigenvalues = np.real(np.linalg.eigvalsh(self.rho))
        entropy = 0.0
        for lam in eigenvalues:
            if lam > 1e-12:
                entropy -= lam * np.log2(lam)
        return round(max(0.0, entropy), 6)

    @staticmethod
    def compute_fidelity(rho_ideal: np.ndarray, rho_noisy: np.ndarray) -> float:
        """
        Calculates quantum state fidelity F(ρ_ideal, ρ_noisy) = Tr(ρ_ideal ρ_noisy).
        For pure ideal state |ψ_ideal⟩, F = ⟨ψ_ideal| ρ_noisy |ψ_ideal⟩.
        """
        fidelity = float(np.real(np.trace(rho_ideal @ rho_noisy)))
        return round(max(0.0, min(1.0, fidelity)), 6)

    @staticmethod
    def compute_trace_distance(rho_ideal: np.ndarray, rho_noisy: np.ndarray) -> float:
        """
        Calculates trace distance D(ρ_ideal, ρ_noisy) = (1/2) Tr|ρ_ideal - ρ_noisy|.
        """
        diff = rho_ideal - rho_noisy
        # Singular values of Hermitian matrix equal absolute eigenvalues
        eigvals = np.abs(np.real(np.linalg.eigvalsh(diff)))
        dist = float(0.5 * np.sum(eigvals))
        return round(max(0.0, min(1.0, dist)), 6)

    def get_density_matrix_dict(self) -> Dict[str, List[List[float]]]:
        """
        Returns JSON-serializable real and imaginary components of density matrix ρ.
        """
        return {
            "real": np.real(self.rho).tolist(),
            "imag": np.imag(self.rho).tolist()
        }
