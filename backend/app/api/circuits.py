"""
Circuits CRUD Router (/api/circuits)
"""

import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.circuit import Circuit
from app.models.user import User
from app.schemas.circuit import CircuitCreate, CircuitUpdate, CircuitResponse
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[CircuitResponse])
def list_circuits(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Circuit).filter(Circuit.owner_id == current_user.id).order_by(Circuit.updated_at.desc()).all()


@router.post("/", response_model=CircuitResponse, status_code=status.HTTP_201_CREATED)
def create_circuit(circuit_in: CircuitCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    circuit = Circuit(
        name=circuit_in.name,
        description=circuit_in.description,
        num_qubits=circuit_in.num_qubits,
        gates_json=circuit_in.gates_json,
        qasm_code=circuit_in.qasm_code,
        workspace_id=circuit_in.workspace_id,
        owner_id=current_user.id,
    )
    db.add(circuit)
    db.commit()
    db.refresh(circuit)
    return circuit


@router.get("/{circuit_id}", response_model=CircuitResponse)
def get_circuit(circuit_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id, Circuit.owner_id == current_user.id).first()
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    return circuit


@router.put("/{circuit_id}", response_model=CircuitResponse)
def update_circuit(
    circuit_id: str, 
    circuit_in: CircuitUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id, Circuit.owner_id == current_user.id).first()
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")

    if circuit_in.name is not None:
        circuit.name = circuit_in.name
    if circuit_in.description is not None:
        circuit.description = circuit_in.description
    if circuit_in.num_qubits is not None:
        circuit.num_qubits = circuit_in.num_qubits
    if circuit_in.gates_json is not None:
        circuit.gates_json = circuit_in.gates_json
    if circuit_in.qasm_code is not None:
        circuit.qasm_code = circuit_in.qasm_code

    db.commit()
    db.refresh(circuit)
    return circuit


@router.post("/{circuit_id}/duplicate", response_model=CircuitResponse, status_code=status.HTTP_201_CREATED)
def duplicate_circuit(circuit_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    source = db.query(Circuit).filter(Circuit.id == circuit_id, Circuit.owner_id == current_user.id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Circuit not found")

    new_circuit = Circuit(
        name=f"{source.name} (Copy)",
        description=source.description,
        num_qubits=source.num_qubits,
        gates_json=source.gates_json,
        qasm_code=source.qasm_code,
        workspace_id=source.workspace_id,
        owner_id=current_user.id,
    )
    db.add(new_circuit)
    db.commit()
    db.refresh(new_circuit)
    return new_circuit


@router.delete("/{circuit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_circuit(circuit_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    circuit = db.query(Circuit).filter(Circuit.id == circuit_id, Circuit.owner_id == current_user.id).first()
    if not circuit:
        raise HTTPException(status_code=404, detail="Circuit not found")
    db.delete(circuit)
    db.commit()
    return None
