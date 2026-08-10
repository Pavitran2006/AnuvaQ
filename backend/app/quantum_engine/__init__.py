"""
AnuvaQ Quantum Mechanics & Matrix Simulation Engine.
Provides complex linear algebra state evolution, unitary gate matrices, Born rule measurement collapse,
partial trace density matrices, and OpenQASM interoperability.
"""

from .state_vector import StateVector
from .matrix_ops import kronecker_product, multi_kron, is_unitary, calculate_fidelity, compute_expectation_value
from .gates import QuantumGateLibrary
from .simulator import QuantumSimulator
from .noise_simulator import NoisyQuantumSimulator
from .algorithms import QuantumAlgorithmLibrary
from .qasm_parser import QASMParser
from .qasm_exporter import QASMExporter

__all__ = [
    "StateVector",
    "kronecker_product",
    "multi_kron",
    "is_unitary",
    "calculate_fidelity",
    "compute_expectation_value",
    "QuantumGateLibrary",
    "QuantumSimulator",
    "NoisyQuantumSimulator",
    "QuantumAlgorithmLibrary",
    "QASMParser",
    "QASMExporter",
]
