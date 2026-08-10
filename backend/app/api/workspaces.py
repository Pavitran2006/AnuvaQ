"""
Workspaces Router (/api/workspaces)
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.workspace import Workspace
from app.models.user import User
from app.schemas.circuit import WorkspaceCreate, WorkspaceResponse
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[WorkspaceResponse])
def list_workspaces(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Workspace).filter(Workspace.owner_id == current_user.id).all()


@router.post("/", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
def create_workspace(
    ws_in: WorkspaceCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    ws = Workspace(
        name=ws_in.name,
        description=ws_in.description,
        owner_id=current_user.id
    )
    db.add(ws)
    db.commit()
    db.refresh(ws)
    return ws
