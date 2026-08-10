"""
Circuit ORM Model
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Circuit(Base):
    __tablename__ = "circuits"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    num_qubits = Column(Integer, default=2)
    gates_json = Column(Text, nullable=False, default="[]")  # Serialized list of gate dictionaries
    qasm_code = Column(Text, nullable=True)
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="circuits")
    workspace = relationship("Workspace", back_populates="circuits")
