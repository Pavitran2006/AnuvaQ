"""
Tests for AnuvaQ Noisy Quantum Simulator Engine
==================================================
Verifies Kraus operators, density matrices, trace preservation, purity,
fidelity, Von Neumann entropy, and REST API integration.
"""

import pytest
import math
import numpy as np
from fastapi.testclient import TestClient
from app.main import app
from app.quantum_engine import NoisyQuantumSimulator, QuantumGateLibrary

client = TestClient(app)


def test_kraus_completeness_and_trace_preservation():
    """
    Verifies that for all 5 noise channels, Kraus operators satisfy completeness relation:
        ∑_k E_k^† E_k = I
    """
    channels = ["bit_flip", "phase_flip", "depolarizing", "amplitude_damping", "phase_damping"]
    probabilities = [0.0, 0.05, 0.1, 0.25, 0.5, 0.9, 1.0]

    for model in channels:
        for p in probabilities:
            kraus_ops = NoisyQuantumSimulator.get_kraus_operators(model, p)
            identity_sum = np.zeros((2, 2), dtype=np.complex128)
            for E in kraus_ops:
                identity_sum += E.conj().T @ E

            # Verify ∑ E_k^† E_k = I (Identity matrix)
            np.testing.assert_allclose(
                identity_sum, 
                QuantumGateLibrary.I, 
                atol=1e-6, 
                err_msg=f"Kraus completeness failed for {model} at p={p}"
            )


def test_ideal_vs_noisy_purity_and_fidelity():
    """
    Verifies that ideal simulation maintains Purity = 1.0 and Fidelity = 1.0,
    while noise channel decreases Purity < 1.0 and increases Entropy > 0.0.
    """
    # 2-qubit system
    sim_ideal = NoisyQuantumSimulator(2)
    # Apply Hadamard gate to q0: |00⟩ -> (|0⟩+|1⟩)/√2 ⊗ |0⟩
    H_full = QuantumGateLibrary.get_single_qubit_full_matrix(QuantumGateLibrary.H, 0, 2)
    sim_ideal.apply_unitary(H_full)

    # Ideal state purity must be 1.0
    assert sim_ideal.compute_purity() == 1.0
    assert sim_ideal.compute_entropy() == 0.0

    # Noisy simulation with Depolarizing noise
    sim_noisy = NoisyQuantumSimulator(2)
    sim_noisy.apply_unitary(H_full)
    sim_noisy.apply_noise_channel("depolarizing", p=0.2, target_qubit=0)

    # Purity must drop below 1.0 and Entropy must increase
    purity_noisy = sim_noisy.compute_purity()
    entropy_noisy = sim_noisy.compute_entropy()
    fidelity = NoisyQuantumSimulator.compute_fidelity(sim_ideal.rho, sim_noisy.rho)
    trace_dist = NoisyQuantumSimulator.compute_trace_distance(sim_ideal.rho, sim_noisy.rho)

    assert purity_noisy < 1.0
    assert entropy_noisy > 0.0
    assert 0.0 < fidelity < 1.0
    assert trace_dist > 0.0


def test_probability_conservation():
    """
    Verifies that measurement probabilities sum to 1.0 for all noise models.
    """
    channels = ["bit_flip", "phase_flip", "depolarizing", "amplitude_damping", "phase_damping"]
    for model in channels:
        sim = NoisyQuantumSimulator(2)
        H_full = QuantumGateLibrary.get_single_qubit_full_matrix(QuantumGateLibrary.H, 0, 2)
        sim.apply_unitary(H_full)
        sim.apply_noise_channel(model, p=0.3, target_qubit=0)

        probs = sim.get_probabilities()
        assert math.isclose(np.sum(probs), 1.0, abs_tol=1e-6)


def test_shrunken_bloch_vector_length():
    """
    Verifies that noise shrinks the single-qubit Bloch vector length r < 1.0.
    """
    sim = NoisyQuantumSimulator(1)
    # Apply Hadamard to get state on equator (x=1, y=0, z=0, r=1)
    sim.apply_unitary(QuantumGateLibrary.H)
    bv_ideal = sim.get_bloch_vector(0)
    assert math.isclose(bv_ideal["length"], 1.0, abs_tol=1e-5)

    # Apply Amplitude Damping noise
    sim.apply_noise_channel("amplitude_damping", p=0.4, target_qubit=0)
    bv_noisy = sim.get_bloch_vector(0)
    assert bv_noisy["length"] < 1.0


def test_simulation_api_with_noise():
    """
    Tests POST /api/simulation/run with noise_enabled=True.
    """
    payload = {
        "num_qubits": 2,
        "gates": [
            {"gate": "H", "target": 0},
            {"gate": "CX", "target": 1, "controls": [0]}
        ],
        "shots": 1000,
        "noise_enabled": True,
        "noise_model": "depolarizing",
        "noise_probability": 0.15
    }

    res = client.post("/api/simulation/run", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["noise_enabled"] is True
    assert data["noise_model"] == "depolarizing"
    assert data["noise_probability"] == 0.15
    assert "noisy_probabilities" in data
    assert "noisy_bloch_spheres" in data
    assert "quantum_metrics" in data

    metrics = data["quantum_metrics"]
    assert "fidelity" in metrics
    assert "purity" in metrics
    assert "entropy" in metrics
    assert "trace_distance" in metrics
    assert metrics["fidelity"] < 1.0
