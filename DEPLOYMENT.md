# AetherQ Studio Platform — Production Cloud Deployment Guide

This document outlines the permanent production cloud deployment setup for the **AetherQ Studio Quantum Computing & Noise Simulation Platform**.

---

## 1. Permanent Cloud Architecture

```
                    ┌─────────────────────────┐
                    │     Vercel Host         │
                    │   React 18 + Vite       │
                    │ https://aetherq-studio. │
                    │ vercel.app              │
                    └────────────┬────────────┘
                                 │ HTTPS / CORS
                                 v
                    ┌─────────────────────────┐
                    │     Render Service      │
                    │   FastAPI + Docker      │
                    │ https://aetherq-backend.│
                    │ onrender.com            │
                    └────────────┬────────────┘
                                 │
                                 v
                    ┌─────────────────────────┐
                    │    Managed PostgreSQL   │
                    │   Persistent Cloud DB   │
                    └─────────────────────────┘
```

---

## 2. Infrastructure Configuration

### A. Backend Web Service (Render)
- **Runtime**: Docker (`Dockerfile`)
- **Build Context**: `./`
- **Environment Variables**:
  - `ENVIRONMENT`: `production`
  - `SECRET_KEY`: `<secure-jwt-secret>`
  - `DATABASE_URL`: `postgresql://aetherq_user:password@aetherq-postgres:5432/aetherq_db`
  - `CORS_ORIGINS`: `https://aetherq-studio.vercel.app`
  - `PORT`: `8000`

### B. Database (Render PostgreSQL / Supabase / Neon)
- **Engine**: PostgreSQL 15+
- **Connection**: Managed SQLAlchemy `psycopg2-binary` driver with auto-reconnection and standard table creation (`Base.metadata.create_all`).

### C. Frontend Application (Vercel)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://aetherq-backend.onrender.com/api`

---

## 3. Deployment Steps

### Method 1: Render Blueprint & Vercel Auto-Deploy (Recommended)
1. Push codebase to GitHub repository.
2. In [Render Dashboard](https://dashboard.render.com), click **New** → **Blueprint** and connect your repository. Render will automatically provision the Docker FastAPI Web Service and PostgreSQL database via `render.yaml`.
3. In [Vercel Dashboard](https://vercel.com), import your repository, set root directory to `frontend/`, and add environment variable `VITE_API_URL=https://aetherq-backend.onrender.com/api`.

### Method 2: Manual CLI Deployment
```bash
# Deploy Frontend to Vercel
cd frontend
npx vercel --prod

# Deploy Backend Docker Container to Render / Railway / Fly.io
docker build -t aetherq-backend:latest .
```

---

## 4. Verification Checklist

1. **Backend Health**: `GET https://aetherq-backend.onrender.com/health` → `{"status":"healthy","quantum_engine":"active"}`
2. **Swagger Docs**: `GET https://aetherq-backend.onrender.com/docs`
3. **Frontend Application**: `https://aetherq-studio.vercel.app`
4. **Authentication & Persistence**: Sign Up / Sign In → Save circuit to PostgreSQL database.
5. **Quantum Engine**: Run Bell state, Grover, QFT, and test all 5 Kraus noise channels (Bit Flip, Phase Flip, Depolarizing, Amplitude Damping, Phase Damping).
