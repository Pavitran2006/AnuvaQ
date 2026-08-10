from fastapi import APIRouter
from .auth import router as auth_router
from .circuits import router as circuits_router
from .simulation import router as simulation_router
from .algorithms import router as algorithms_router
from .workspaces import router as workspaces_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(circuits_router, prefix="/circuits", tags=["Circuits"])
api_router.include_router(simulation_router, prefix="/simulation", tags=["Simulation Engine"])
api_router.include_router(algorithms_router, prefix="/algorithms", tags=["Algorithm Library"])
api_router.include_router(workspaces_router, prefix="/workspaces", tags=["Workspaces"])
