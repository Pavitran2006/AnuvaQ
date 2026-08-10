"""
AnuvaQ System Configuration
"""

import os
from pydantic_settings import BaseSettings


from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "AnuvaQ Quantum Computing Platform"
    VERSION: str = "2.2.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "anuvaq_secret_jwt_key_super_secure_quantum_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./anuvaq.db")
    CORS_ORIGINS: str = os.getenv(
        "CORS_ORIGINS", 
        "http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173,http://127.0.0.1:3000,*"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGINS or self.CORS_ORIGINS.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def normalized_database_url(self) -> str:
        url = self.DATABASE_URL
        if url and url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    class Config:
        case_sensitive = True


settings = Settings()
