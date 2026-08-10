"""
Algorithm Library Router (/api/algorithms)
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List
from app.quantum_engine import QuantumAlgorithmLibrary

router = APIRouter()


@router.get("/list")
def list_algorithms() -> List[Dict[str, Any]]:
    return [
        {
            "id": "bell-state",
            "name": "Bell State Generator",
            "category": "Entanglement",
            "qubits": 2,
            "description": "Generates 1 of 4 maximally entangled 2-qubit Bell states: |Φ+⟩, |Φ-⟩, |Ψ+⟩, |Ψ-⟩.",
            "complexity": "O(1)"
        },
        {
            "id": "deutsch-jozsa",
            "name": "Deutsch-Jozsa Algorithm",
            "category": "Quantum Speedup",
            "qubits": 2,
            "description": "Determines if a black-box oracle function is Constant or Balanced in a single quantum query.",
            "complexity": "O(1) vs O(2^(N-1)) classical"
        },
        {
            "id": "grover-search",
            "name": "Grover's Search Algorithm",
            "category": "Quantum Search",
            "qubits": 2,
            "description": "Provides quadratic speedup for searching an unsorted 2-qubit computational state space.",
            "complexity": "O(√N)"
        },
        {
            "id": "qft",
            "name": "Quantum Fourier Transform (QFT)",
            "category": "Transforms",
            "qubits": 3,
            "description": "Quantum version of Discrete Fourier Transform operating on complex state vector amplitudes.",
            "complexity": "O(N^2) vs O(N 2^N) classical"
        },
        {
            "id": "teleportation",
            "name": "Quantum Teleportation Protocol",
            "category": "Communication",
            "qubits": 3,
            "description": "Transfers an unknown single-qubit quantum state from Alice to Bob using an EPR Bell pair and 2 classical bits.",
            "complexity": "O(1)"
        }
    ]


@router.post("/run/{algo_id}")
def run_algorithm(algo_id: str, param: str = Query(default=None)) -> Dict[str, Any]:
    try:
        if algo_id == "bell-state":
            idx = int(param) if param and param.isdigit() else 0
            return QuantumAlgorithmLibrary.get_bell_state_circuit(bell_index=idx)
        elif algo_id == "deutsch-jozsa":
            is_const = True if param == "constant" else False
            return QuantumAlgorithmLibrary.get_deutsch_jozsa_circuit(is_constant=is_const)
        elif algo_id == "grover-search":
            target = param if param in ["00", "01", "10", "11"] else "11"
            return QuantumAlgorithmLibrary.get_grover_search_circuit(target_state=target)
        elif algo_id == "qft":
            num_q = int(param) if param and param.isdigit() else 3
            return QuantumAlgorithmLibrary.get_qft_circuit(num_qubits=min(4, max(2, num_q)))
        elif algo_id == "teleportation":
            return QuantumAlgorithmLibrary.get_teleportation_circuit()
        else:
            raise HTTPException(status_code=404, detail=f"Algorithm '{algo_id}' not found.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error running algorithm {algo_id}: {str(e)}")
