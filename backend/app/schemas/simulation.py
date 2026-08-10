"""
Pydantic Quantum Simulation Schemas
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class GateStep(BaseModel):
    gate: str
    target: int = Field(ge=0, le=7)
    controls: Optional[List[int]] = []
    params: Optional[Dict[str, float]] = {}


class SimulationRequest(BaseModel):
    num_qubits: int = Field(default=2, ge=1, le=8)
    initial_state: Optional[str] = None
    gates: List[GateStep]
    shots: Optional[int] = Field(default=1000, ge=1, le=10000)
    noise_enabled: bool = False
    noise_model: Optional[str] = "bit_flip"
    noise_probability: float = Field(default=0.0, ge=0.0, le=1.0)


class SimulationResponse(BaseModel):
    num_qubits: int
    total_steps: int
    final_amplitudes: List[Dict[str, Any]]
    final_bloch_spheres: List[Dict[str, Any]]
    shots_summary: Dict[str, int]
    step_history: List[Dict[str, Any]]
    noise_enabled: bool = False
    noise_model: Optional[str] = None
    noise_probability: Optional[float] = 0.0
    noisy_probabilities: Optional[List[float]] = None
    noisy_bloch_spheres: Optional[List[Dict[str, float]]] = None
    noisy_density_matrix: Optional[Dict[str, List[List[float]]]] = None
    quantum_metrics: Optional[Dict[str, float]] = None


class QASMRequest(BaseModel):
    qasm_code: str
    shots: Optional[int] = Field(default=1000, ge=1, le=10000)
