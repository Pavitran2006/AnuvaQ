"""
AnuvaQ FastAPI Backend Main Application Entrypoint
"""

import time
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.api import api_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("anuvaq")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Resilient Database Table Creation (Retries up to 5 times for cloud PostgreSQL cold starts)
    max_retries = 5
    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Connecting to database (Attempt {attempt}/{max_retries})...")
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables initialized successfully.")
            break
        except Exception as e:
            logger.warning(f"Database initialization attempt {attempt} failed: {e}")
            if attempt == max_retries:
                logger.error("Could not connect to database after max retries. Proceeding startup...")
            else:
                time.sleep(2)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "quantum_engine": "NumPy Pure Quantum Engine"
    }
