"""
AnuvaQ Unitary Quantum Gates Library
=====================================

MATHEMATICAL FOUNDATIONS (Interview-Worthy Deep Dive):
1. PAULI MATRICES:
   - I (Identity): Does not alter state.
   - X (Bit-Flip / Quantum NOT): X|0⟩ = |1⟩, X|1⟩ = |0⟩. Matrix: [[0, 1], [1, 0]]
   - Y (Bit & Phase Flip): Y|0⟩ = i|1⟩, Y|1⟩ = -i|0⟩. Matrix: [[0, -i], [i, 0]]
   - Z (Phase-Flip): Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩. Matrix: [[1, 0], [0, -1]]

2. HADAMARD GATE H (Creating Superposition):
   Transform computational basis states into equal-superposition eigenstates of X:
       H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩
       H|1⟩ = (|0⟩ - |1⟩)/√2 = |-⟩
   Matrix: 1/√2 [[1, 1], [1, -1]]

3. ROTATION GATES (Rotation around Bloch sphere axes):
   - RX(θ) = exp(-i θ X / 2) = cos(θ/2) I - i sin(θ/2) X
   - RY(θ) = exp(-i θ Y / 2) = cos(θ/2) I - i sin(θ/2) Y
   - RZ(θ) = exp(-i θ Z / 2) = diag(e^(-i θ/2), e^(i θ/2))

4. CONTROLLED GATES (Entanglement Generation):
   In CNOT (CX), target qubit bit-flips (X gate applied) IF AND ONLY IF control qubit is |1⟩.
   The 4x4 matrix representation in computational basis {|00⟩, |01⟩, |10⟩, |11⟩} is:
       CNOT = [[1, 0, 0, 0],
               [0, 1, 0, 0],
               [0, 0, 0, 1],
               [0, 0, 1, 0]]
"""

import numpy as np
from typing import Dict, Any, List, Optional
from .matrix_ops import kronecker_product, multi_kron


class QuantumGateLibrary:
    """
    Provides exact unitary matrix definitions and multi-qubit tensor expansions for all standard gates.
    """

    # 1-Qubit Basic Gates
    I = np.array([[1, 0], [0, 1]], dtype=np.complex128)
    X = np.array([[0, 1], [1, 0]], dtype=np.complex128)
    Y = np.array([[0, -1j], [1j, 0]], dtype=np.complex128)
    Z = np.array([[1, 0], [0, -1]], dtype=np.complex128)
    H = (1 / np.sqrt(2)) * np.array([[1, 1], [1, -1]], dtype=np.complex128)

    # Phase Gates
    S = np.array([[1, 0], [0, 1j]], dtype=np.complex128)
    S_DAGGER = np.array([[1, 0], [0, -1j]], dtype=np.complex128)
    T = np.array([[1, 0], [0, np.exp(1j * np.pi / 4)]], dtype=np.complex128)
    T_DAGGER = np.array([[1, 0], [0, np.exp(-1j * np.pi / 4)]], dtype=np.complex128)

    # 2-Qubit Gates (standard 0->1 control-target order)
    CNOT = np.array([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 1],
        [0, 0, 1, 0]
    ], dtype=np.complex128)

    CY = np.array([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, -1j],
        [0, 0, 1j, 0]
    ], dtype=np.complex128)

    CZ = np.array([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, -1]
    ], dtype=np.complex128)

    SWAP = np.array([
        [1, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 1]
    ], dtype=np.complex128)

    iSWAP = np.array([
        [1, 0, 0, 0],
        [0, 0, 1j, 0],
        [0, 1j, 0, 0],
        [0, 0, 0, 1]
    ], dtype=np.complex128)

    # 3-Qubit Gates
    TOFFOLI = np.eye(8, dtype=np.complex128)
    TOFFOLI[6, 6] = 0
    TOFFOLI[6, 7] = 1
    TOFFOLI[7, 6] = 1
    TOFFOLI[7, 7] = 0

    @classmethod
    def rx(cls, theta: float) -> np.ndarray:
        """
        Rotation gate RX(θ) = cos(θ/2) I - i sin(θ/2) X.
        """
        c = np.cos(theta / 2.0)
        s = np.sin(theta / 2.0)
        return np.array([[c, -1j * s], [-1j * s, c]], dtype=np.complex128)

    @classmethod
    def ry(cls, theta: float) -> np.ndarray:
        """
        Rotation gate RY(θ) = cos(θ/2) I - i sin(θ/2) Y.
        """
        c = np.cos(theta / 2.0)
        s = np.sin(theta / 2.0)
        return np.array([[c, -s], [s, c]], dtype=np.complex128)

    @classmethod
    def rz(cls, theta: float) -> np.ndarray:
        """
        Rotation gate RZ(θ) = diag(e^(-i θ/2), e^(i θ/2)).
        """
        return np.array([
            [np.exp(-1j * theta / 2.0), 0],
            [0, np.exp(1j * theta / 2.0)]
        ], dtype=np.complex128)

    @classmethod
    def u_gate(cls, theta: float, phi: float, lam: float) -> np.ndarray:
        """
        Universal 1-qubit gate U(θ, φ, λ).
        """
        c = np.cos(theta / 2.0)
        s = np.sin(theta / 2.0)
        return np.array([
            [c, -np.exp(1j * lam) * s],
            [np.exp(1j * phi) * s, np.exp(1j * (phi + lam)) * c]
        ], dtype=np.complex128)

    @classmethod
    def get_base_matrix(cls, gate_name: str, params: Optional[Dict[str, float]] = None) -> np.ndarray:
        """
        Retrieves 2x2 base matrix for standard 1-qubit or rotation gates.
        """
        params = params or {}
        g = gate_name.upper().strip()

        if g == "H":
            return cls.H
        elif g == "X":
            return cls.X
        elif g == "Y":
            return cls.Y
        elif g == "Z":
            return cls.Z
        elif g == "S":
            return cls.S
        elif g == "SDG":
            return cls.S_DAGGER
        elif g == "T":
            return cls.T
        elif g == "TDG":
            return cls.T_DAGGER
        elif g == "RX":
            return cls.rx(params.get("theta", np.pi / 2.0))
        elif g == "RY":
            return cls.ry(params.get("theta", np.pi / 2.0))
        elif g == "RZ":
            return cls.rz(params.get("theta", np.pi / 2.0))
        elif g == "U":
            return cls.u_gate(params.get("theta", 0.0), params.get("phi", 0.0), params.get("lam", 0.0))
        else:
            return cls.X

    @classmethod
    def get_single_qubit_full_matrix(cls, gate_matrix: np.ndarray, target_qubit: int, num_qubits: int) -> np.ndarray:
        """
        Constructs full (2^N x 2^N) unitary operator matrix for a 1-qubit gate acting on target_qubit.
        For N qubits, U_full = I ⊗ ... ⊗ U_target ⊗ ... ⊗ I.
        """
        matrices = []
        for q in range(num_qubits):
            if q == target_qubit:
                matrices.append(gate_matrix)
            else:
                matrices.append(cls.I)
        return multi_kron(matrices)

    @classmethod
    def get_controlled_gate_full_matrix(
        cls, 
        base_gate: np.ndarray, 
        control_qubits: List[int], 
        target_qubit: int, 
        num_qubits: int
    ) -> np.ndarray:
        """
        Constructs full 2^N x 2^N unitary matrix for multi-control controlled unitary:
            U_full = P_0 + P_1 ⊗ U_target
        where P_0 projects onto control != |1...1⟩ (Identity operation),
        and P_1 projects onto control == |1...1⟩ (Applies base_gate on target).
        """
        dimension = 2 ** num_qubits
        full_matrix = np.zeros((dimension, dimension), dtype=np.complex128)

        # Iterate over all computational basis states |i⟩
        for i in range(dimension):
            # Binary string representation
            b_str = format(i, f'0{num_qubits}b')

            # Check if all control qubits are '1'
            all_controls_active = all(b_str[c] == '1' for c in control_qubits)

            if not all_controls_active:
                # Identity action: |i⟩ -> |i⟩
                full_matrix[i, i] += 1.0
            else:
                # Target qubit is modified by 2x2 base_gate
                target_val = int(b_str[target_qubit])
                
                # Base gate action: base_gate |target_val⟩ = ∑_k g_{k, target_val} |k⟩
                for k in range(2):
                    g_coeff = base_gate[k, target_val]
                    if abs(g_coeff) > 1e-12:
                        # Construct output binary string with k in target_qubit position
                        out_list = list(b_str)
                        out_list[target_qubit] = str(k)
                        j = int("".join(out_list), 2)
                        full_matrix[j, i] += g_coeff

        return full_matrix

    @classmethod
    def get_swap_full_matrix(cls, qubit1: int, qubit2: int, num_qubits: int) -> np.ndarray:
        """
        Constructs full 2^N x 2^N unitary matrix swapping states of qubit1 and qubit2.
        """
        dimension = 2 ** num_qubits
        full_matrix = np.zeros((dimension, dimension), dtype=np.complex128)

        for i in range(dimension):
            b_str = list(format(i, f'0{num_qubits}b'))
            # Swap bit values
            b_str[qubit1], b_str[qubit2] = b_str[qubit2], b_str[qubit1]
            j = int("".join(b_str), 2)
            full_matrix[j, i] = 1.0

        return full_matrix
