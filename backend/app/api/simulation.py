"""
Simulation Engine Router (/api/simulation)
"""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from app.schemas.simulation import SimulationRequest, SimulationResponse, QASMRequest
from app.quantum_engine import QuantumSimulator, NoisyQuantumSimulator, QASMParser, QASMExporter, QuantumGateLibrary, StateVector

router = APIRouter()


@router.post("/run", response_model=SimulationResponse)
def run_simulation(req: SimulationRequest):
    """
    Executes a circuit definition on the custom NumPy Quantum Simulator engine.
    Supports both ideal state-vector simulation and realistic Kraus operator noisy simulation.
    """
    try:
        sim = QuantumSimulator(num_qubits=req.num_qubits, initial_state=req.initial_state)

        noisy_sim = None
        if req.noise_enabled:
            noisy_sim = NoisyQuantumSimulator(num_qubits=req.num_qubits, initial_state=req.initial_state)

        for step in req.gates:
            gate_name = step.gate
            target = step.target
            controls = step.controls or []
            params = step.params or {}

            if gate_name.upper() == "MEASURE":
                sim.measure_qubit(target_qubit=target, collapse=True)
            else:
                sim.apply_gate(gate_name=gate_name, target_qubit=target, control_qubits=controls, params=params)

                if noisy_sim:
                    # Retrieve full unitary matrix for step
                    if gate_name.upper() == "SWAP":
                        full_u = QuantumGateLibrary.get_swap_full_matrix(target, controls[0], req.num_qubits)
                    else:
                        base_u = QuantumGateLibrary.get_base_matrix(gate_name, params)
                        if not controls:
                            full_u = QuantumGateLibrary.get_single_qubit_full_matrix(base_u, target, req.num_qubits)
                        else:
                            full_u = QuantumGateLibrary.get_controlled_gate_full_matrix(base_u, controls, target, req.num_qubits)

                    noisy_sim.apply_unitary(full_u)
                    if req.noise_probability > 0.0:
                        noisy_sim.apply_noise_channel(req.noise_model, req.noise_probability, target)

        shots = req.shots or 1000
        summary = sim.get_execution_summary()
        summary["shots_summary"] = sim.run_shots(shots)
        summary["noise_enabled"] = req.noise_enabled

        if noisy_sim:
            summary["noise_model"] = req.noise_model
            summary["noise_probability"] = req.noise_probability

            # Convert ideal state vector to density matrix for metrics comparison
            ideal_psi = sim.state.vector.reshape(-1, 1)
            rho_ideal = ideal_psi @ ideal_psi.conj().T

            rho_noisy = noisy_sim.rho

            fidelity = NoisyQuantumSimulator.compute_fidelity(rho_ideal, rho_noisy)
            purity = noisy_sim.compute_purity()
            entropy = noisy_sim.compute_entropy()
            trace_dist = NoisyQuantumSimulator.compute_trace_distance(rho_ideal, rho_noisy)

            summary["noisy_probabilities"] = noisy_sim.get_probabilities().tolist()
            summary["noisy_bloch_spheres"] = [noisy_sim.get_bloch_vector(q) for q in range(req.num_qubits)]
            summary["noisy_density_matrix"] = noisy_sim.get_density_matrix_dict()
            summary["quantum_metrics"] = {
                "fidelity": fidelity,
                "purity": purity,
                "entropy": entropy,
                "trace_distance": trace_dist,
                "noise_strength": req.noise_probability,
            }

        return summary
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Simulation error: {str(e)}")


@router.post("/parse-qasm")
def parse_qasm(req: QASMRequest):
    """
    Parses OpenQASM 2.0 source code into AnuvaQ executable circuit instructions.
    """
    try:
        parsed = QASMParser.parse_qasm(req.qasm_code)
        return parsed
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"QASM parsing error: {str(e)}")


@router.post("/export-qasm")
def export_qasm(req: SimulationRequest):
    """
    Converts AnuvaQ circuit definition into standard OpenQASM 2.0.
    """
    try:
        gates_list = [g.dict() for g in req.gates]
        qasm_text = QASMExporter.export_qasm(num_qubits=req.num_qubits, gates=gates_list)
        return {"qasm_code": qasm_text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"QASM export error: {str(e)}")
