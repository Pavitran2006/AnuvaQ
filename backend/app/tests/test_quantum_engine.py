"""
AetherQ Quantum Engine Unit Tests
=================================

Tests linear algebra matrix unitaries, state vector evolution, Born probability calculations,
density matrices, Bloch sphere vectors, and foundational quantum algorithms.
"""

import pytest
import numpy as np
from app.quantum_engine import (
    StateVector,
    QuantumGateLibrary,
    QuantumSimulator,
    QuantumAlgorithmLibrary,
    is_unitary,
    kronecker_product,
    multi_kron
)


def test_gate_unitaries():
    """Verify that all standard gate matrices are strictly unitary (U^† U = I)."""
    assert is_unitary(QuantumGateLibrary.H)
    assert is_unitary(QuantumGateLibrary.X)
    assert is_unitary(QuantumGateLibrary.Y)
    assert is_unitary(QuantumGateLibrary.Z)
    assert is_unitary(QuantumGateLibrary.S)
    assert is_unitary(QuantumGateLibrary.T)
    assert is_unitary(QuantumGateLibrary.CNOT)
    assert is_unitary(QuantumGateLibrary.SWAP)
    assert is_unitary(QuantumGateLibrary.TOFFOLI)


def test_state_vector_normalization():
    """Verify that state vector maintains unit norm ⟨ψ|ψ⟩ = 1."""
    sv = StateVector(2)
    assert np.isclose(np.linalg.norm(sv.vector), 1.0)
    
    # Test probabilities sum to 1
    probs = sv.get_probabilities()
    assert np.isclose(np.sum(probs), 1.0)
    assert probs[0] == 1.0  # |00⟩ state


def test_hadamard_superposition():
    """Verify Hadamard gate creates equal superposition H|0⟩ = (|0⟩ + |1⟩)/√2."""
    sim = QuantumSimulator(num_qubits=1)
    sim.apply_gate("H", target_qubit=0)
    probs = sim.state.get_probabilities()
    assert np.isclose(probs[0], 0.5)
    assert np.isclose(probs[1], 0.5)


def test_bell_state_entanglement():
    """Verify Bell state creation |Φ+⟩ = (|00⟩ + |11⟩)/√2."""
    sim = QuantumSimulator(num_qubits=2)
    sim.apply_gate("H", target_qubit=0)
    sim.apply_gate("X", target_qubit=1, control_qubits=[0])  # CNOT
    probs = sim.state.get_probabilities()

    assert np.isclose(probs[0], 0.5)  # |00⟩
    assert np.isclose(probs[1], 0.0)  # |01⟩
    assert np.isclose(probs[2], 0.0)  # |10⟩
    assert np.isclose(probs[3], 0.5)  # |11⟩

    # Entanglement entropy should be 1.0 bit
    entropy = sim.state.calculate_entanglement_entropy([0])
    assert np.isclose(entropy, 1.0, atol=1e-2)


def test_bloch_sphere_coordinates():
    """Verify Bloch sphere projection for |0⟩, |1⟩, and |+⟩ states."""
    # |0⟩ state -> +Z pole (z=1, x=0, y=0)
    sv0 = StateVector(1, initial_state="0")
    bloch0 = sv0.calculate_bloch_vector(0)
    assert np.isclose(bloch0["z"], 1.0)
    assert np.isclose(bloch0["x"], 0.0)

    # |1⟩ state -> -Z pole (z=-1, x=0, y=0)
    sv1 = StateVector(1, initial_state="1")
    bloch1 = sv1.calculate_bloch_vector(0)
    assert np.isclose(bloch1["z"], -1.0)

    # |+⟩ state -> +X axis (x=1, y=0, z=0)
    sim = QuantumSimulator(1)
    sim.apply_gate("H", target_qubit=0)
    bloch_plus = sim.state.calculate_bloch_vector(0)
    assert np.isclose(bloch_plus["x"], 1.0, atol=1e-5)
    assert np.isclose(bloch_plus["z"], 0.0, atol=1e-5)


def test_grover_search_algorithm():
    """Verify 2-qubit Grover's algorithm finds target state '11' with high probability (~1.0)."""
    res = QuantumAlgorithmLibrary.get_grover_search_circuit(target_state="11")
    shots = res["shots_summary"]
    # Basis state '11' should dominate shots (>900 out of 1000)
    assert shots.get("11", 0) > 900


def test_deutsch_jozsa_algorithm():
    """Verify Deutsch-Jozsa algorithm distinguishes constant vs balanced functions."""
    res_const = QuantumAlgorithmLibrary.get_deutsch_jozsa_circuit(is_constant=True)
    res_bal = QuantumAlgorithmLibrary.get_deutsch_jozsa_circuit(is_constant=False)

    assert "Constant" in res_const["result_interpretation"]
    assert "Balanced" in res_bal["result_interpretation"]


def test_zero_norm_stability():
    """Verify that zero/near-zero norm state vector falls back gracefully to ground state |0...0⟩."""
    sv = StateVector(2)
    sv.vector = np.zeros(4, dtype=np.complex128)
    sv.normalize()
    assert np.isclose(sv.vector[0], 1.0)
    assert np.isclose(np.linalg.norm(sv.vector), 1.0)


def test_mixed_state_bloch_purity():
    """Verify reduced density matrix purity Tr(ρ^2) = 0.5 for maximally entangled Bell pair qubit."""
    sim = QuantumSimulator(num_qubits=2)
    sim.apply_gate("H", target_qubit=0)
    sim.apply_gate("X", target_qubit=1, control_qubits=[0])
    bloch0 = sim.state.calculate_bloch_vector(0)
    assert np.isclose(bloch0["purity"], 0.5, atol=1e-2)
    assert np.isclose(bloch0["radius"], 0.0, atol=1e-2)


def test_rotation_and_u_gates():
    """Verify rotation gates RX, RY, RZ and universal U gate unitaries."""
    u_rx = QuantumGateLibrary.rx(np.pi / 4)
    u_ry = QuantumGateLibrary.ry(np.pi / 3)
    u_rz = QuantumGateLibrary.rz(np.pi / 2)
    u_gen = QuantumGateLibrary.u_gate(np.pi / 4, np.pi / 6, np.pi / 3)

    assert is_unitary(u_rx)
    assert is_unitary(u_ry)
    assert is_unitary(u_rz)
    assert is_unitary(u_gen)


def test_invalid_qubit_bounds():
    """Verify ValueError is raised for invalid target/control qubit indices."""
    sim = QuantumSimulator(num_qubits=2)
    with pytest.raises(ValueError):
        sim.apply_gate("H", target_qubit=5)
    with pytest.raises(ValueError):
        sim.apply_gate("X", target_qubit=0, control_qubits=[0])  # Same target and control

