"""
Pydantic Circuit & Workspace Schemas
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any


class CircuitCreate(BaseModel):
    name: str
    description: Optional[str] = None
    num_qubits: int = 2
    gates_json: str = "[]"
    qasm_code: Optional[str] = None
    workspace_id: Optional[str] = None


class CircuitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    num_qubits: Optional[int] = None
    gates_json: Optional[str] = None
    qasm_code: Optional[str] = None


class CircuitResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    num_qubits: int
    gates_json: str
    qasm_code: Optional[str]
    owner_id: str
    workspace_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WorkspaceCreate(BaseModel):
    name: str
    description: Optional[str] = None


class WorkspaceResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    owner_id: str
    created_at: datetime

    class Config:
        from_attributes = True
