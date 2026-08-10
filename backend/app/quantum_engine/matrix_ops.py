"""
AnuvaQ Matrix & Linear Algebra Operations
==========================================

MATHEMATICAL FOUNDATIONS (Interview-Worthy Deep Dive):
1. KRONECKER (TENSOR) PRODUCT A ⊗ B:
   When combining independent quantum subsystems (e.g. Qubit A in state |ψ_A⟩ and Qubit B in state |ψ_B⟩),
   the joint state vector lives in tensor product space H_AB = H_A ⊗ H_B:
       |ψ_AB⟩ = |ψ_A⟩ ⊗ |ψ_B⟩
   Similarly, when independent single-qubit unitary operations U_A and U_B act on qubits A and B,
   the composite unitary matrix is U_AB = U_A ⊗ U_B.

   If A is m x n and B is p x q, then A ⊗ B is (mp) x (nq):
       A ⊗ B = [ a_11 B   a_12 B  ... ]
               [ a_21 B   a_22 B  ... ]

2. UNITARY MATRICES:
   A matrix U is unitary if U^† U = U U^† = I, where U^† is the conjugate transpose (Hermitian adjoint).
   Unitary operators preserve state normalization:
       || U|ψ⟩ ||^2 = ⟨ψ| U^† U |ψ⟩ = ⟨ψ| I |ψ⟩ = || |ψ⟩ ||^2 = 1

3. QUANTUM STATE FIDELITY:
   Fidelity F(|ψ⟩, |ϕ⟩) measures overlap between two quantum states:
       F = |⟨ψ|ϕ⟩|^2
   F = 1 for identical states; F = 0 for orthogonal states.
"""

import numpy as np
from typing import List


def kronecker_product(A: np.ndarray, B: np.ndarray) -> np.ndarray:
    """
    Computes the Kronecker (tensor) product A ⊗ B.
    """
    return np.kron(A, B)


def multi_kron(matrices: List[np.ndarray]) -> np.ndarray:
    """
    Computes the tensor product of a list of matrices: M_1 ⊗ M_2 ⊗ ... ⊗ M_k.
    """
    if not matrices:
        raise ValueError("Matrix list for tensor product cannot be empty.")
    
    result = matrices[0]
    for M in matrices[1:]:
        result = np.kron(result, M)
    return result


def is_unitary(U: np.ndarray, atol: float = 1e-6) -> bool:
    """
    Checks whether a matrix U is unitary: U^† U ≈ I.
    """
    if U.shape[0] != U.shape[1]:
        return False
    
    n = U.shape[0]
    U_dagger = np.conj(U.T)
    identity = np.eye(n, dtype=np.complex128)
    
    return bool(np.allclose(U_dagger @ U, identity, atol=atol))


def calculate_fidelity(state_a: np.ndarray, state_b: np.ndarray) -> float:
    """
    Calculates pure state quantum fidelity F = |⟨ψ_A|ψ_B⟩|^2.
    """
    inner_product = np.vdot(state_a, state_b)  # ⟨ψ_A|ψ_B⟩
    return float(np.abs(inner_product) ** 2)


def compute_expectation_value(state_vector: np.ndarray, observable: np.ndarray) -> float:
    """
    Computes expectation value ⟨ψ| O |ψ⟩ for a Hermitian observable matrix O.
    """
    val = np.vdot(state_vector, observable @ state_vector)
    return float(np.real(val))
