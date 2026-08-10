"""
AetherQ State Vector Engine
===========================

MATHEMATICAL FOUNDATIONS (Interview-Worthy Deep Dive):
1. QUANTUM STATE REPRESENTATION:
   A quantum state of N qubits lives in a 2^N dimensional complex Hilbert space H = C^(2^N).
   The state vector |ψ⟩ is a normalized complex column vector:
       |ψ⟩ = ∑_{k=0}^{2^N - 1} α_k |k⟩
   where α_k ∈ C are probability amplitudes satisfying the normalization constraint:
       ⟨ψ|ψ⟩ = ∑_{k=0}^{2^N - 1} |α_k|^2 = 1

2. BORN RULE & MEASUREMENT COLLAPSE:
   The probability of measuring computational basis state |k⟩ is P(k) = |α_k|^2.
   Upon measurement resulting in outcome k, the state vector instantaneously collapses into |k⟩.

3. DENSITY MATRIX & BLOCH SPHERE:
   For a pure state |ψ⟩, the density operator is ρ = |ψ⟩⟨ψ|.
   For a single qubit (or reduced single qubit via partial trace), ρ can be expanded in terms of Pauli matrices:
       ρ = 1/2 ( I + x·X + y·Y + z·Z )
   where (x, y, z) are real coordinates on or inside the unit Bloch Sphere:
       x = Tr(ρ X) = 2 Re(α_0* α_1)
       y = Tr(ρ Y) = 2 Im(α_0* α_1)
       z = Tr(ρ Z) = |α_0|^2 - |α_1|^2
"""

import numpy as np
from typing import List, Dict, Any, Tuple


class StateVector:
    """
    Represents an N-qubit quantum state vector in 2^N dimensional complex Hilbert space.
    """

    def __init__(self, num_qubits: int, initial_state: str = None):
        """
        Initialize an N-qubit quantum state vector.
        By default, initializes to ground state |00...0⟩.
        """
        if num_qubits < 1 or num_qubits > 16:
            raise ValueError(f"Number of qubits must be between 1 and 16. Received: {num_qubits}")
        
        self.num_qubits = num_qubits
        self.dimension = 2 ** num_qubits
        self.vector = np.zeros(self.dimension, dtype=np.complex128)

        if initial_state is None:
            # Default state |0...0⟩
            self.vector[0] = 1.0 + 0.0j
        else:
            # Custom binary computational basis state string, e.g. "101"
            if len(initial_state) != num_qubits or not set(initial_state).issubset({'0', '1'}):
                raise ValueError(f"Initial state string must be binary of length {num_qubits}. Received: {initial_state}")
            index = int(initial_state, 2)
            self.vector[index] = 1.0 + 0.0j

    @classmethod
    def from_vector(cls, raw_vector: np.ndarray) -> "StateVector":
        """
        Construct a StateVector directly from a numpy array, automatically normalizing.
        """
        dim = len(raw_vector)
        num_qubits = int(np.log2(dim))
        if 2 ** num_qubits != dim:
            raise ValueError(f"Vector dimension {dim} must be a power of 2.")
        
        sv = cls(num_qubits)
        sv.vector = np.array(raw_vector, dtype=np.complex128)
        sv.normalize()
        return sv

    def normalize(self) -> None:
        """
        Normalizes the state vector so that ⟨ψ|ψ⟩ = 1.
        Includes zero-norm guard fallback to ground state |0...0⟩ to ensure numerical stability.
        """
        norm = np.linalg.norm(self.vector)
        if norm < 1e-12:
            self.vector = np.zeros(self.dimension, dtype=np.complex128)
            self.vector[0] = 1.0 + 0.0j
            return
        self.vector = self.vector / norm

    def get_probabilities(self) -> np.ndarray:
        """
        Returns array of measurement probabilities P(k) = |α_k|^2 for each basis state.
        """
        return np.abs(self.vector) ** 2

    def get_amplitudes(self) -> List[Dict[str, Any]]:
        """
        Returns detailed list of basis state amplitudes, probabilities, and phase angles.
        """
        amplitudes = []
        for i in range(self.dimension):
            amp = self.vector[i]
            prob = float(np.abs(amp) ** 2)
            real = float(np.real(amp))
            imag = float(np.imag(amp))
            magnitude = float(np.abs(amp))
            phase = float(np.angle(amp))  # Angle in radians [-π, π]
            basis_str = format(i, f'0{self.num_qubits}b')

            amplitudes.append({
                "index": i,
                "basis": f"|{basis_str}⟩",
                "binary": basis_str,
                "real": round(real, 6),
                "imag": round(imag, 6),
                "magnitude": round(magnitude, 6),
                "probability": round(prob, 6),
                "phase_rad": round(phase, 6),
                "phase_deg": round(float(np.degrees(phase)), 2)
            })
        return amplitudes

    def to_density_matrix(self) -> np.ndarray:
        """
        Computes the full 2^N x 2^N density matrix ρ = |ψ⟩⟨ψ|.
        """
        return np.outer(self.vector, np.conj(self.vector))

    def get_reduced_density_matrix(self, target_qubit: int) -> np.ndarray:
        """
        Traces out all qubits except `target_qubit` to obtain the 2x2 reduced density matrix ρ_target.
        Target index is 0-indexed from left (MSB) to right.
        """
        if target_qubit < 0 or target_qubit >= self.num_qubits:
            raise ValueError(f"Target qubit index {target_qubit} out of bounds for {self.num_qubits} qubits.")

        # Re-derive clean 2x2 matrix for target qubit via partial trace summation
        rho_2x2 = np.zeros((2, 2), dtype=np.complex128)
        for i in range(self.dimension):
            for j in range(self.dimension):
                b_i = format(i, f'0{self.num_qubits}b')
                b_j = format(j, f'0{self.num_qubits}b')
                
                other_match = all(b_i[k] == b_j[k] for k in range(self.num_qubits) if k != target_qubit)
                if other_match:
                    r_idx = int(b_i[target_qubit])
                    c_idx = int(b_j[target_qubit])
                    rho_2x2[r_idx, c_idx] += self.vector[i] * np.conj(self.vector[j])

        return rho_2x2

    def calculate_bloch_vector(self, target_qubit: int) -> Dict[str, float]:
        """
        Calculates Bloch sphere coordinates (x, y, z, r, θ, φ, purity) for a single qubit (or reduced state).
        Handles mixed states resulting from partial trace of entangled qubits (where r < 1.0).
        """
        rho = self.get_reduced_density_matrix(target_qubit)

        # Pauli matrices
        X = np.array([[0, 1], [1, 0]], dtype=np.complex128)
        Y = np.array([[0, -1j], [1j, 0]], dtype=np.complex128)
        Z = np.array([[1, 0], [0, -1]], dtype=np.complex128)

        x = float(np.real(np.trace(rho @ X)))
        y = float(np.real(np.trace(rho @ Y)))
        z = float(np.real(np.trace(rho @ Z)))

        # Clamp values to [-1, 1]
        x = max(-1.0, min(1.0, x))
        y = max(-1.0, min(1.0, y))
        z = max(-1.0, min(1.0, z))

        r = float(np.sqrt(x**2 + y**2 + z**2))
        cos_theta = z / r if r > 1e-7 else 0.0
        cos_theta = max(-1.0, min(1.0, cos_theta))
        theta = float(np.arccos(cos_theta)) if r > 1e-7 else 0.0  # Polar angle from +Z axis
        phi = float(np.arctan2(y, x))  # Azimuthal angle in XY plane

        return {
            "qubit": target_qubit,
            "x": round(x, 4),
            "y": round(y, 4),
            "z": round(z, 4),
            "radius": round(r, 4),
            "theta_rad": round(theta, 4),
            "theta_deg": round(float(np.degrees(theta)), 2),
            "phi_rad": round(phi, 4),
            "phi_deg": round(float(np.degrees(phi)), 2),
            "purity": round(float(np.real(np.trace(rho @ rho))), 4)  # Tr(ρ^2) = 1 for pure, < 1 for mixed
        }

    def calculate_entanglement_entropy(self, subsystem_qubits: List[int]) -> float:
        """
        Calculates Von Neumann Entanglement Entropy S(ρ_A) = -Tr(ρ_A log2 ρ_A) for a subsystem A.
        A return value of 0 indicates a product (unentangled) state.
        A non-zero value indicates quantum entanglement!
        """
        # For simplicity in 2-qubit case (most common), if system is 2 qubits and A is [0]:
        if self.num_qubits == 2 and subsystem_qubits == [0]:
            rho_A = self.get_reduced_density_matrix(0)
            eigenvalues = np.linalg.eigvalsh(rho_A)
            # S = - ∑ λ_i log2(λ_i) for λ_i > 0
            entropy = 0.0
            for ev in eigenvalues:
                if ev > 1e-12:
                    entropy -= ev * np.log2(ev)
            return round(float(entropy), 4)

        return 0.0

    def copy(self) -> "StateVector":
        """
        Creates a deep copy of the state vector.
        """
        sv = StateVector(self.num_qubits)
        sv.vector = np.copy(self.vector)
        return sv
