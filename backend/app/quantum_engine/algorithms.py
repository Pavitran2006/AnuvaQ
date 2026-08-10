"""
AnuvaQ Standard Quantum Algorithms Library
===========================================

MATHEMATICAL FOUNDATIONS (Interview-Worthy Deep Dive):
1. DEUTSCH-JOZSA ALGORITHM:
   Determines whether a hidden black-box function f: {0,1}^n -> {0,1} is CONSTANT (outputs same value for all inputs)
   or BALANCED (outputs 0 for half of inputs, 1 for other half) using ONLY A SINGLE EVALUATION (versus 2^(n-1)+1 classically).
   
2. GROVER'S SEARCH ALGORITHM:
   Finds a unique marked item x* in an unsorted database of N = 2^n items in O(√N) steps using:
     a) Superposition state: |s⟩ = H^⊗n |0⟩
     b) Oracle reflection: U_ω = I - 2 |x*⟩⟨x*| (flips phase of marked state)
     c) Diffuser reflection: U_s = 2 |s⟩⟨s| - I (inverts amplitudes about average)

3. QUANTUM TELEPORTATION PROTOCOL:
   Transfers an unknown single-qubit quantum state |ψ⟩ = α|0⟩ + β|1⟩ from Alice to Bob using:
     - 1 pre-shared Bell pair (|Φ^+⟩ = (|00⟩+|11⟩)/√2)
     - 2 classical bits of communication
"""

import numpy as np
from typing import Dict, Any, List
from .simulator import QuantumSimulator


class QuantumAlgorithmLibrary:
    """
    Pre-configured implementations of foundational quantum algorithms.
    """

    @staticmethod
    def get_bell_state_circuit(bell_index: int = 0) -> Dict[str, Any]:
        """
        Generates circuit for 1 of 4 maximally entangled Bell states:
          0: |Φ+⟩ = (|00⟩ + |11⟩) / √2  (H q0, CNOT q0->q1)
          1: |Φ-⟩ = (|00⟩ - |11⟩) / √2  (X q0, H q0, CNOT q0->q1)
          2: |Ψ+⟩ = (|01⟩ + |10⟩) / √2  (X q1, H q0, CNOT q0->q1)
          3: |Ψ-⟩ = (|01⟩ - |10⟩) / √2  (X q0, X q1, H q0, CNOT q0->q1)
        """
        sim = QuantumSimulator(num_qubits=2)

        if bell_index == 1:  # |Φ-⟩
            sim.apply_gate("X", target_qubit=0)
        elif bell_index == 2:  # |Ψ+⟩
            sim.apply_gate("X", target_qubit=1)
        elif bell_index == 3:  # |Ψ-⟩
            sim.apply_gate("X", target_qubit=0)
            sim.apply_gate("X", target_qubit=1)

        sim.apply_gate("H", target_qubit=0)
        sim.apply_gate("X", target_qubit=1, control_qubits=[0])  # CNOT

        summary = sim.get_execution_summary()
        summary["algorithm_name"] = "Bell State Generator"
        summary["description"] = f"Bell State index {bell_index}"
        return summary

    @staticmethod
    def get_deutsch_jozsa_circuit(is_constant: bool = False) -> Dict[str, Any]:
        """
        Deutsch-Jozsa 2-qubit algorithm:
          q0: Input qubit
          q1: Ancilla qubit (initialized to |1⟩)
        """
        sim = QuantumSimulator(num_qubits=2, initial_state="01")

        # Step 1: Create superposition in input & ancilla
        sim.apply_gate("H", target_qubit=0)
        sim.apply_gate("H", target_qubit=1)

        # Step 2: Apply Oracle U_f
        if is_constant:
            # Constant f(x) = 0 (Do nothing) or f(x) = 1 (X on q1)
            pass  # f(x) = 0
        else:
            # Balanced f(x) = x -> CNOT q0 -> q1
            sim.apply_gate("X", target_qubit=1, control_qubits=[0])

        # Step 3: Apply Hadamard to input qubit
        sim.apply_gate("H", target_qubit=0)

        # Step 4: Measure input qubit
        meas = sim.measure_qubit(target_qubit=0, collapse=True)

        summary = sim.get_execution_summary()
        summary["algorithm_name"] = "Deutsch-Jozsa Algorithm"
        summary["oracle_type"] = "Constant" if is_constant else "Balanced"
        summary["result_interpretation"] = "Function is Constant (Measured 0)" if meas["measured_value"] == 0 else "Function is Balanced (Measured 1)"
        return summary

    @staticmethod
    def get_grover_search_circuit(target_state: str = "11") -> Dict[str, Any]:
        """
        2-Qubit Grover's Search for target state in {"00", "01", "10", "11"}.
        """
        sim = QuantumSimulator(num_qubits=2, initial_state="00")

        # Step 1: Equal superposition
        sim.apply_gate("H", target_qubit=0)
        sim.apply_gate("H", target_qubit=1)

        # Step 2: Oracle U_w for target state
        # Adjust bit pre-flips for CZ
        if target_state == "00":
            sim.apply_gate("X", target_qubit=0)
            sim.apply_gate("X", target_qubit=1)
            sim.apply_gate("Z", target_qubit=1, control_qubits=[0])  # CZ
            sim.apply_gate("X", target_qubit=0)
            sim.apply_gate("X", target_qubit=1)
        elif target_state == "01":
            sim.apply_gate("X", target_qubit=0)
            sim.apply_gate("Z", target_qubit=1, control_qubits=[0])
            sim.apply_gate("X", target_qubit=0)
        elif target_state == "10":
            sim.apply_gate("X", target_qubit=1)
            sim.apply_gate("Z", target_qubit=1, control_qubits=[0])
            sim.apply_gate("X", target_qubit=1)
        elif target_state == "11":
            sim.apply_gate("Z", target_qubit=1, control_qubits=[0])

        # Step 3: Grover Diffuser (Amplification operator U_s = 2|s⟩⟨s| - I)
        sim.apply_gate("H", target_qubit=0)
        sim.apply_gate("H", target_qubit=1)
        sim.apply_gate("X", target_qubit=0)
        sim.apply_gate("X", target_qubit=1)

        sim.apply_gate("Z", target_qubit=1, control_qubits=[0])  # CZ

        sim.apply_gate("X", target_qubit=0)
        sim.apply_gate("X", target_qubit=1)
        sim.apply_gate("H", target_qubit=0)
        sim.apply_gate("H", target_qubit=1)

        summary = sim.get_execution_summary()
        summary["algorithm_name"] = "Grover's Search Algorithm"
        summary["target_state"] = target_state
        return summary

    @staticmethod
    def get_qft_circuit(num_qubits: int = 3) -> Dict[str, Any]:
        """
        Generates Quantum Fourier Transform (QFT) circuit for N qubits.
        """
        sim = QuantumSimulator(num_qubits=num_qubits)

        # Apply Hadamard & Controlled Rotations
        for i in range(num_qubits):
            sim.apply_gate("H", target_qubit=i)
            for j in range(i + 1, num_qubits):
                angle = np.pi / (2 ** (j - i))
                sim.apply_gate("RZ", target_qubit=j, control_qubits=[i], params={"theta": angle})

        # Swap qubits for canonical ordering if num_qubits >= 2
        if num_qubits >= 2:
            sim.apply_gate("SWAP", target_qubit=num_qubits - 1, control_qubits=[0])

        summary = sim.get_execution_summary()
        summary["algorithm_name"] = f"{num_qubits}-Qubit Quantum Fourier Transform (QFT)"
        return summary

    @staticmethod
    def get_teleportation_circuit() -> Dict[str, Any]:
        """
        Quantum Teleportation Protocol (3 qubits):
          q0: Alice's state to teleport (prepared in |+⟩)
          q1: Alice's half of Bell pair
          q2: Bob's half of Bell pair
        """
        sim = QuantumSimulator(num_qubits=3, initial_state="000")

        # Step 1: Prepare payload state on q0: |+⟩ = H|0⟩
        sim.apply_gate("H", target_qubit=0)

        # Step 2: Create entangled Bell pair |Φ+⟩ between q1 (Alice) & q2 (Bob)
        sim.apply_gate("H", target_qubit=1)
        sim.apply_gate("X", target_qubit=2, control_qubits=[1])  # CNOT q1->q2

        # Step 3: Alice performs Bell measurement on q0 and q1
        sim.apply_gate("X", target_qubit=1, control_qubits=[0])  # CNOT q0->q1
        sim.apply_gate("H", target_qubit=0)

        meas0 = sim.measure_qubit(target_qubit=0, collapse=True)
        meas1 = sim.measure_qubit(target_qubit=1, collapse=True)

        # Step 4: Bob applies classical corrections based on measurement outcomes
        if meas1["measured_value"] == 1:
            sim.apply_gate("X", target_qubit=2)  # X correction
        if meas0["measured_value"] == 1:
            sim.apply_gate("Z", target_qubit=2)  # Z correction

        summary = sim.get_execution_summary()
        summary["algorithm_name"] = "Quantum Teleportation Protocol"
        summary["teleported_state"] = "|+⟩ = (|0⟩ + |1⟩)/√2"
        return summary
